import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SnapFrame',
  description: 'this is a snapframe',
  icons: {
    icon: [
      {
        url: '/images/favicon.ico',
        sizes: 'any',
      },
      {
        url: '/images/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/images/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
    apple: {
      url: '/images/apple-touch-icon.png',
      sizes: '180x180',
      type: 'image/png',
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
