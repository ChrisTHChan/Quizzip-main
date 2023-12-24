import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'QuizzipIO',
  description: 'An online tool to help you create quizzes, tests, assignments, and more! Get hours of your day back.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-900 text-neutral-300`}>
        <header className="flex justify-center items-center border-b mb-16">
          <div className="container py-6 mx-4 flex flex-col sm:flex-row justify-between">
            <Header/>
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}
