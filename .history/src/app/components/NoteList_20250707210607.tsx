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
  const notesPerPage = 1  // Afficher 10 notes par page

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
  console.log("Total notes before filtering:", notes.length);
  console.log("Filtered notes length:", filteredNotes.length);
  console.log("Search query:", searchQuery);
  const totalPages = Math.ceil(filteredNotes.length / notesPerPage)
  const displayedNotes = filteredNotes.slice((currentPage - 1) * notesPerPage, currentPage * notesPerPage)
  console.log("Displayed notes length:", displayedNotes.length);

  // Fonction pour changer de page
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

 const generatePDF = () => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // ✅ Configuration des couleurs (format RGB individuel)
  const primaryColorR = 0;
  const primaryColorG = 51;
  const primaryColorB = 102;
  const secondaryColorR = 241;
  const secondaryColorG = 243;
  const secondaryColorB = 245;
  const accentColorR = 0;
  const accentColorG = 128;
  const accentColorB = 0;

  // ✅ En-tête avec bandeau coloré
  doc.setFillColor(primaryColorR, primaryColorG, primaryColorB);
  doc.rect(0, 0, pageWidth, 20, 'F');
  
  // Logo
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  doc.text("TC", 15, 15);

  // ✅ Informations de l'entreprise
  doc.setFontSize(14);
  doc.text("TWEYIGHIDA COMERCIAL LDA", pageWidth / 2, 15, { align: "center" });
  
  doc.setFontSize(10);
  doc.text("NIF : 5417208523", pageWidth / 2, 22, { align: "center" });

  // ✅ Titre principal
  doc.setFontSize(16);
  doc.setTextColor(primaryColorR, primaryColorG, primaryColorB);
  doc.text("RELATÓRIO DE VENDAS", pageWidth / 2, 35, { align: "center" });

  // ✅ Ligne de séparation
  doc.setDrawColor(200);
  doc.line(15, 40, pageWidth - 15, 40);

  // ✅ Tableau avec style amélioré
  const tableData = filteredNotes.map((note) => [
    note.title,
    `${note.venda.toLocaleString('pt-PT')} KZ`,
    note.content,
    `${(note.venda * 0.07).toLocaleString('pt-PT', { minimumFractionDigits: 2 })} KZ`
  ]);

  const totalVenda = filteredNotes.reduce((sum, note) => sum + note.venda, 0);
  const total7Percent = totalVenda * 0.07;

  autoTable(doc, {
    startY: 45,
    head: [
      [
        { 
          content: 'Selo', 
          styles: { 
            fillColor: [primaryColorR, primaryColorG, primaryColorB],
            textColor: 255
          } 
        },
        { 
          content: 'Venda', 
          styles: { 
            fillColor: [primaryColorR, primaryColorG, primaryColorB],
            textColor: 255
          } 
        },
        { 
          content: 'Localização', 
          styles: { 
            fillColor: [primaryColorR, primaryColorG, primaryColorB],
            textColor: 255
          } 
        },
        { 
          content: 'Imposto (7%)', 
          styles: { 
            fillColor: [primaryColorR, primaryColorG, primaryColorB],
            textColor: 255
          } 
        }
      ]
    ],
    body: tableData,
    theme: 'grid',
    headStyles: { 
      fontStyle: 'bold',
    },
    alternateRowStyles: { 
      fillColor: [secondaryColorR, secondaryColorG, secondaryColorB] 
    },
    styles: { 
      cellPadding: 3, 
      fontSize: 10 
    },
    margin: { left: 15, right: 15 }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 5;

  // ✅ Section de résumé
  doc.setFillColor(secondaryColorR, secondaryColorG, secondaryColorB);
  doc.roundedRect(15, finalY, pageWidth - 30, 30, 3, 3, 'F');
  doc.setDrawColor(180);
  doc.roundedRect(15, finalY, pageWidth - 30, 30, 3, 3);

  doc.setFontSize(12);
  doc.setTextColor(primaryColorR, primaryColorG, primaryColorB);
  doc.setFont(undefined, 'bold');
  doc.text("RESUMO FINAL", 20, finalY + 8);

  // ✅ Données de résumé
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, 'normal');
  
  doc.text(`Total de Vendas:`, 20, finalY + 18);
  doc.text(`${totalVenda.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} KZ`, 70, finalY + 18, { align: "right" });

  doc.text(`Total Imposto (7%):`, 100, finalY + 18);
  doc.text(`${total7Percent.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} KZ`, 180, finalY + 18, { align: "right" });

  doc.text(`Classificações:`, 20, finalY + 26);
  doc.text(`${filteredNotes.length}`, 70, finalY + 26, { align: "right" });

  // ✅ Pied de page
  const footerY = finalY + 40;
  doc.setDrawColor(200);
  doc.line(15, footerY, pageWidth - 15, footerY);
  
  const now = new Date();
  const dateGeneration = now.toLocaleDateString('pt-PT');
  const timeGeneration = now.toLocaleTimeString('pt-PT', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text(
    `Gerado em ${dateGeneration} às ${timeGeneration} | ${filteredNotes.length} registos | tweighida.vercel.app`,
    pageWidth / 2,
    footerY + 8,
    { align: "center" }
  );

  // ✅ Export
  const fileName = `relatorio_vendas_${dateGeneration.replace(/\//g, '-')}.pdf`;
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
        <div className="flex justify-center items-center">
          <div className="animate-spin h-10 w-10 border-t-4 border-blue-500 rounded-full"></div>
        </div>
      ) : (
        <>
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
              <li className="text-center text-gray-500">Nenhuma nota encontrada</li>
            )}
          </ul>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="px-3 py-1">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
              >
                Próximo
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
