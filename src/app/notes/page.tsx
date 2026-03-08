import { FileTextIcon } from "lucide-react";
import { getNotesFromAppwrite } from "../actions/noteActions";
import NewNoteForm from "../components/NewNoteForm";
import NoteList from "../components/NoteList";

export default async function Home() {
  const notes: Note[] = await getNotesFromAppwrite()

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Premium Header */}
      <div className="w-full bg-white border-b border-gray-100 py-12 px-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -ml-32 -mb-32 opacity-60"></div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100 mb-6 text-white">
            <FileTextIcon size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Gestão de <span className="text-indigo-600">Vendas</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Acompanhe suas classificações e vendas em tempo real com nosso sistema avançado.
          </p>
        </div>
      </div>

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
