import './global.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Navbar } from './components/nav'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import 'katex/dist/katex.min.css';
import { baseUrl } from './sitemap'
import { ThemeProvider } from 'next-themes'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Liran S. | Full-Stack Developer & Portfolio',
    template: '%s | LiranS',
  },
  description:
    'Full-stack software developer portfolio featuring projects in web development, local-first applications, encryption, software architecture, and technical writing.',
  keywords: [
    'Liran',
    'LiranS',
    'Full-Stack Developer',
    'Software Engineer',
    'Portfolio',
    'Web Development',
    'React',
    'Next.js',
    'TypeScript',
    'Encryption',
    'Local-First Apps',
  ],
  authors: [{ name: 'Liran', url: baseUrl }],
  creator: 'Liran',
  publisher: 'LiranS',
  alternates: {
    canonical: './',
  },
  openGraph: {
    title: 'Liran S. | Full-Stack Developer & Portfolio',
    description:
      'Full-stack software developer portfolio featuring projects in web development, local-first applications, encryption, software architecture, and technical writing.',
    url: baseUrl,
    siteName: 'LiranS Portfolio',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${baseUrl}/og?title=${encodeURIComponent('LiranS - Full-Stack Developer & Portfolio')}`,
        width: 1200,
        height: 630,
        alt: 'LiranS Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Liran S. | Full-Stack Developer & Portfolio',
    description:
      'Full-stack software developer portfolio featuring projects in web development, local-first applications, encryption, software architecture, and technical writing.',
    images: [`${baseUrl}/og?title=${encodeURIComponent('LiranS - Full-Stack Developer & Portfolio')}`],
  },
  robots: {
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
}

const cx = (...classes) => classes.filter(Boolean).join(' ')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (

    <html
      lang="en"
      className={cx(
        '',
        GeistSans.variable,
        GeistMono.variable
      )}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebSite',
                  '@id': `${baseUrl}/#website`,
                  url: baseUrl,
                  name: 'LiranS',
                  description:
                    'Full-stack software developer portfolio featuring projects in web development, local-first applications, encryption, and technical writing.',
                  author: {
                    '@id': `${baseUrl}/#person`,
                  },
                },
                {
                  '@type': 'Person',
                  '@id': `${baseUrl}/#person`,
                  name: 'Liran',
                  url: baseUrl,
                  jobTitle: 'Full-Stack Developer',
                  sameAs: ['https://github.com/iLiranS'],
                },
              ],
            }),
          }}
        />
      </head>
      <body className="subpixel-antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <main className="max-w-3xl mx-auto mb-16 mt-4 px-4 sm:px-6 flex-auto min-w-0 flex flex-col">
            <Navbar />
            <div className="mt-8 animate-fade-in">
              {children}
            </div>
            <Analytics />
            <SpeedInsights />
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
