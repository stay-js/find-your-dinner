'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';

type SafeImageProps = ImageProps & {
  alt: string;
  fallbackSrc?: string;
};

export function SafeImage({ alt, fallbackSrc = '/placeholder.png', ...props }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(props.src || fallbackSrc);

  return <Image {...props} alt={alt} onError={() => setImgSrc(fallbackSrc)} src={imgSrc} />;
}
