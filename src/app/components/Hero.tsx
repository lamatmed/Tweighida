export default function Hero() {
    return (
        <section className="relative w-full h-screen flex items-center justify-center text-center bg-gradient-to-r from-yellow-500 to-indigo-600 text-white">
        <div className="max-w-2xl px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Bienvenue sur <span className="text-yellow-300">NotesApp</span> 📓
          </h1>
          <p className="text-lg md:text-xl mb-7">
            Gérez vos notes facilement et efficacement. Ajoutez, modifiez et supprimez vos notes en toute simplicité.
          </p>
          <a
            href="/notes"
            className="px-6 py-3 text-lg font-semibold bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition"
          >
            Commencer 🚀
          </a>
        </div>
      </section>
    )
  }
  