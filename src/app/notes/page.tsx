import { getNotesFromAppwrite } from "../actions/noteActions";
import NewNoteForm from "../components/NewNoteForm";
import NoteList from "../components/NoteList";


export default async function Home() {
  const notes: Note[] = await getNotesFromAppwrite()

  return (
<div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
  <header className="w-full max-w-md bg-blue-600 text-white text-center py-4 rounded-lg shadow-md">
    <h1 className="text-2xl font-bold">Observações</h1>
  </header>

  <main className="w-full max-w-md mt-4 space-y-4">
    <NoteList initialNotes={notes} />
    <NewNoteForm />
  </main>
</div>

  );
}
