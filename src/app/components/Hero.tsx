export default function Hero() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center text-center bg-gradient-to-r from-yellow-500 to-indigo-600 text-white px-4">
      <div className="max-w-2xl px-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          Bem-vindo à <span className="text-yellow-300">NotesApp</span> 📓
        </h1>
        <p className="text-base sm:text-lg md:text-xl mb-7 max-w-md mx-auto">
          Faça a gestão das suas notas de forma fácil e eficiente. Adicione, edite e elimine as suas notas com facilidade.
        </p>
        <a
          href="/notes"
          className="px-6 py-3 text-lg font-semibold bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-transform transform hover:scale-105"
        >
          Começar 🚀
        </a>
      </div>
    </section>
  );
}
