'use client'
import { useState } from 'react'
import { addNote } from '../actions/noteActions';
import { PlusCircle } from 'lucide-react';

const NewNoteForm = () => {
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [venda, setVenda] = useState<number | "">(""); // Permet les valeurs vides

  <input
    type="number"
    value={venda}
    onChange={(e) => setVenda(e.target.value === "" ? "" : Number(e.target.value))} 
    placeholder="Total de venda"
    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
    required
  />
  
  const [pdfFile, setPdfFile] = useState<File | null>(null) // État pour le fichier PDF
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setPdfFile(file)
    } else {
      alert("Selecione um ficheiro PDF válido.")
      e.target.value = "" // Réinitialise le champ
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (content.trim() !== '' && title.trim() !== '') {
      setLoading(true)

      // Création d'un objet FormData pour envoyer le fichier avec les autres données
      const formData = new FormData()
      formData.append("title", title)
      formData.append("content", content)
      formData.append("venda", venda.toString()) // Ajout de `venda`
      if (pdfFile) {
        formData.append("pdf", pdfFile) // Ajout du fichier PDF
      }

      await addNote(formData) // Fonction à adapter pour gérer l'upload

      setContent('')
      setTitle('')
      setVenda(0)
      setPdfFile(null)
      setLoading(false)
      setShowForm(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-5 p-4 bg-white rounded-lg shadow-md">
      {!showForm && (
      <button
      onClick={() => setShowForm(true)}
      className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 text-sm flex items-center justify-center gap-2"
    >
      <PlusCircle size={20} /> Adicionar uma nota
    </button>
    
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-3 mt-4 animate-fade-in"
        >
          {/* Champ pour le titre */}
          <input
            type="number"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Selo"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            required
          />

          {/* Champ pour la vente */}
          <input
  type="number"
  value={venda}
  onChange={(e) => setVenda(e.target.value === "" ? "" : Number(e.target.value))} 
  placeholder="Total de venda"
  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
  required
/>


          {/* Champ pour le contenu */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escreva a sua localização aqui..."
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24 text-sm"
            required
          />

          {/* Champ pour sélectionner un fichier PDF */}
          <label className="block text-gray-700 text-sm">
            Anexar um arquivo PDF:
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          {/* Affiche le nom du fichier sélectionné si un fichier est ajouté */}
          {pdfFile && <p className="text-xs text-gray-600 truncate">{pdfFile.name}</p>}

          <div className="flex flex-col sm:flex-row justify-between mt-3 gap-2">
            <button
              type="submit"
              className={`w-full sm:w-auto px-4 py-2 rounded-md text-white transition duration-200 text-sm ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
              }`}
              disabled={loading}
            >
              {loading ? 'Adicionando ...' : 'Adicionar'}
            </button>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="w-full sm:w-auto px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition duration-200 text-sm"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default NewNoteForm;
