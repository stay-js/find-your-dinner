'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';

type SafeImageProps = ImageProps & {
  fallbackSrc?: string;
};

export function SafeImage({ fallbackSrc = '/placeholder.png', ...props }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(props.src || fallbackSrc);

  return <Image {...props} src={imgSrc} onError={() => setImgSrc(fallbackSrc)} />;
}
