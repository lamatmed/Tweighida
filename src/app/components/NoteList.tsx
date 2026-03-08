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
  const [updatedVenda, setUpdatedVenda] = useState<number | "">('')
  const [loadingUpdate, setLoadingUpdate] = useState<string | null>(null)
  const [loadingDelete, setLoadingDelete] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const notesPerPage = 10 

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
    const interval = setInterval(fetchNotes, 10000)
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
      
      const vendaValue = updatedVenda === "" ? 0 : updatedVenda;

      if (vendaValue === 0) {
        await deleteNote(noteId)
        setNotes((prevNotes) => prevNotes.filter((note) => note.$id !== noteId))
      } else {
        await updateNote(noteId, updatedContent, updatedTitle, vendaValue)
        setNotes((prevNotes) => 
          prevNotes.map((n) => n.$id === noteId ? { ...n, content: updatedContent, title: updatedTitle, venda: vendaValue } : n)
        )
      }
      setEditingNote(null)
      setUpdatedContent('')
      setUpdatedVenda('')
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

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const generatePDF = () => {
    const doc = new jsPDF();
    const companyName = "TWEYIGHIDA COMERCIAL LDA";
    const companyAddress = "NIF : 5417208523";
    const title = "RELATÓRIO DE VENDAS";

    const headerX = 12;
    const headerY = 10;
    const headerWidth = 186;
    const headerHeight = 25;

    doc.setFillColor(245, 245, 245);
    doc.setDrawColor(200);
    doc.roundedRect(headerX, headerY, headerWidth, headerHeight, 3, 3, 'FD');

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(companyName, 105, headerY + 8, { align: "center" });

    doc.setFontSize(10);
    doc.text(companyAddress, 105, headerY + 14, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 128);
    doc.text(title, 105, headerY + 21, { align: "center" });

    const tableData = filteredNotes.map((note) => [
      note.title,
      `${note.venda.toLocaleString('pt-PT')} KZ`,
      note.content,
      `${(note.venda * 0.07).toLocaleString('pt-PT', { minimumFractionDigits: 2 })} KZ`
    ]);

    autoTable(doc, {
      head: [['Selo', 'Venda', 'Localização', 'Imposto (7%)']],
      body: tableData,
      startY: headerY + headerHeight + 5,
      margin: { top: 20 },
      styles: { 
        overflow: 'linebreak',
        cellPadding: 3,
        fontSize: 9
      },
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: 255
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 40 },
        2: { cellWidth: 70 },
        3: { cellWidth: 40 }
      },
      didDrawPage: function (data) {
        doc.setFontSize(10);
        const pageCount = doc.getNumberOfPages();
        doc.text(
          `Página ${data.pageNumber} / ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }
    });

    const finalY = (doc as any).lastAutoTable.finalY || 40;

    const cardX = 12;
    const cardY = finalY + 10;
    const cardWidth = 186;
    const cardHeight = 40;

    doc.setFillColor(245, 245, 245);
    doc.setDrawColor(200);
    doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 3, 3, 'F');
    doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 3, 3);

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 128);
    doc.text("Resumo das Vendas", cardX + 4, cardY + 8);

    const totalVenda = filteredNotes.reduce((sum, note) => sum + note.venda, 0);
    const total7Percent = totalVenda * 0.07;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`• Total de Vendas: ${totalVenda.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} KZ`, cardX + 4, cardY + 16);
    doc.text(`• Total imposto (7%): ${total7Percent.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} KZ`, cardX + 4, cardY + 24);
    doc.text(`• Total de Classificações: ${filteredNotes.length}`, cardX + 4, cardY + 32);

    const now = new Date();
    const dateGeneration = now.toLocaleDateString();
    const timeGeneration = now.toLocaleTimeString();

    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(
      `Data de Geração: ${dateGeneration} ${timeGeneration} — https://tweighida.vercel.app`,
      14,
      cardY + cardHeight + 10
    );

    doc.save('relatorio_vendas.pdf');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 mb-8 transform transition-all hover:shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Total de Classificações : {notes.length}
          </h2>
          <button
            onClick={generatePDF}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-medium"
          >
            <Printer size={18} /> Gerar Mapa PDF
          </button>
        </div>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Pesquisar por Selo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin h-10 w-10 border-t-4 border-indigo-600 rounded-full"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedNotes.length > 0 ? (
              displayedNotes.map((note) => (
                <div key={note.$id} className="group p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                  {editingNote === note.$id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-500 uppercase ml-1">Selo</label>
                          <input
                            type="number"
                            value={updatedTitle}
                            onChange={(e) => setUpdatedTitle(e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                            placeholder="Selo"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-semibold text-gray-600 ml-1">Valor da Venda (KZ)</label>
                          <input
                            type="number"
                            value={updatedVenda}
                            onChange={(e) => setUpdatedVenda(e.target.value === "" ? "" : Number(e.target.value))}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase ml-1">Localização</label>
                        <input
                          type="text"
                          value={updatedContent}
                          onChange={(e) => setUpdatedContent(e.target.value)}
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                          placeholder="Editar localização"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full uppercase">Selo</span>
                          <h3 className="text-lg font-bold text-gray-800">{note.title}</h3>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <p className="text-emerald-600 font-bold flex items-center gap-1">
                            <span className="text-sm">Vendas:</span> {note.venda.toLocaleString()} kz
                          </p>
                          <p className="text-indigo-600 font-medium flex items-center gap-1">
                            <span className="text-sm text-gray-500">Loc:</span> {note.content}
                          </p>
                        </div>
                        {note.pdfurl && (
                          <a 
                            href={note.pdfurl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-2 mt-3 text-indigo-600 hover:text-indigo-800 transition-colors font-medium text-sm"
                          >
                            <FileText size={16} /> <span>Visualizar PDF</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4 pt-4 border-t border-gray-50">
                    {editingNote === note.$id ? (
                      <>
                        <button
                          onClick={() => setEditingNote(null)}
                          className="w-full sm:w-auto px-4 py-3 sm:py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all text-sm font-medium border border-gray-100 sm:border-none"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleUpdate(note.$id)}
                          className={`w-full sm:w-auto px-6 py-3 sm:py-2 rounded-xl text-white font-medium transition-all text-sm ${
                            loadingUpdate === note.$id ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
                          }`}
                          disabled={loadingUpdate === note.$id}
                        >
                          {loadingUpdate === note.$id ? 'A guardar...' : 'Guardar Alterações'}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleDelete(note.$id)}
                          className={`flex items-center justify-center gap-1.5 w-full sm:w-auto px-4 py-3 sm:py-2 rounded-xl text-sm font-medium transition-all ${
                            loadingDelete === note.$id ? 'bg-gray-100 text-gray-400' : 'text-rose-600 hover:bg-rose-50 border border-rose-50 sm:border-none'
                          }`}
                          disabled={loadingDelete === note.$id}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                          <span>{loadingDelete === note.$id ? 'Eliminando...' : 'Eliminar'}</span>
                        </button>
                        <button
                          onClick={() => {
                            setEditingNote(note.$id)
                            setUpdatedTitle(note.title)
                            setUpdatedVenda(note.venda)
                            setUpdatedContent(note.content)
                          }}
                          className="w-full sm:w-auto px-6 py-3 sm:py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-all text-sm font-medium shadow-sm flex items-center justify-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          <span>Modificar</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">Nenhuma nota encontrada</p>
              </div>
            )}
            
            {error && <div className="mt-4 p-3 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium border border-rose-100 text-center">{error}</div>}
            
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition-all shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm font-medium text-gray-700">
                  <span className="text-gray-500 mr-2">Página</span>
                  <span className="text-indigo-600">{currentPage}</span> 
                  <span className="text-gray-400 mx-1">/</span> 
                  {totalPages}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition-all shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
