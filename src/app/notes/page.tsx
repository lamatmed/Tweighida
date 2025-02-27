import { getNotesFromAppwrite } from "../actions/noteActions";
import NewNoteForm from "../components/NewNoteForm";
import NoteList from "../components/NoteList";


export default async function Home() {
  const notes: Note[] = await getNotesFromAppwrite()

  return (
<div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 md:p-8">
  {/* En-tête responsive */}
  <header className="w-full max-w-sm md:max-w-2xl bg-blue-600 text-white text-center py-4 rounded-lg shadow-md">
    <h1 className="text-2xl md:text-3xl font-bold">Observações</h1>
  </header>

  {/* Contenu principal responsive */}
  <main className="w-full max-w-sm md:max-w-2xl mt-4 space-y-4 px-4 md:px-12">
    <NoteList initialNotes={notes} />
    <NewNoteForm />
  </main>
</div>


  );
}
