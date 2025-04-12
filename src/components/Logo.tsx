import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface LogoProps {
  width?: number;
  height?: number;
  withLink?: boolean;
}

const Logo = ({ width = 120, height = 60, withLink = false }: LogoProps) => {
  const [imageError, setImageError] = useState(false);
  
  // Se houver erro ao carregar a imagem, exibir o nome em texto
  const logoElement = imageError ? (
    <div 
      className="flex items-center justify-center bg-primary text-white font-bold"
      style={{ width, height, minWidth: width }}
    >
      NetFood
    </div>
  ) : (
    <Image 
      src="/logo.png" 
      alt="NetFood Logo" 
      width={width} 
      height={height}
      className="h-auto w-auto"
      priority
      onError={() => setImageError(true)}
    />
  );

  if (withLink) {
    return (
      <Link href="/" className="inline-block">
        {logoElement}
      </Link>
    );
  }

  return logoElement;
};

export default Logo; 