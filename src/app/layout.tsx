import type { Metadata } from 'next'
import { Geist_Mono } from 'next/font/google'
import './globals.css'

const mono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PREDICTOR | FIFA World Cup 2026',
  description: 'Proyecciones estadísticas de todos los partidos del Mundial 2026. Modelo de IA con distribución de Poisson y ELO.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${mono.variable} h-full`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
