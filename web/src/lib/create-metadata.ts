import type { Metadata } from 'next';

export function createMetadata({
  path,
  title,
  absoluteTitle,
  description,
  noIndex,
}: {
  path: string;
  title: string;
  absoluteTitle?: string;
  description?: string;
  noIndex?: boolean;
}): Metadata {
  return {
    metadataBase: new URL('https://find-your-dinner.znagy.hu'),

    authors: [
      { name: 'Zétény Nagy', url: 'https://znagy.hu' },
      { name: 'Panna Polyák' },
      { name: 'Benjámin K. Papp' },
    ],
    creator: 'Zétény Nagy, Panna Polyák, Benjámin K. Papp',

    keywords: [''].join(', '),

    title: absoluteTitle ?? `${title} - Find Your Dinner.`,
    description,

    applicationName: 'Find Your Dinner.',

    robots: noIndex
      ? {
          index: false,
          follow: false,
          'max-video-preview': -1,
          'max-image-preview': 'none',
          'max-snippet': -1,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },

    openGraph: {
      type: 'website',
      url: `https://find-your-dinner.znagy.hu${path}`,
      title: absoluteTitle ?? `${title} - Find Your Dinner.`,
      description,
      siteName: 'Find Your Dinner.',
      locale: 'hu-HU',
      images: [
        {
          url: '/logo.png',
          width: 1024,
          height: 1024,
          alt: 'Find Your Dinner.',
          type: 'image/png',
        },
      ],
    },

    twitter: {
      card: 'summary',
      title: absoluteTitle ?? `${title} - Find Your Dinner.`,
      description,
      images: ['/logo.png'],
    },

    icons: {
      icon: '/favicon.ico',
    },
  };
}
