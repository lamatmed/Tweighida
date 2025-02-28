'use client'
import { useEffect, useState } from "react";
import Loader from "../components/Loader";

export default function About() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simule un chargement court (peut être remplacé par un fetch si besoin)
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Loader/>
    );
  }

  return (
    <div className="max-w-md md:max-w-4xl mx-auto p-6 md:p-12 bg-white shadow-md rounded-lg mt-10 md:mt-16">
      <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
        Sobre nós NotesApp v1
      </h1>
      <p className="text-gray-700 leading-relaxed">
        NotesApp é um aplicativo simples e intuitivo que permite que você gerencie suas anotações com facilidade.
      </p>

      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mt-6">
        📌 Caraterísticas :
      </h2>
      <ul className="list-disc list-inside text-gray-600 mt-2 space-y-2">
        <li>Adicionar, editar e eliminar notas em tempo real.</li>
        <li>Interface moderna e responsiva.</li>
        <li>Armazenamento seguro e sincronização automática.</li>
      </ul>

      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mt-6">
        💡 Porquê utilizar o NotesApp?
      </h2>
      <p className="text-gray-700 mt-2">
        Nós projetamos este aplicativo para permitir que você tome notas rapidamente e encontrá-los facilmente.
      </p>

      <div className="mt-6">
        <a href="/" className="text-blue-500 hover:underline text-lg md:text-xl">
          Voltar à página inicial
        </a>
      </div>
    </div>
  );
}
