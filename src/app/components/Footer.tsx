import { Facebook, PhoneCall } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-sky-500 text-white text-center p-4 mt-10">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <p className="text-sm sm:text-base">
          © {new Date().getFullYear()} TWEYIGHIDA COMERCIAL LDA - Todos os direitos reservados
        </p>
        {/* Icônes Réseaux Sociaux */}
        <div className="flex space-x-4 mt-2">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
            <Facebook size={24} />
          </a>
          <a href="https://wa.me/244939465408" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
            <PhoneCall size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
}
