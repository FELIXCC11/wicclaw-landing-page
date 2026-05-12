import type { Metadata } from 'next'
import './globals.css'

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3001'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'WicClaw — AI mini boxes for local business',
  description:
    'Plug-and-play AI support for local businesses, controlled through Telegram, powered by a mini device and a master WicClaw control layer.',
  keywords: ['AI', 'automation', 'local business', 'Telegram', 'mini box', 'WicClaw'],
  openGraph: {
    title: 'WicClaw — AI mini boxes for local business',
    description:
      'Plug-and-play AI support for local businesses, controlled through Telegram, powered by a mini device and a master WicClaw control layer.',
    siteName: 'WicClaw',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-img=wicclaw.jpg',
        width: 1366,
        height: 768,
        alt: 'WicClaw — AI mini boxes for local business',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WicClaw — AI mini boxes for local business',
    description:
      'Plug-and-play AI support for local businesses, controlled through Telegram, powered by a mini device and a master WicClaw control layer.',
    images: ['/og-img=wicclaw.jpg'],
  },
  icons: {
    icon: '/Favicon.svg',
    shortcut: '/Favicon.svg',
    apple: '/Logo-orange.png',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
