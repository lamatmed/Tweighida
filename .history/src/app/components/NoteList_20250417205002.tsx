'use client'
import { useEffect, useState } from 'react'
import { deleteNote, updateNote, getNotesFromAppwrite } from '../actions/noteActions'
import { client } from '@/utils/appwrite'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { FileText, Printer } from 'lucide-react'


export default function NoteList({ initialNotes }: { initialNotes: Note[] }) {
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [updatedContent, setUpdatedContent] = useState<string>('')
  const [updatedTitle, setUpdatedTitle] = useState<string>('')
  const [updatedVenda, setUpdatedVenda] = useState<number>(0)
  const [loadingUpdate, setLoadingUpdate] = useState<string | null>(null)
  const [loadingDelete, setLoadingDelete] = useState<string | null>(null)
  const [loading, setLoading] = useState(true) // Indicateur de chargement

  // Pagination et recherche
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const notesPerPage = 1

  useEffect(() => {
    const fetchNotes = async () => {
      try {
       
        const updatedNotes = await getNotesFromAppwrite()
        setNotes(updatedNotes)
      } catch (error) {
        console.error('Erreur lors du rafraîchissement des notes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotes()
    const interval = setInterval(fetchNotes, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const channel = `databases.${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID}.documents`

    const unsubscribe = client.subscribe(channel, (response) => {
      const eventType = response.events[0]
      const changedNote = response.payload as Note

      setNotes((prevNotes) => {
        if (eventType.includes('create')) return [changedNote, ...prevNotes]
        if (eventType.includes('update')) return prevNotes.map((note) => (note.$id === changedNote.$id ? changedNote : note))
        if (eventType.includes('delete')) return prevNotes.filter((note) => note.$id !== changedNote.$id)
        return prevNotes
      })
    })

    return () => unsubscribe()
  }, [])

  const handleDelete = async (noteId: string) => {
    if (!window.confirm('Tem a certeza de que pretende eliminar esta nota?')) return

    try {
      setLoadingDelete(noteId)
      await deleteNote(noteId)
      setNotes((prevNotes) => prevNotes.filter((note) => note.$id !== noteId))
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    } finally {
      setLoadingDelete(null)
    }
  }

  const handleUpdate = async (noteId: string) => {
    if (!updatedContent.trim()) return

    try {
      setLoadingUpdate(noteId)
      await updateNote(noteId, updatedContent, updatedTitle,updatedVenda)
      setEditingNote(null)
      setUpdatedContent('')
      setUpdatedVenda(0)
      setUpdatedTitle('')
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
    } finally {
      setLoadingUpdate(null)
    }
  }

  const filteredNotes = notes.filter((note) => note.title.toLowerCase().includes(searchQuery.toLowerCase()))
  const totalPages = Math.ceil(filteredNotes.length / notesPerPage)
  const displayedNotes = filteredNotes.slice((currentPage - 1) * notesPerPage, currentPage * notesPerPage)


  const generatePDF = () => {
  // Création du document en paysage
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm'
  });

  // Dimensions
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10; // Marge réduite

  // ========== EN-TÊTE COMPACT ==========
  doc.setFillColor(44, 62, 80);
  doc.rect(0, 0, pageWidth, 15, 'F'); // Hauteur réduite
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12); // Taille réduite
  doc.text("TWEYIGHIDA COMERCIAL LDA", pageWidth/2, 8, {align: "center"});
  
  doc.setFontSize(8);
  doc.text("NIF: 5417208523", pageWidth/2, 12, {align: "center"});

  // ========== CORPS DU DOCUMENT ==========
  const tableData = filteredNotes.map(note => [
    note.title,
    `${note.venda.toLocaleString('pt-PT')} KZ`,
    note.content,
    `${(note.venda * 0.07).toLocaleString('pt-PT', {minimumFractionDigits: 2})} KZ`
  ]);

  const totals = {
    venda: filteredNotes.reduce((sum, note) => sum + note.venda, 0),
    percent: filteredNotes.reduce((sum, note) => sum + (note.venda * 0.07), 0),
    registros: filteredNotes.length
  };

  // Tableau ultra-compact
  autoTable(doc, {
    head: [[
      {content: 'Selo', styles: {fillColor: [44,62,80], textColor: 255, fontSize: 8}},
      {content: 'Venda', styles: {fillColor: [44,62,80], textColor: 255, fontSize: 8}},
      {content: 'Local', styles: {fillColor: [44,62,80], textColor: 255, fontSize: 8}}, // Libellé raccourci
      {content: '7%', styles: {fillColor: [44,62,80], textColor: 255, fontSize: 8}} // Libellé raccourci
    ]],
    body: tableData,
    startY: 20, // Position plus haute
    margin: {horizontal: margin},
    styles: {
      fontSize: 7, // Taille réduite
      cellPadding: 1.5, // Padding minimal
      minCellHeight: 5 // Hauteur de ligne réduite
    },
    columnStyles: {
      0: {halign: 'center', cellWidth: 15},
      1: {halign: 'right', cellWidth: 25},
      2: {halign: 'left', cellWidth: 'wrap'}, 
      3: {halign: 'right', cellWidth: 20}
    },
    didDrawPage: () => {
      // Bloque la pagination multiple
      if (doc.getNumberOfPages() > 1) {
        doc.deletePage(2);
      }
    }
  });

  // ========== TOTAUX EN BAS DE PAGE ==========
  const finalY = Math.min((doc as any).lastAutoTable.finalY + 3, pageHeight - 15);
  
  // Style des totaux
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(44, 62, 80);
  doc.setFontSize(9); // Taille réduite

  // Ligne de séparation
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, finalY, pageWidth - margin, finalY);

  // Affichage compact sur une seule ligne
  const totalsText = [
    `Total Vendas: ${totals.venda.toLocaleString('pt-PT')} KZ`,
    `7% Vendas: ${totals.percent.toLocaleString('pt-PT', {minimumFractionDigits: 2})} KZ`,
    `Registros: ${totals.registros}`
  ].join("   |   ");

  doc.text(totalsText, pageWidth/2, finalY + 6, {align: "center"});

  // ========== PIED DE PAGE MINIMAL ==========
  doc.setFontSize(6);
  doc.setTextColor(100, 100, 100);
  doc.text('Sistema de Gestão - v1.0', pageWidth/2, pageHeight-5, {align: "center"});

  doc.save(`relatorio_${new Date().toISOString().slice(0,10)}.pdf`);
};


  return (
    <div className="max-w-md mx-auto mt-5 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-700 text-center">
        Total de Classificações : {notes.length}
      </h2>
      <button
  onClick={generatePDF}
  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 flex items-center justify-center gap-2"
>
  <Printer size={18} /> Gerar Mapa PDF
</button>

      <input
        type="text"
        placeholder="Numero Selo"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border rounded-md my-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {loading ? (
        <div className="flex justify-center items-center ">
        <div className="animate-spin h-10 w-10 border-t-4 border-blue-500 rounded-full"></div>
      </div>
      ) : (
        <ul className="space-y-4">
          {displayedNotes.length > 0 ? (
            displayedNotes.map((note) => (
              <li key={note.$id} className="p-3 bg-gray-50 rounded-lg shadow">
                {editingNote === note.$id ? (
                  <>
                    <input
                      type="number"
                      value={updatedTitle}
                      onChange={(e) => setUpdatedTitle(e.target.value)}
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                      placeholder="Selo"
                    />

                  <input
                      type="number"
                      value={updatedVenda}
                      onChange={(e) => setUpdatedVenda(Number(e.target.value))}
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                      placeholder="Venda"
                    />
                    <input
                      type="text"
                      value={updatedContent}
                      onChange={(e) => setUpdatedContent(e.target.value)}
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Editar  localização"
                    />
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-bold text-gray-800">Selo: {note.title}</h3>
                    <p className="text-green-700 font-bold">Vendas: {note.venda} kz</p>
                    <p className="text-blue-700 font-bold">Localização: {note.content}</p>
                    {note.pdfurl && (
                     <a 
                     href={note.pdfurl} 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="block mt-2 text-blue-500 underline hover:text-blue-700 items-center gap-2"
                   >
                     <FileText size={18} /> Descarregar o ficheiro PDF
                   </a>
                   
                    )}
                  </>
                )}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleDelete(note.$id)}
                    className={`px-3 py-1 rounded text-white transition ${
                      loadingDelete === note.$id ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
                    }`}
                    disabled={loadingDelete === note.$id}
                  >
                    {loadingDelete === note.$id ? 'Supressão...' : 'Suprimir'}
                  </button>
                  {editingNote === note.$id ? (
                    <button
                      onClick={() => handleUpdate(note.$id)}
                      className={`px-3 py-1 rounded text-white transition ${
                        loadingUpdate === note.$id ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                      }`}
                      disabled={loadingUpdate === note.$id}
                    >
                      {loadingUpdate === note.$id ? 'Atualizar...' : 'Recorde'}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingNote(note.$id)
                        setUpdatedTitle(note.title)
                        setUpdatedVenda(note.venda)
                        setUpdatedContent(note.content)
                      }}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Modificar
                    </button>
                  )}
                </div>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500">Não há notas disponíveis.</p>
          )}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50">
          Anterior
          </button>
          <span className="text-gray-700">
          Página {currentPage} / {totalPages}
          </span>
          <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50">
          Seguinte
          </button>
        </div>
      )}
    </div>
  )
}
