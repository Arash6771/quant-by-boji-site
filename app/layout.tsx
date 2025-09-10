import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Quant by Boji',
  description: 'Quantitative tools by Boji',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
