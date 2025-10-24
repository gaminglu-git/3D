import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '3D Building Viewer',
  description: 'Professional 3D building planning and visualization tool',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
