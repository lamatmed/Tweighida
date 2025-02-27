export default function About() {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Sobre nós NotesApp</h1>
        <p className="text-gray-700 leading-relaxed">
        NotesApp é um aplicativo simples e intuitivo que permite que você gerencie suas anotações com facilidade.
        O nosso objetivo é fornecer-lhe uma interface suave e rápida para organizar as suas ideias de forma eficiente.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mt-6">📌 Caraterísticas :</h2>
        <ul className="list-disc list-inside text-gray-600 mt-2">
          <li>Adicionar, editar e eliminar notas em tempo real.</li>
          <li>Interface moderna e responsiva.</li>
          <li>Armazenamento seguro e sincronização automática.</li>
        </ul>
        <h2 className="text-2xl font-semibold text-gray-800 mt-6">💡 Porquê utilizar o NotesApp?</h2>
        <p className="text-gray-700 mt-2">
        Nós projetamos este aplicativo para permitir que você tome notas rapidamente e encontrá-los facilmente.
        Não precisa de procurar em todo o lado, as suas ideias estão sempre acessíveis!
        </p>
        <div className="mt-6">
          <a href="/" className="text-blue-500 hover:underline">Voltar à página inicial</a>
        </div>
      </div>
    )
  }
  