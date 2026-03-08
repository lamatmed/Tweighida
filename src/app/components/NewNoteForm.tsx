'use client'
import { useState } from 'react'
import { addNote } from '../actions/noteActions';
import { PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const NewNoteForm = () => {
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [venda, setVenda] = useState<number | "">(""); 
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setPdfFile(file)
    } else {
      alert("Selecione um ficheiro PDF válido.")
      e.target.value = "" 
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (content.trim() !== '' && title.trim() !== '') {
      setLoading(true)

      const formData = new FormData()
      formData.append("title", title)
      formData.append("content", content)
      formData.append("venda", venda.toString()) 
      if (pdfFile) {
        formData.append("pdf", pdfFile)
      }

      await addNote(formData)

      setContent('')
      setTitle('')
      setVenda("")
      setPdfFile(null)
      setLoading(false)
      setShowForm(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!showForm ? (
        <div className="text-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Novo Registo</h2>
            <p className="text-gray-500">Registe rapidamente uma nova venda no sistema</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02, translateY: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(true)}
            className="w-full flex items-center justify-center gap-3 py-4 bg-white border-2 border-dashed border-indigo-200 text-indigo-600 rounded-2xl font-bold text-lg hover:border-indigo-400 hover:bg-indigo-50 transition-all shadow-sm hover:shadow-md group"
          >
            <PlusCircle size={24} className="group-hover:rotate-90 transition-transform duration-300" />
            <span>Registar Nova Venda</span>
          </motion.button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Nova Venda</h3>
            <button 
              onClick={() => setShowForm(false)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600 ml-1">Número do Selo</label>
                <input
                  type="number"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: 12345"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600 ml-1">Valor da Venda (KZ)</label>
                <input
                  type="number"
                  value={venda}
                  onChange={(e) => setVenda(e.target.value === "" ? "" : Number(e.target.value))} 
                  placeholder="0.00"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 ml-1">Localização</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Introduza os detalhes da localização..."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none h-28 resize-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 ml-1">Documento PDF (Opcional)</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-gray-400 group-hover:text-indigo-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 font-medium">
                      {pdfFile ? <span className="text-indigo-600 font-bold">{pdfFile.name}</span> : "Clique para carregar PDF"}
                    </p>
                    <p className="text-xs text-gray-400">PDF apenas (Máx. 10MB)</p>
                  </div>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-2xl text-white font-bold text-lg transition-all shadow-lg active:scale-95 ${
                  loading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-indigo-200'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    A processar...
                  </span>
                ) : 'Confirmar Registo'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="w-full py-4 bg-gray-100 text-gray-600 rounded-2xl font-semibold hover:bg-gray-200 transition-all active:scale-95"
              >
                Cancelar
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default NewNoteForm;
