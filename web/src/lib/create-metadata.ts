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
    authors: [
      { name: 'Zétény Nagy', url: 'https://znagy.hu' },
      { name: 'Panna Polyák' },
      { name: 'Benjámin K. Papp' },
    ],
    creator: 'Zétény Nagy, Panna Polyák, Benjámin K. Papp',

    keywords: [''].join(', '),

    title: absoluteTitle ?? `${title} - Recept Tinder`,
    description,

    applicationName: 'Recept Tinder',

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
      url: `url${path}`,
      title: absoluteTitle ?? `${title} - Recept Tinder`,
      description,
      siteName: 'Recept Tinder',
      locale: 'hu-HU',
    },

    twitter: {
      card: 'summary',
      title: absoluteTitle ?? `${title} - Recept Tinder`,
      description,
    },

    icons: {
      icon: '/favicon.ico',
    },
  };
}
