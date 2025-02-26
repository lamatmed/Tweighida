export default function About() {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">À propos de NotesApp</h1>
        <p className="text-gray-700 leading-relaxed">
          NotesApp est une application simple et intuitive qui vous permet de gérer vos notes en toute simplicité. 
          Notre objectif est de vous offrir une interface fluide et rapide pour organiser vos idées efficacement.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mt-6">📌 Fonctionnalités :</h2>
        <ul className="list-disc list-inside text-gray-600 mt-2">
          <li>Ajouter, modifier et supprimer des notes en temps réel.</li>
          <li>Interface moderne et responsive.</li>
          <li>Stockage sécurisé et synchronisation automatique.</li>
        </ul>
        <h2 className="text-2xl font-semibold text-gray-800 mt-6">💡 Pourquoi utiliser NotesApp ?</h2>
        <p className="text-gray-700 mt-2">
          Nous avons conçu cette application pour vous permettre de prendre des notes rapidement et les retrouver facilement.
          Plus besoin de chercher partout, vos idées sont toujours accessibles !
        </p>
        <div className="mt-6">
          <a href="/" className="text-blue-500 hover:underline">Retour à l'accueil</a>
        </div>
      </div>
    )
  }
  