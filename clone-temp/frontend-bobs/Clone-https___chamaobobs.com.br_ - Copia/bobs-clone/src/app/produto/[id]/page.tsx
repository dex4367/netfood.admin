import { Metadata } from 'next';
import ProductClient from './page.client';
import { getProductById, getAllProducts } from '@/data/products';

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidar a cada hora

export async function generateStaticParams() {
  const products = getAllProducts();
  
  return products.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = getProductById(params.id);
  
  if (!product) {
    return {
      title: 'Produto não encontrado | Bob\'s',
    };
  }
  
  return {
    title: `${product.name} | Bob\'s`,
    description: product.description,
  };
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);
  
  if (!product) {
    return <div>Produto não encontrado</div>;
  }
  
  return <ProductClient product={product} />;
} 