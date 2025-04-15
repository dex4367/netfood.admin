'use client';

import HeaderBobs from './HeaderBobs';

interface HeaderProps {
  categoriaAtiva?: string | null;
}

export default function Header({ categoriaAtiva }: HeaderProps) {
  return (
    <HeaderBobs 
      categoriaAtiva={categoriaAtiva}
      style={{ padding: '5px 0' }} 
    />
  );
} 