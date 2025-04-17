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
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Couleurs modernes
    const primaryColor = [45, 78, 135]; // Bleu foncé
    const secondaryColor = [70, 130, 180]; // Bleu acier
    const accentColor = [220, 53, 69]; // Rouge vif

    // En-tête compact
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 15, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text("TWEYIGHIDA COMERCIAL LDA", 105, 8, { align: "center" });

    doc.setFontSize(8);
    doc.text("NIF : 5417208523", 105, 13, { align: "center" });

    // Titre principal compact
    doc.setFontSize(11);
    doc.setTextColor(...primaryColor);
    doc.text('RELATÓRIO DE VENDAS - RESUMO', 105, 22, { align: "center" });

    // Construction des données du tableau compact
    const tableData = filteredNotes.map((note) => [
      note.title,
      `${note.venda.toLocaleString('pt-PT')} KZ`,
      note.content,
      `${(note.venda * 0.07).toLocaleString('pt-PT', { minimumFractionDigits: 2 })} KZ`
    ]);

    const totalVenda = filteredNotes.reduce((sum, note) => sum + note.venda, 0);
    const total7Percent = totalVenda * 0.07;

    // Tableau compact avec marges réduites
    autoTable(doc, {
      head: [['Selo', 'Venda', 'Local', '7% Venda']],
      body: tableData,
      startY: 28,
      headStyles: {
        fillColor: secondaryColor,
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 8
      },
      bodyStyles: {
        fontSize: 8,
        cellPadding: 3
      },
      styles: {
        fontSize: 8,
        valign: 'middle',
        halign: 'left'
      },
      columnStyles: {
        1: { halign: 'right' },
        3: { halign: 'right' }
      },
      margin: { left: 10, right: 10 }
    });

    const finalY = Math.min((doc as any).lastAutoTable.finalY || 28, 180);

    // Section des totaux compacte
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('TOTAIS:', 14, finalY + 8);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(`Vendas: ${totalVenda.toLocaleString('pt-PT')} KZ`, 14, finalY + 15);
    doc.text(`7% Vendas: ${total7Percent.toLocaleString('pt-PT')} KZ`, 14, finalY + 21);
    doc.text(`Itens: ${filteredNotes.length}`, 14, finalY + 27);

    // Pied de page ultra compact
    const now = new Date();
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Gerado: ${now.toLocaleDateString('pt-PT')} ${now.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })} | NotesApp V1.0.0`,
      105,
      287,
      { align: "center" }
    );

    // Nom de fichier avec timestamp
    const fileName = `vendas_${now.getDate()}${now.getMonth() + 1}${now.getFullYear()}_${now.getHours()}${now.getMinutes()}.pdf`;
    doc.save(fileName);
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
                     className="block mt-2 text-blue-500 underline hover:text-blue-700 flex items-center gap-2"
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
