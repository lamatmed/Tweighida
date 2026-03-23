
import { getNotesFromAppwrite } from "../actions/noteActions";
import NewNoteForm from "../components/NewNoteForm";
import NoteList from "../components/NoteList";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const notes: Note[] = await getNotesFromAppwrite()

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      
      {/* Content Container */}
      <main className="max-w-4xl mx-auto mt-12 px-4 space-y-20">
        {/* List Section at the Top */}
        <section className="relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div className="flex items-center gap-3">
              <div className="w-2 h-10 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Histórico de Vendas</h2>
                <p className="text-slate-500 font-medium">Gestão e exportação de dados</p>
              </div>
            </div>
          </div>
          <NoteList initialNotes={notes} />
        </section>
        
        {/* Registration Section at the Bottom */}
        <section className="pt-12 border-t border-gray-100">
          <NewNoteForm />
        </section>
      </main>
    </div>
  );
}
