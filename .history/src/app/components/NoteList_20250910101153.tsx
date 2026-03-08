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
const [error, setError] = useState<string | null>(null)
  // Pagination et recherche
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const notesPerPage = 1  // Afficher 10 notes par page

  useEffect(() => {
   const fetchNotes = async () => {
  try {
    setError(null);
    const updatedNotes = await getNotesFromAppwrite()
    setNotes(updatedNotes)
  } catch (error) {
    console.error('Erreur lors du rafraîchissement des notes:', error)
    setError('Erreur lors du chargement des notes');
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

  // Couleurs de la palette moderne
  const primaryColor = [41, 128, 185];    // Bleu moderne
  const accentColor = [52, 152, 219];     // Bleu plus clair
  const lightBgColor = [236, 240, 241];   // Fond gris très clair
  const darkTextColor = [44, 62, 80];     // Texte foncé
  const successColor = [46, 204, 113];    // Vert pour les totaux

  // ✅ Infos de l'entreprise avec design moderne
  const companyName = "TWEYIGHIDA COMERCIAL LDA";
  const companyAddress = "NIF: 5417208523";
  const title = "RELATÓRIO DE VENDAS";

  // En-tête moderne avec bande colorée
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, doc.internal.pageSize.width, 30, 'F');
  
  // Logo (texte simulé)
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.setFont(undefined, 'bold');
  doc.text("TC", 15, 20);
  
  // Titre principal centré
  doc.setFontSize(18);
  doc.text(companyName, doc.internal.pageSize.width / 2, 20, { align: "center" });

  // Sous-titre
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255, 0.8);
  doc.text(companyAddress, doc.internal.pageSize.width / 2, 27, { align: "center" });

  // Carte de titre avec ombre simulée
  doc.setFillColor(lightBgColor[0], lightBgColor[1], lightBgColor[2]);
  doc.roundedRect(15, 40, doc.internal.pageSize.width - 30, 15, 3, 3, 'F');
  doc.setDrawColor(200);
  doc.roundedRect(15, 40, doc.internal.pageSize.width - 30, 15, 3, 3);
  
  // Texte du titre
  doc.setFontSize(14);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont(undefined, 'bold');
  doc.text(title, doc.internal.pageSize.width / 2, 50, { align: "center" });

  // ✅ Tableau avec toutes les notes filtrées - design moderne
  const tableData = filteredNotes.map((note) => [
    note.title,
    `${note.venda.toLocaleString('pt-PT')} KZ`,
    note.content,
    `${(note.venda * 0.07).toLocaleString('pt-PT', { minimumFractionDigits: 2 })} KZ`
  ]);

  // ✅ Configuration du tableau avec design moderne
  autoTable(doc, {
    head: [['Selo', 'Venda', 'Localização', 'Imposto (7%)']],
    body: tableData,
    startY: 65,
    theme: 'grid',
    styles: { 
      overflow: 'linebreak',
      cellPadding: 4,
      fontSize: 10,
      textColor: [darkTextColor[0], darkTextColor[1], darkTextColor[2]],
      lineColor: [189, 195, 199],
      lineWidth: 0.25
    },
    headStyles: {
      fillColor: [primaryColor[0], primaryColor[1], primaryColor[2]],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 11
    },
    alternateRowStyles: {
      fillColor: [lightBgColor[0], lightBgColor[1], lightBgColor[2]]
    },
    columnStyles: {
      0: { cellWidth: 25, fontStyle: 'bold' },
      1: { cellWidth: 35, halign: 'right' },
      2: { cellWidth: 80 },
      3: { cellWidth: 35, halign: 'right', fontStyle: 'bold' }
    },
    margin: { top: 65 },
    // Gestion de la pagination automatique
    didDrawPage: function (data) {
      // Ajouter le numéro de page en bas avec style moderne
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      const pageCount = doc.getNumberOfPages();
      doc.text(
        `Página ${data.pageNumber} de ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }
  });

  const finalY = (doc as any).lastAutoTable.finalY || 80;

  // ✅ Section de résumé avec design moderne
  doc.setFillColor(lightBgColor[0], lightBgColor[1], lightBgColor[2]);
  doc.roundedRect(15, finalY + 10, doc.internal.pageSize.width - 30, 45, 5, 5, 'F');
  doc.setDrawColor(200);
  doc.roundedRect(15, finalY + 10, doc.internal.pageSize.width - 30, 45, 5, 5);

  // Titre de la section résumé
  doc.setFontSize(12);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont(undefined, 'bold');
  doc.text("RESUMO DAS VENDAS", 22, finalY + 18);

  const totalVenda = filteredNotes.reduce((sum, note) => sum + note.venda, 0);
  const total7Percent = totalVenda * 0.07;

  // Données du résumé
  doc.setFontSize(10);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.setFont(undefined, 'normal');
  doc.text(`Total de Vendas: ${totalVenda.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} KZ`, 22, finalY + 26);
  doc.text(`Total Imposto (7%): ${total7Percent.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} KZ`, 22, finalY + 34);
  
  doc.setFont(undefined, 'bold');
  doc.setTextColor(successColor[0], successColor[1], successColor[2]);
  doc.text(`Total de Classificações: ${filteredNotes.length}`, 22, finalY + 42);

  // ✅ Pied de page moderne
  const now = new Date();
  const dateGeneration = now.toLocaleDateString('pt-PT');
  const timeGeneration = now.toLocaleTimeString('pt-PT');

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    `Relatório gerado em ${dateGeneration} às ${timeGeneration} - tweighida.vercel.app`,
    doc.internal.pageSize.width / 2,
    doc.internal.pageSize.height - 20,
    { align: 'center' }
  );

  // Ligne de séparation
  doc.setDrawColor(200);
  doc.line(20, doc.internal.pageSize.height - 22, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 22);

  // ✅ Export
  doc.save(`relatorio_vendas_${dateGeneration.replace(/\//g, '-')}.pdf`);
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
{error && <div className="text-red-500">{error}</div>}
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
