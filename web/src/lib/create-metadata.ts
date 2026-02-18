import  { type Metadata } from 'next';

type CreateMetadataParams = {
  path: string;

  absoluteTitle?: string;
  description?: string;
  title: string;

  noIndex?: boolean;
};

export function createMetadata({
  path,

  absoluteTitle,
  description,
  title,

  noIndex,
}: CreateMetadataParams) {
  return {
    metadataBase: new URL('https://find-your-dinner.znagy.hu'),

    authors: [
      { name: 'Zétény Nagy', url: 'https://znagy.hu' },
      { name: 'Panna Polyák' },
      { name: 'Benjámin K. Papp' },
    ],
    creator: 'Zétény Nagy, Panna Polyák, Benjámin K. Papp',

    keywords: [''].join(', '),

    description,
    title: absoluteTitle ?? `${title} - Find Your Dinner.`,

    applicationName: 'Find Your Dinner.',

    robots: noIndex
      ? {
          follow: false,
          index: false,
          'max-image-preview': 'none',
          'max-snippet': -1,
          'max-video-preview': -1,
        }
      : {
          follow: true,
          googleBot: {
            follow: true,
            index: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
          index: true,
        },

    openGraph: {
      description,
      images: [
        {
          alt: 'Find Your Dinner.',
          height: 1024,
          type: 'image/png',
          url: '/logo.png',
          width: 1024,
        },
      ],
      locale: 'hu-HU',
      siteName: 'Find Your Dinner.',
      title: absoluteTitle ?? `${title} - Find Your Dinner.`,
      type: 'website',
      url: `https://find-your-dinner.znagy.hu${path}`,
    },

    twitter: {
      card: 'summary',
      description,
      images: ['/logo.png'],
      title: absoluteTitle ?? `${title} - Find Your Dinner.`,
    },

    icons: {
      icon: '/favicon.ico',
    },
  } satisfies Metadata;
}
