import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Driver Health Assessment | Kevin Rutherford, FNTP',
  description: 'Comprehensive health evaluation for professional drivers - Functional Medicine approach',
  keywords: 'truck driver health, functional medicine, FNTP, driver wellness',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  )
}