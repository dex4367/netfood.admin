'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

type ImageWithFallbackProps = ImageProps & {
  fallbackSrc?: string;
};

export default function ImageWithFallback({
  src,
  alt,
  fallbackSrc = "https://via.placeholder.com/400x300?text=Imagem+Indisponível",
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(false);

  return (
    <Image
      {...props}
      src={error ? fallbackSrc : imgSrc}
      alt={alt}
      onError={() => {
        setImgSrc(fallbackSrc);
        setError(true);
      }}
      unoptimized
    />
  );
} 