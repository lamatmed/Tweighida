'use client'
import { useEffect, useState } from 'react'
import { deleteNote, updateNote, getNotesFromAppwrite } from '../actions/noteActions'
import { client } from '@/utils/appwrite'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { FileText, Printer, Search, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner';


export default function ListaDeSelos({ notasIniciais }: { notasIniciais: Note[] }) {
  const [notas, setNotas] = useState<Note[]>(notasIniciais)
  const [editandoNota, setEditandoNota] = useState<string | null>(null)
  const [conteudoAtualizado, setConteudoAtualizado] = useState<string>('')
  const [tituloAtualizado, setTituloAtualizado] = useState<string>('')
  const [vendaAtualizada, setVendaAtualizada] = useState<number>(0)
  const [carregando, setCarregando] = useState({
    atualizacao: null as string | null,
    exclusao: null as string | null,
    global: true
  })

  // Paginação e busca
  const [termoBusca, setTermoBusca] = useState('')
  const [paginaAtual, setPaginaAtual] = useState(1)
  const notasPorPagina = 12

  useEffect(() => {
    const carregarNotas = async () => {
      try {
        const notasAtualizadas = await getNotesFromAppwrite()
        setNotas(notasAtualizadas)
      } catch (erro) {
        console.error('Erro ao carregar selos:', erro)
        toast.error('Falha ao carregar selos')
      } finally {
        setCarregando(prev => ({ ...prev, global: false }))
      }
    }

    carregarNotas()
    const intervalo = setInterval(carregarNotas, 30000)
    return () => clearInterval(intervalo)
  }, [])

  const handleExcluir = async (idNota: string) => {
    if (!confirm('Tem certeza que deseja excluir este selo?')) return

    try {
      setCarregando(prev => ({ ...prev, exclusao: idNota }))
      await deleteNote(idNota)
      setNotas(prev => prev.filter(nota => nota.$id !== idNota))
      toast.success('Selo excluído com sucesso!')
    } catch (erro) {
      console.error('Erro ao excluir:', erro)
      toast.error('Falha ao excluir selo')
    } finally {
      setCarregando(prev => ({ ...prev, exclusao: null }))
    }
  }

  const handleAtualizar = async (idNota: string) => {
    if (!conteudoAtualizado.trim()) {
      toast.error('O campo localização é obrigatório')
      return
    }

    try {
      setCarregando(prev => ({ ...prev, atualizacao: idNota }))
      await updateNote(idNota, conteudoAtualizado, tituloAtualizado, vendaAtualizada)
      setEditandoNota(null)
      setConteudoAtualizado('')
      setVendaAtualizada(0)
      setTituloAtualizado('')
      toast.success('Selo atualizado com sucesso!')
    } catch (erro) {
      console.error('Erro ao atualizar:', erro)
      toast.error('Falha ao atualizar selo')
    } finally {
      setCarregando(prev => ({ ...prev, atualizacao: null }))
    }
  }

  const notasFiltradas = notas.filter(nota =>
    nota.title.toLowerCase().includes(termoBusca.toLowerCase()) ||
    nota.content.toLowerCase().includes(termoBusca.toLowerCase())
  )

  const totalPaginas = Math.ceil(notasFiltradas.length / notasPorPagina)
  const notasExibidas = notasFiltradas.slice((paginaAtual - 1) * notasPorPagina, paginaAtual * notasPorPagina)

  const gerarRelatorioPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    })

    // Cabeçalho moderno
    doc.addFileToVFS('Poppins-Bold.ttf', font)
    doc.addFont('Poppins-Bold.ttf', 'Poppins', 'bold')
    doc.addFileToVFS('Poppins-Regular.ttf', fontRegular)
    doc.addFont('Poppins-Regular.ttf', 'Poppins', 'normal')

    // Fundo degradê
    doc.setFillColor(51, 102, 153)
    doc.rect(0, 0, 210, 30, 'F')

    // Logo e título
    doc.setFont('Poppins', 'bold')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(18)
    doc.text("TWEYIGHIDA COMERCIAL", 105, 18, { align: "center" })

    // Informações da empresa
    doc.setFont('Poppins', 'normal')
    doc.setFontSize(10)
    doc.text("NIF: 5417208523 | Catete-Bengo, Angola", 105, 25, { align: "center" })
    doc.text("Tel: +244 923 456 789 | Email: comercial@tweyighida.com", 105, 30, { align: "center" })

    // Título do relatório
    doc.setFontSize(16)
    doc.setTextColor(51, 102, 153)
    doc.text("RELATÓRIO DE VENDAS DE SELOS", 105, 45, { align: "center" })

    // Tabela de dados
    autoTable(doc, {
      startY: 55,
      head: [
        [
          { content: 'Nº SELO', styles: { fillColor: [51, 102, 153], textColor: 255, fontStyle: 'bold', font: 'Poppins' } },
          { content: 'VALOR (KZ)', styles: { fillColor: [51, 102, 153], textColor: 255, fontStyle: 'bold', font: 'Poppins' } },
          { content: 'LOCALIZAÇÃO', styles: { fillColor: [51, 102, 153], textColor: 255, fontStyle: 'bold', font: 'Poppins' } },
          { content: 'TAXA 7% (KZ)', styles: { fillColor: [51, 102, 153], textColor: 255, fontStyle: 'bold', font: 'Poppins' } }
        ]
      ],
      body: notasFiltradas.map(nota => [
        nota.title,
        { content: nota.venda.toLocaleString('pt-AO'), styles: { halign: 'right' } },
        nota.content,
        { content: (nota.venda * 0.07).toLocaleString('pt-AO', { minimumFractionDigits: 2 }), styles: { halign: 'right' } }
      ]),
      styles: {
        font: 'Poppins',
        fontSize: 10,
        cellPadding: 5,
        halign: 'center'
      },
      headStyles: {
        fillColor: [51, 102, 153],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 25, halign: 'right' },
        2: { cellWidth: 80 },
        3: { cellWidth: 25, halign: 'right' }
      }
    })

    const totalVendas = notasFiltradas.reduce((sum, nota) => sum + nota.venda, 0)
    const totalTaxa = totalVendas * 0.07
    const finalY = (doc as any).lastAutoTable.finalY + 15

    // Totais
    doc.setFont('Poppins', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(51, 102, 153)
    doc.text(`TOTAL DE VENDAS: ${totalVendas.toLocaleString('pt-AO')} KZ`, 105, finalY, { align: "center" })
    doc.text(`TOTAL DE TAXA (7%): ${totalTaxa.toLocaleString('pt-AO', { minimumFractionDigits: 2 })} KZ`, 105, finalY + 8, { align: "center" })
    doc.text(`QUANTIDADE DE SELOS: ${notasFiltradas.length}`, 105, finalY + 16, { align: "center" })

    // Rodapé
    const dataAtual = new Date()
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.text(`Relatório gerado em ${dataAtual.toLocaleDateString('pt-AO')} às ${dataAtual.toLocaleTimeString('pt-AO')}`, 105, 285, { align: "center" })
    doc.text("Sistema de Gestão de Selos v2.0 © 2024 Tweyighida Comercial", 105, 290, { align: "center" })

    doc.save(`Relatorio_Selos_${dataAtual.getTime()}.pdf`)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Cabeçalho */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Gestão de Selos Comerciais</h1>
            <button
              onClick={gerarRelatorioPDF}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition flex items-center gap-2 font-medium"
            >
              <Printer size={18} /> Exportar Relatório
            </button>
          </div>
          <p className="mt-2 opacity-90">Total de selos registados: {notas.length}</p>
        </div>

        {/* Barra de pesquisa */}
        <div className="p-6 border-b">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Pesquisar por número de selo ou localização..."
              value={termoBusca}
              onChange={(e) => {
                setTermoBusca(e.target.value)
                setPaginaAtual(1)
              }}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Lista de selos */}
        {carregando.global ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="divide-y">
            {notasExibidas.length > 0 ? (
              notasExibidas.map(nota => (
                <div key={nota.$id} className="p-6 hover:bg-gray-50 transition">
                  {editandoNota === nota.$id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Número do Selo</label>
                          <input
                            type="text"
                            value={tituloAtualizado}
                            onChange={(e) => setTituloAtualizado(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Valor (KZ)</label>
                          <input
                            type="number"
                            value={vendaAtualizada}
                            onChange={(e) => setVendaAtualizada(Number(e.target.value))}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
                          <input
                            type="text"
                            value={conteudoAtualizado}
                            onChange={(e) => setConteudoAtualizado(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          onClick={() => setEditandoNota(null)}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleAtualizar(nota.$id)}
                          disabled={carregando.atualizacao === nota.$id}
                          className={`px-4 py-2 rounded-lg text-white transition flex items-center gap-2 ${carregando.atualizacao === nota.$id ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                          {carregando.atualizacao === nota.$id ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-blue-800">Selo #{nota.title}</h3>
                        <div className="flex flex-wrap gap-4">
                          <p className="flex items-center gap-2">
                            <span className="font-medium text-gray-700">Valor:</span>
                            <span className="font-bold text-green-600">
                              {nota.venda.toLocaleString('pt-AO')} KZ
                            </span>
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="font-medium text-gray-700">Local:</span>
                            <span className="text-blue-600">{nota.content}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="font-medium text-gray-700">Taxa 7%:</span>
                            <span className="font-bold text-purple-600">
                              {(nota.venda * 0.07).toLocaleString('pt-AO', { minimumFractionDigits: 2 })} KZ
                            </span>
                          </p>
                        </div>
                        {nota.pdfurl && (
                          <a
                            href={nota.pdfurl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition mt-2"
                          >
                            <FileText size={16} /> Ver documento anexado
                          </a>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditandoNota(nota.$id)
                            setTituloAtualizado(nota.title)
                            setVendaAtualizada(nota.venda)
                            setConteudoAtualizado(nota.content)
                          }}
                          className="p-2 text-blue-600 hover:text-blue-800 transition rounded-lg hover:bg-blue-50"
                          title="Editar"
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          onClick={() => handleExcluir(nota.$id)}
                          disabled={carregando.exclusao === nota.$id}
                          className={`p-2 transition rounded-lg ${carregando.exclusao === nota.$id
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-red-600 hover:text-red-800 hover:bg-red-50'
                            }`}
                          title="Excluir"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Search size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-700">Nenhum selo encontrado</h3>
                {termoBusca && (
                  <button
                    onClick={() => setTermoBusca('')}
                    className="mt-4 text-blue-600 hover:text-blue-800 transition font-medium"
                  >
                    Limpar pesquisa
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Paginação */}
        {totalPaginas > 1 && (
          <div className="p-4 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              Mostrando {notasExibidas.length} de {notasFiltradas.length} selos
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPaginaAtual(p => Math.max(p - 1, 1))}
                disabled={paginaAtual === 1}
                className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center px-4">
                Página {paginaAtual} de {totalPaginas}
              </div>
              <button
                onClick={() => setPaginaAtual(p => Math.min(p + 1, totalPaginas))}
                disabled={paginaAtual === totalPaginas}
                className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Fontes embutidas para o PDF (exemplo simplificado)
const font = `
/* latin */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(...) format('woff2');
}
`

const fontRegular = `
/* latin */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(...) format('woff2');
}
`