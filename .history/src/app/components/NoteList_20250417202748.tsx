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
  const [loading, setLoading] = useState(true)

  // Paginação e pesquisa
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const notesPerPage = 1

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const updatedNotes = await getNotesFromAppwrite()
        setNotes(updatedNotes)
      } catch (error) {
        console.error('Erro ao atualizar notas:', error)
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
    if (!window.confirm('Tem certeza que deseja excluir esta nota?')) return

    try {
      setLoadingDelete(noteId)
      await deleteNote(noteId)
      setNotes((prevNotes) => prevNotes.filter((note) => note.$id !== noteId))
    } catch (error) {
      console.error('Erro ao excluir:', error)
    } finally {
      setLoadingDelete(null)
    }
  }

  const handleUpdate = async (noteId: string) => {
    if (!updatedContent.trim()) return

    try {
      setLoadingUpdate(noteId)
      await updateNote(noteId, updatedContent, updatedTitle, updatedVenda)
      setEditingNote(null)
      setUpdatedContent('')
      setUpdatedVenda(0)
      setUpdatedTitle('')
    } catch (error) {
      console.error('Erro ao atualizar:', error)
    } finally {
      setLoadingUpdate(null)
    }
  }

  const filteredNotes = notes.filter((note) => note.title.toLowerCase().includes(searchQuery.toLowerCase()))
  const totalPages = Math.ceil(filteredNotes.length / notesPerPage)
  const displayedNotes = filteredNotes.slice((currentPage - 1) * notesPerPage, currentPage * notesPerPage)

  const generatePDF = () => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm'
  });

  // Dimensions de la page
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;

  // En-tête moderne avec dégradé
  const gradient = doc.context2d.createLinearGradient(0, 0, pageWidth, 0);
  gradient.addColorStop(0, '#2c3e50'); // Bleu foncé
  gradient.addColorStop(1, '#3498db'); // Bleu clair
  
  doc.setFillColor(44, 62, 80);
  doc.rect(0, 0, pageWidth, 20, 'F');

  // Logo ou nom de l'entreprise
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text("TWEYIGHIDA COMERCIAL LDA", pageWidth / 2, 12, { align: "center" });

  // Informations secondaires
  doc.setFontSize(10);
  doc.text("NIF: 5417208523", pageWidth / 2, 18, { align: "center" });

  // Ligne de séparation décorative
  doc.setDrawColor(255, 193, 7); // Jaune
  doc.setLineWidth(0.8);
  doc.line(margin, 25, pageWidth - margin, 25);

  // Titre du rapport
  doc.setFontSize(14);
  doc.setTextColor(44, 62, 80);
  doc.text('RELATÓRIO DE NOTAS', pageWidth / 2, 32, { align: "center" });

  // Date et heure
  const now = new Date();
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Gerado em: ${now.toLocaleDateString()} às ${now.toLocaleTimeString()}`, margin, 40);

  // Préparation des données
  const tableData = filteredNotes.map((note) => [
    note.title,
    `${note.venda.toLocaleString('pt-PT')} KZ`,
    note.content,
    `${(note.venda * 0.07).toLocaleString('pt-PT', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })} KZ`
  ]);

  const totalVenda = filteredNotes.reduce((sum, note) => sum + note.venda, 0);
  const total7Percent = totalVenda * 0.07;

  // Configuration du tableau avec style amélioré
  autoTable(doc, {
    head: [
      [
        { content: 'Selo', styles: { 
          fillColor: [44, 62, 80], 
          textColor: 255, 
          fontStyle: 'bold',
          halign: 'center'
        }},
        { content: 'Venda', styles: { 
          fillColor: [44, 62, 80], 
          textColor: 255, 
          fontStyle: 'bold',
          halign: 'center'
        }},
        { content: 'Localização', styles: { 
          fillColor: [44, 62, 80], 
          textColor: 255, 
          fontStyle: 'bold',
          halign: 'center'
        }},
        { content: '7% de Venda', styles: { 
          fillColor: [44, 62, 80], 
          textColor: 255, 
          fontStyle: 'bold',
          halign: 'center'
        }}
      ]
    ],
    body: tableData,
    startY: 45,
    theme: 'grid',
    headStyles: { 
      halign: 'center',
      valign: 'middle'
    },
    bodyStyles: {
      valign: 'middle'
    },
    columnStyles: {
      0: { cellWidth: 'auto', halign: 'center' },
      1: { cellWidth: 'auto', halign: 'right' },
      2: { cellWidth: 'auto', halign: 'left' },
      3: { cellWidth: 'auto', halign: 'right' }
    },
    styles: {
      fontSize: 10,
      cellPadding: 4,
      overflow: 'linebreak',
      lineColor: [200, 200, 200],
      lineWidth: 0.3
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    margin: { 
      horizontal: margin,
      top: 45
    },
    tableWidth: 'auto',
    showHead: 'everyPage',
    didDrawPage: () => {
      // Empêche la création de nouvelles pages
      doc.setPage(1);
    }
  });

  const finalY = (doc as any).lastAutoTable.finalY || 45;

  // Section des totaux avec encadré
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(
    margin, 
    finalY + 10, 
    pageWidth - 2 * margin, 
    30, 
    3, 3, 'F'
  );

  doc.setDrawColor(200, 200, 200);
  doc.roundedRect(
    margin, 
    finalY + 10, 
    pageWidth - 2 * margin, 
    30, 
    3, 3, 'S'
  );

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(44, 62, 80);

  doc.text(`Total de Vendas:`, margin + 10, finalY + 20);
  doc.text(`${totalVenda.toLocaleString('pt-PT')} KZ`, pageWidth - margin - 10, finalY + 20, { align: "right" });

  doc.text(`Total 7% de Vendas:`, margin + 10, finalY + 27);
  doc.text(`${total7Percent.toLocaleString('pt-PT', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })} KZ`, pageWidth - margin - 10, finalY + 27, { align: "right" });

  doc.text(`Total de Registros:`, margin + 10, finalY + 34);
  doc.text(`${filteredNotes.length}`, pageWidth - margin - 10, finalY + 34, { align: "right" });

  // Pied de page
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Sistema de Gestão de Notas - Versão 1.0.0', pageWidth / 2, pageHeight - 10, { align: "center" });

  // Numéro de page
  doc.text(`Página 1 de 1`, pageWidth - margin, pageHeight - 10, { align: "right" });

  // Ligne de séparation du pied de page
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

  doc.save(`relatorio_notas_${now.toISOString().slice(0, 10)}.pdf`);
};

  return (
    <div className="max-w-md mx-auto mt-5 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-700 text-center">
        Total de Registros: {notes.length}
      </h2>

      <button
        onClick={generatePDF}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2 rounded-lg hover:from-blue-700 hover:to-blue-900 flex items-center justify-center gap-2 shadow-md transition-all duration-300"
      >
        <Printer size={18} /> Gerar Relatório PDF
      </button>

      <input
        type="text"
        placeholder="Número do Selo"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border rounded-md my-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin h-10 w-10 border-t-4 border-blue-500 rounded-full"></div>
        </div>
      ) : (
        <ul className="space-y-4">
          {displayedNotes.length > 0 ? (
            displayedNotes.map((note) => (
              <li key={note.$id} className="p-3 bg-gray-50 rounded-lg shadow hover:shadow-md transition-shadow">
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
                      placeholder="Editar localização"
                    />
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-bold text-gray-800">Selo: {note.title}</h3>
                    <p className="text-green-700 font-bold">Vendas: {note.venda.toLocaleString('pt-PT')} KZ</p>
                    <p className="text-blue-700 font-bold">Localização: {note.content}</p>
                    {note.pdfurl && (
                      <a
                        href={note.pdfurl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 mt-2 text-blue-500 underline hover:text-blue-700"
                      >
                        <FileText size={18} /> Baixar PDF
                      </a>
                    )}
                  </>
                )}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleDelete(note.$id)}
                    className={`px-3 py-1 rounded-lg text-white transition ${loadingDelete === note.$id ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
                      }`}
                    disabled={loadingDelete === note.$id}
                  >
                    {loadingDelete === note.$id ? 'Excluindo...' : 'Excluir'}
                  </button>
                  {editingNote === note.$id ? (
                    <button
                      onClick={() => handleUpdate(note.$id)}
                      className={`px-3 py-1 rounded-lg text-white transition ${loadingUpdate === note.$id ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                        }`}
                      disabled={loadingUpdate === note.$id}
                    >
                      {loadingUpdate === note.$id ? 'Atualizando...' : 'Salvar'}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingNote(note.$id)
                        setUpdatedTitle(note.title)
                        setUpdatedVenda(note.venda)
                        setUpdatedContent(note.content)
                      }}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                    >
                      Editar
                    </button>
                  )}
                </div>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500">Nenhuma nota encontrada.</p>
          )}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition"
          >
            Anterior
          </button>
          <span className="text-gray-700">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  )
}