import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'BLDRKit — The #1 Platform for Roofing Contractors',
  description: 'CRM, job management, estimates, invoices, AI website builder, and booking system — all in one platform built for roofers. Set up in 30 minutes. Free plan available.',
  keywords: ['roofing software', 'roofing CRM', 'roofing contractor software', 'roofing business management', 'roofing estimates', 'roofing invoices', 'roofing website builder'],
  openGraph: {
    title: 'BLDRKit — The #1 Platform for Roofing Contractors',
    description: 'Stop losing jobs to contractors with better websites. CRM, estimates, invoices, AI website builder, and booking system — set up in 30 minutes.',
    url: 'https://bldrkit.com',
    siteName: 'BLDRKit',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BLDRKit — The #1 Platform for Roofing Contractors',
    description: 'Stop losing jobs to contractors with better websites. Set up in 30 minutes. Free plan available.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
