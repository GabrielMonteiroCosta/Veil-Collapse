import type { Metadata } from 'next'
import './globals.css'
import { LanguageProvider } from '@/context/LanguageContext'
import { AuthProvider } from '@/context/AuthContext'
import { ToastProvider } from '@/context/ToastContext'
import ScrollReveal from '@/components/ScrollReveal'

export const metadata: Metadata = {
  title: 'Ecos de um Mundo Quebrado',
  description: 'Um jogo de aventura em pixel art. Quando dois universos se sobrepõem, nenhum mundo permanece intacto.',
  keywords: ['jogo', 'pixel art', 'aventura', 'indie game', 'RPG'],
  icons: {
    icon: '/cities/Favicon.png',
  },
  openGraph: {
    title: 'Ecos de um Mundo Quebrado',
    description: 'Quando dois universos se sobrepõem, nenhum mundo permanece intacto.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Cinzel:wght@400;700&family=Crimson+Text:ital,wght@0,400;1,400&family=Orbitron:wght@400;700;900&family=Oxanium:wght@400;600;700&display=swap"
        />
      </head>
      <body>
        <AuthProvider>
          <LanguageProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </LanguageProvider>
        </AuthProvider>
        <ScrollReveal />
      </body>
    </html>
  )
}
