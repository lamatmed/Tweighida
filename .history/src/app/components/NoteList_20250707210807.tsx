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

    // ✅ Infos de l'entreprise
    const companyName = "TWEYIGHIDA COMERCIAL LDA";
    const companyAddress = "NIF : 5417208523";
    const title = "RELATÓRIO DE VENDAS";

    // ✅ Dimensions de la carte d'en-tête
    const headerX = 10;
    const headerY = 10;
    const headerWidth = 186;
    const headerHeight = 25;

    // ✅ Card fond + bordure
    doc.setFillColor(245, 245, 245); // Gris clair
    doc.setDrawColor(200); // Bordure gris clair
    doc.roundedRect(headerX, headerY, headerWidth, headerHeight, 3, 3, 'FD'); // 'F' pour fond, 'D' pour draw

    // ✅ Texte dans la carte d'en-tête
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(companyName, 105, headerY + 8, { align: "center" });

    doc.setFontSize(10);
    doc.text(companyAddress, 105, headerY + 14, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 128);
    doc.text(title, 105, headerY + 21, { align: "center" });

    // ✅ Tableau
    const tableData = filteredNotes.map((note) => [
      note.title,
      `${note.venda} KZ`,
      note.content,
      `${(note.venda * 0.07).toFixed(2)} KZ`
    ]);

    const totalVenda = filteredNotes.reduce((sum, note) => sum + note.venda, 0);
    const total7Percent = totalVenda * 0.07;

    autoTable(doc, {
      head: [['Selo', 'Venda', 'Localização', 'Imposto (7%)']],
      body: tableData,
      startY: headerY + headerHeight + 5, // démarre après la carte d'en-tête
    });

    const finalY = (doc as any).lastAutoTable.finalY || 40;

    // ✅ Card Résumé des ventes
    const cardX = 12;
    const cardY = finalY + 10;
    const cardWidth = 186;
    const cardHeight = 40;

    doc.setFillColor(245, 245, 245); // Gris clair
    doc.setDrawColor(200);
    doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 3, 3, 'F');
    doc.setDrawColor(200);
    doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 3, 3);

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 128);
    doc.text("Resumo das Vendas", cardX + 4, cardY + 8);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`• Total de Vendas: ${totalVenda.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} KZ`, cardX + 4, cardY + 16);
    doc.text(`• Total imposto (7%): ${total7Percent.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} KZ`, cardX + 4, cardY + 24);
    doc.text(`• Total de Classificações: ${filteredNotes.length}`, cardX + 4, cardY + 32);

    // ✅ Date de génération
    const now = new Date();
    const dateGeneration = now.toLocaleDateString();
    const timeGeneration = now.toLocaleTimeString();

    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(`Data de Geração: ${dateGeneration} ${timeGeneration} — https://tweighida.vercel.app`, 14, cardY + cardHeight + 10);

    // ✅ Export
    doc.save('notes.pdf');
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
