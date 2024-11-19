// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PalantirEstimationCost',
  description: 'Software Development Cost Estimation Tool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
  <meta charSet="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="icon" type="image/svg+xml" href="/images/vision-svgrepo-com.svg?v=1" />
  <link rel="icon" type="image/png" href="/images/vision-svgrepo-com.png" />
  <link rel="icon" type="image/x-icon" href="/images/vision-svgrepo-com.ico" />
</head>

      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}