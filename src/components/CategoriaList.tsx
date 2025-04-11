import { type Categoria } from '@/lib/supabase';
import Link from 'next/link';

interface CategoriaListProps {
  categorias: Categoria[];
  categoriaAtiva: string | null;
}

export default function CategoriaList({ categorias, categoriaAtiva }: CategoriaListProps) {
  return (
    <div className="w-full overflow-x-auto my-4">
      <div className="flex space-x-2 min-w-max p-1">
        <Link 
          href="/"
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
            ${!categoriaAtiva 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
        >
          Todos
        </Link>
        
        {categorias.map((categoria) => (
          <Link
            key={categoria.id}
            href={`/categoria/${categoria.id}`}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
              ${categoriaAtiva === categoria.id 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
          >
            {categoria.nome}
          </Link>
        ))}
      </div>
    </div>
  );
} 