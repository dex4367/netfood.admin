import Link from 'next/link';
import './globals.css'; // Importação explícita do CSS

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Página não encontrada</h2>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Desculpe, a página que você está procurando não existe ou foi removida.
      </p>
      <Link 
        href="/" 
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
      >
        Voltar para a página inicial
      </Link>
    </div>
  );
} 