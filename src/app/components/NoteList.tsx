'use client'
import { useEffect, useState } from 'react'
import { deleteNote, updateNote } from '../actions/noteActions'
import { client } from '@/utils/appwrite'

export default function NoteList({ initialNotes }: { initialNotes: Note[] }) {
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [updatedContent, setUpdatedContent] = useState<string>('')
  const [updatedTitle, setUpdatedTitle] = useState<string>('')
  const [loadingUpdate, setLoadingUpdate] = useState<string | null>(null)
  const [loadingDelete, setLoadingDelete] = useState<string | null>(null)

  // Pagination et recherche
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const notesPerPage = 5

  useEffect(() => {
    const channel = `databases.${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID}.documents`

    const unsubscribe = client.subscribe(channel, (response) => {
      const eventType = response.events[0]
      const changedNote = response.payload as Note

      setNotes((prevNotes) => {
        if (eventType.includes('create')) {
          return [changedNote, ...prevNotes]
        }
        if (eventType.includes('update')) {
          return prevNotes.map((note) =>
            note.$id === changedNote.$id ? changedNote : note
          )
        }
        if (eventType.includes('delete')) {
          return prevNotes.filter((note) => note.$id !== changedNote.$id)
        }
        return prevNotes
      })
    })

    return () => unsubscribe()
  }, [])

  const handleDelete = async (noteId: string) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette note ?')) return

    try {
      setLoadingDelete(noteId)
      await deleteNote(noteId)
      setNotes((prevNotes) => prevNotes.filter((note) => note.$id !== noteId))
    } catch (error) {
      console.error('Erreur lors de la suppression de la note:', error)
    } finally {
      setLoadingDelete(null)
    }
  }

  const handleUpdate = async (noteId: string) => {
    if (!updatedContent.trim()) return

    try {
      setLoadingUpdate(noteId)
      await updateNote(noteId, updatedContent,updatedTitle)
      setEditingNote(null)
      setUpdatedContent('')
      setUpdatedTitle('')
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la note:', error)
    } finally {
      setLoadingUpdate(null)
    }
  }

  // Filtrage des notes selon la recherche
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Pagination
  const totalPages = Math.ceil(filteredNotes.length / notesPerPage)
  const displayedNotes = filteredNotes.slice(
    (currentPage - 1) * notesPerPage,
    currentPage * notesPerPage
  )

  return (
    <div className="max-w-md mx-auto mt-5 p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-700 text-center">
        Nombre total de notes : {notes.length}
      </h2>

      {/* Champ de recherche */}
      <input
        type="text"
        placeholder="Rechercher une note..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border rounded-md my-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Liste des notes */}
      <ul className="space-y-4">
        {displayedNotes.length > 0 ? (
          displayedNotes.map((note) => (
            <li key={note.$id} className="p-3 bg-white rounded-lg shadow">
              {editingNote === note.$id ? (
                <>
                  <input
                    type="text"
                    value={updatedTitle}
                    onChange={(e) => setUpdatedTitle(e.target.value)}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                    placeholder="Modifier le titre"
                  />
                  <input
                    type="text"
                    value={updatedContent}
                    onChange={(e) => setUpdatedContent(e.target.value)}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Modifier le contenu"
                  />
                </>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-gray-800">{note.title}</h3>
                  <p className="text-gray-700">{note.content}</p>
                  {note.pdfurl && (
  <a
    href={note.pdfurl}
    target="_blank"
    rel="noopener noreferrer"
    className="block mt-2 text-blue-500 underline hover:text-blue-700"
  >
    Télécharger le PDF
  </a>
)}

               
                </>
              )}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleDelete(note.$id)}
                  className={`px-3 py-1 rounded text-white transition ${
                    loadingDelete === note.$id
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                  disabled={loadingDelete === note.$id}
                >
                  {loadingDelete === note.$id ? 'Suppression...' : 'Supprimer'}
                </button>
                {editingNote === note.$id ? (
                  <button
                    onClick={() => handleUpdate(note.$id)}
                    className={`px-3 py-1 rounded text-white transition ${
                      loadingUpdate === note.$id
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                    disabled={loadingUpdate === note.$id}
                  >
                    {loadingUpdate === note.$id
                      ? 'Enregistrement...'
                      : 'Enregistrer'}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingNote(note.$id)
                      setUpdatedTitle(note.title)
                      setUpdatedContent(note.content)
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Modifier
                  </button>
                )}
              </div>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500">Aucune note disponible.</p>
        )}
      </ul>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Précédent
          </button>
          <span className="text-gray-700">
            Page {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  )
}
