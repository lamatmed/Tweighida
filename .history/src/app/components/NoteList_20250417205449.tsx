'use client'
import { useEffect, useState } from 'react'
import { deleteNote, updateNote, getNotesFromAppwrite } from '../actions/noteActions'
import { client } from '@/utils/appwrite'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { FileText, Printer, Edit, Trash2, Check, X, ChevronLeft, ChevronRight } from 'lucide-react'

export default function NoteList({ initialNotes }: { initialNotes: Note[] }) {
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [updatedContent, setUpdatedContent] = useState<string>('')
  const [updatedTitle, setUpdatedTitle] = useState<string>('')
  const [updatedVenda, setUpdatedVenda] = useState<number>(0)
  const [loadingUpdate, setLoadingUpdate] = useState<string | null>(null)
  const [loadingDelete, setLoadingDelete] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Pagination et recherche
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const notesPerPage = 5 // Augmenté pour une meilleure UX

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
      await updateNote(noteId, updatedContent, updatedTitle, updatedVenda)
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

  const cancelEdit = () => {
    setEditingNote(null)
    setUpdatedContent('')
    setUpdatedVenda(0)
    setUpdatedTitle('')
  }

  const filteredNotes = notes.filter((note) => note.title.toLowerCase().includes(searchQuery.toLowerCase()))
  const totalPages = Math.ceil(filteredNotes.length / notesPerPage)
  const displayedNotes = filteredNotes.slice((currentPage - 1) * notesPerPage, currentPage * notesPerPage)

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm'
    })

    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 10

    // En-tête
    doc.setFillColor(44, 62, 80)
    doc.rect(0, 0, pageWidth, 15, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.text("TWEYIGHIDA COMERCIAL LDA", pageWidth / 2, 8, { align: "center" })

    doc.setFontSize(8)
    doc.text("NIF: 5417208523", pageWidth / 2, 12, { align: "center" })

    // Tableau
    const tableData = filteredNotes.map(note => [
      note.title,
      `${note.venda.toLocaleString('pt-PT')} KZ`,
      note.content,
      `${(note.venda * 0.07).toLocaleString('pt-PT', { minimumFractionDigits: 2 })} KZ`
    ])

    const totals = {
      venda: filteredNotes.reduce((sum, note) => sum + note.venda, 0),
      percent: filteredNotes.reduce((sum, note) => sum + (note.venda * 0.07), 0),
      registros: filteredNotes.length
    }

    autoTable(doc, {
      head: [[
        { content: 'Selo', styles: { fillColor: [44, 62, 80], textColor: 255, fontSize: 8 } },
        { content: 'Venda', styles: { fillColor: [44, 62, 80], textColor: 255, fontSize: 8 } },
        { content: 'Local', styles: { fillColor: [44, 62, 80], textColor: 255, fontSize: 8 } },
        { content: '7%', styles: { fillColor: [44, 62, 80], textColor: 255, fontSize: 8 } }
      ]],
      body: tableData,
      startY: 20,
      margin: { horizontal: margin },
      styles: {
        fontSize: 7,
        cellPadding: 1.5,
        minCellHeight: 5
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 15 },
        1: { halign: 'right', cellWidth: 25 },
        2: { halign: 'left', cellWidth: 'wrap' },
        3: { halign: 'right', cellWidth: 20 }
      },
      didDrawPage: () => {
        if (doc.getNumberOfPages() > 1) {
          doc.deletePage(2)
        }
      }
    })

    // Totaux
    const finalY = Math.min((doc as any).lastAutoTable.finalY + 3, pageHeight - 15)

    doc.setFont('helvetica', 'bold')
    doc.setTextColor(44, 62, 80)
    doc.setFontSize(9)

    doc.setDrawColor(200, 200, 200)
    doc.line(margin, finalY, pageWidth - margin, finalY)

    const totalsText = [
      `Total Vendas: ${totals.venda.toLocaleString('pt-PT')} KZ`,
      `7% Vendas: ${totals.percent.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} KZ`,
      `Registros: ${totals.registros}`
    ].join("   |   ")

    doc.text(totalsText, pageWidth / 2, finalY + 6, { align: "center" })

    // Pied de page
    doc.setFontSize(6)
    doc.setTextColor(100, 100, 100)
    doc.text('Sistema de Gestão - v1.0', pageWidth / 2, pageHeight - 5, { align: "center" })

    doc.save(`relatorio_${new Date().toISOString().slice(0, 10)}.pdf`)
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-800">
          Total de Classificações: <span className="text-blue-600">{notes.length}</span>
        </h2>

        <div className="flex gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Pesquisar por número de selo..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <button
            onClick={generatePDF}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md"
          >
            <Printer size={18} />
            <span className="hidden sm:inline">Gerar Mapa PDF</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin h-12 w-12 border-t-4 border-blue-500 rounded-full"></div>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {displayedNotes.length > 0 ? (
              displayedNotes.map((note) => (
                <div key={note.$id} className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  {editingNote === note.$id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Selo</label>
                          <input
                            type="number"
                            value={updatedTitle}
                            onChange={(e) => setUpdatedTitle(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Número do selo"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Venda (KZ)</label>
                          <input
                            type="number"
                            value={updatedVenda}
                            onChange={(e) => setUpdatedVenda(Number(e.target.value))}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Valor da venda"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
                          <input
                            type="text"
                            value={updatedContent}
                            onChange={(e) => setUpdatedContent(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Localização"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={cancelEdit}
                          className="flex items-center gap-1 px-3 py-1.5 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                        >
                          <X size={16} /> Cancelar
                        </button>
                        <button
                          onClick={() => handleUpdate(note.$id)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-white transition ${loadingUpdate === note.$id ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                            }`}
                          disabled={loadingUpdate === note.$id}
                        >
                          {loadingUpdate === note.$id ? (
                            'Salvando...'
                          ) : (
                            <>
                              <Check size={16} /> Salvar
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Selo</h3>
                          <p className="text-lg font-bold text-gray-800">{note.title}</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Vendas</h3>
                          <p className="text-lg font-bold text-green-600">{note.venda.toLocaleString('pt-PT')} KZ</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Localização</h3>
                          <p className="text-lg font-bold text-blue-600">{note.content}</p>
                        </div>
                      </div>

                      {note.pdfurl && (
                        <div className="mt-3">
                          <a
                            href={note.pdfurl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
                          >
                            <FileText size={16} /> Descarregar PDF
                          </a>
                        </div>
                      )}

                      <div className="flex justify-end gap-2 mt-4">
                        <button
                          onClick={() => handleDelete(note.$id)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-white transition ${loadingDelete === note.$id ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                            }`}
                          disabled={loadingDelete === note.$id}
                        >
                          {loadingDelete === note.$id ? (
                            'Excluindo...'
                          ) : (
                            <>
                              <Trash2 size={16} /> Excluir
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setEditingNote(note.$id)
                            setUpdatedTitle(note.title)
                            setUpdatedVenda(note.venda)
                            setUpdatedContent(note.content)
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        >
                          <Edit size={16} /> Editar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Nenhum registro encontrado</p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Limpar pesquisa
                  </button>
                )}
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition"
              >
                <ChevronLeft size={18} /> Anterior
              </button>

              <span className="text-gray-700 font-medium">
                Página {currentPage} de {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition"
              >
                Próxima <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}