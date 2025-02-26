export default function Navbar() {
    return (
      <nav className="bg-gray-600 text-white p-4 shadow-md">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">TWEYIGHIDA COMERCIAL LDA </h1>
          <ul className="flex space-x-4">
            <li><a href="/" className="hover:underline">Accueil</a></li>
            <li><a href="/notes" className="hover:underline">Notes</a></li>
            <li><a href="/about" className="hover:underline">À propos</a></li>
          </ul>
        </div>
      </nav>
    )
  }
  