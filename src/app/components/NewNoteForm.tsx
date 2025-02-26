'use client'
import { useState } from 'react'
import { addNote } from '../actions/noteActions';

const NewNoteForm = () => {
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [pdfFile, setPdfFile] = useState<File | null>(null) // État pour le fichier PDF
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setPdfFile(file)
    } else {
      alert("Veuillez sélectionner un fichier PDF valide.")
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
      if (pdfFile) {
        formData.append("pdf", pdfFile) // Ajout du fichier PDF
      }

      await addNote(formData) // Fonction à adapter pour gérer l'upload

      setContent('')
      setTitle('')
      setPdfFile(null)
      setLoading(false)
      setShowForm(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Ajouter une note
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-3 mt-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Écris ta note ici..."
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24"
          />

          {/* Champ pour sélectionner un fichier PDF */}
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {pdfFile && <p className="text-sm text-gray-600">{pdfFile.name}</p>} {/* Affiche le nom du fichier sélectionné */}

          <div className="flex justify-between">
            <button
              type="submit"
              className={`px-4 py-2 rounded-md text-white transition ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
              }`}
              disabled={loading}
            >
              {loading ? 'Ajout en cours...' : 'Ajouter'}
            </button>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition"
            >
              Annuler
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default NewNoteForm;
