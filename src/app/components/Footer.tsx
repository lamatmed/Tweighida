export default function Footer() {
  return (
    <footer className="bg-sky-600 text-white text-center p-4 mt-10">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <p className="text-sm sm:text-base">
          © {new Date().getFullYear()} TWEYIGHIDA COMERCIAL LDA - Todos os direitos reservados
        </p>
      </div>
    </footer>
  );
}
