import Link from 'next/link';
import './globals.css';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Página não encontrada</h2>
        <p className="text-lg text-gray-600 mb-8">
          A página que você está procurando não existe ou foi removida.
        </p>
        <Link 
          href="/"
          className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
        >
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
} 