import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Image from 'next/image';
import logo from '../../public/images/logo.png';
import Link from 'next/link';
import HeaderProfile from '@/components/headerProfile';

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
        <header className="flex justify-center items-center border-b sm:mb-16">
          <div className="container py-6 mx-4 flex flex-col sm:flex-row justify-between items-center">
            <Link href="/" className="flex gap-3 items-center mb-4 sm:mb-0">
              <div className="h-12 w-10">
                <Image alt="a test" src={logo} className="object-contain h-full"/>
              </div>
              <h1 className="font-extrabold text-3xl">Quizzip<span className="text-blue-500">IO</span></h1>
            </Link>
            <div className="flex items-center">
              <Link className="mr-4 text-sm font-semibold hover:underline underline-offset-8" href="/contact">Contact</Link>
              <Link className="mr-4 text-sm font-semibold hover:underline underline-offset-8" href="/pricing">Pricing</Link>
              <HeaderProfile/>
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}
