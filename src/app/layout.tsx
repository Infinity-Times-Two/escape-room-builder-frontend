import type { Metadata } from 'next'
import { Work_Sans, Cabin } from 'next/font/google'
import './globals.css'

const workSans = Work_Sans({ subsets: ['latin'], variable: '--font-work-sans' })
const cabin = Cabin({ subsets: ['latin'], variable: '--font-cabin' })

export const metadata: Metadata = {
  title: 'Escape Room Builder',
  description: 'Build and play escape rooms with your friends',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${cabin.variable} ${workSans.variable}`}>{children}</body>
    </html>
  )
}
