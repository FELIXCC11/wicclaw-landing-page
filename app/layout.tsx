import type { Metadata } from 'next'
import './globals.css'

/* IBM Plex Mono is loaded via the CSS @import below to avoid
   the Google Fonts network fetch that fails behind strict SSL proxies. */

export const metadata: Metadata = {
  title: 'WicClaw — AI mini boxes for local business',
  description:
    'Plug-and-play AI support for local businesses, controlled through Telegram, powered by a mini device and a master WicClaw control layer.',
  keywords: ['AI', 'automation', 'local business', 'Telegram', 'mini box', 'WicClaw'],
  openGraph: {
    title: 'WicClaw — AI mini boxes for local business',
    description: 'AI mini boxes for local business automation.',
    siteName: 'WicClaw',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WicClaw',
    description: 'AI mini boxes for local business automation.',
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
