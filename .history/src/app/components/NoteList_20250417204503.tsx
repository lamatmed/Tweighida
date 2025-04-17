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
  // Création du document PDF en format paysage
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm'
  });

  // Dimensions de la page
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;

  // ==================== EN-TÊTE ====================
  doc.setFillColor(44, 62, 80); // Fond bleu foncé
  doc.rect(0, 0, pageWidth, 18, 'F');

  // Nom de l'entreprise
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text("TWEYIGHIDA COMERCIAL LDA", pageWidth / 2, 10, { align: "center" });

  // NIF
  doc.setFontSize(9);
  doc.text("NIF: 5417208523", pageWidth / 2, 15, { align: "center" });

  // Ligne décorative
  doc.setDrawColor(255, 193, 7); // Jaune
  doc.setLineWidth(0.3);
  doc.line(margin, 20, pageWidth - margin, 20);

  // ==================== TITRE ====================
  doc.setFontSize(12);
  doc.setTextColor(44, 62, 80);
  doc.text('RELATÓRIO DE NOTAS', pageWidth / 2, 27, { align: "center" });

  // Date et heure
  const now = new Date();
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`Gerado em: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`, margin, 33);

  // ==================== TABLEAU ====================
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

  // Configuration du tableau
  autoTable(doc, {
    head: [
      [
        { content: 'Selo', styles: { 
          fillColor: [44, 62, 80], 
          textColor: 255, 
          fontStyle: 'bold',
          fontSize: 9
        }},
        { content: 'Venda', styles: { 
          fillColor: [44, 62, 80], 
          textColor: 255, 
          fontStyle: 'bold',
          fontSize: 9
        }},
        { content: 'Localização', styles: { 
          fillColor: [44, 62, 80], 
          textColor: 255, 
          fontStyle: 'bold',
          fontSize: 9
        }},
        { content: '7% Venda', styles: { 
          fillColor: [44, 62, 80], 
          textColor: 255, 
          fontStyle: 'bold',
          fontSize: 9
        }}
      ]
    ],
    body: tableData,
    startY: 36,
    theme: 'grid',
    headStyles: { 
      halign: 'center',
      valign: 'middle',
      cellPadding: 2
    },
    bodyStyles: {
      valign: 'middle',
      fontSize: 8,
      cellPadding: 2,
      minCellHeight: 6
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 'auto' },
      1: { halign: 'right', cellWidth: 'auto' },
      2: { halign: 'left', cellWidth: 'wrap' },
      3: { halign: 'right', cellWidth: 'auto' }
    },
    styles: {
      lineColor: [200, 200, 200],
      lineWidth: 0.2
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    margin: { 
      horizontal: margin,
      top: 36
    },
    tableWidth: 'auto',
    didDrawPage: () => {
      if (doc.getNumberOfPages() > 1) {
        doc.deletePage(2);
      }
    }
  });

  const finalY = Math.min((doc as any).lastAutoTable.finalY || 36, pageHeight - 30);

  // ==================== SECTION TOTAUX ====================
  // Fond et bordure
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, finalY + 5, pageWidth - 2 * margin, 22, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.rect(margin, finalY + 5, pageWidth - 2 * margin, 22);

  // Style des totaux
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(44, 62, 80);
  doc.setFontSize(10);

  // Position de départ
  const totalsY = finalY + 10;

  // Total Vendas
  doc.text("Total Vendas:", margin + 5, totalsY);
  doc.text(`${totalVenda.toLocaleString('pt-PT')} KZ`, pageWidth - margin - 5, totalsY, { align: "right" });

  // 7% Vendas
  doc.text("7% Vendas:", margin + 5, totalsY + 8);
  doc.text(`${total7Percent.toLocaleString('pt-PT', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  })} KZ`, pageWidth - margin - 5, totalsY + 8, { align: "right" });

  // Registros
  doc.text("Registros:", margin + 5, totalsY + 16);
  doc.text(filteredNotes.length.toString(), pageWidth - margin - 5, totalsY + 16, { align: "right" });

  // ==================== PIED DE PAGE ====================
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text('Sistema de Gestão de Notas - Versão 1.0.0', pageWidth / 2, pageHeight - 8, { align: "center" });
  doc.text('Página 1/1', pageWidth - margin, pageHeight - 8, { align: "right" });

  // Sauvegarde du PDF
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
                    className={`px-3 py-1 rounded-lg text-white transition ${
                      loadingDelete === note.$id ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
                    }`}
                    disabled={loadingDelete === note.$id}
                  >
                    {loadingDelete === note.$id ? 'Excluindo...' : 'Excluir'}
                  </button>
                  {editingNote === note.$id ? (
                    <button
                      onClick={() => handleUpdate(note.$id)}
                      className={`px-3 py-1 rounded-lg text-white transition ${
                        loadingUpdate === note.$id ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
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