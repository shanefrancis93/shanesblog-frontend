import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  fallback: ['system-ui', 'arial']
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  fallback: ['Georgia', 'serif']
})

export const metadata: Metadata = {
  title: "Simulacra",
  description: 'AI Development, Systems Design, and Technical Writing',
  icons: {
    icon: './icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-body`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 