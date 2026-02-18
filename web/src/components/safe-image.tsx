'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';

type SafeImageProps = ImageProps & {
  fallbackSrc?: string;
  alt: string;
};

export function SafeImage({ fallbackSrc = '/placeholder.png', alt, ...props }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(props.src || fallbackSrc);

  return <Image {...props} src={imgSrc} alt={alt} onError={() => setImgSrc(fallbackSrc)} />;
}
