import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Image from 'next/image';
import logo from '../../public/images/logo.png';
import PrimaryButton from './components/primaryButton';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Quizzip',
  description: 'An online tool to help you create quizzes, tests, assignments, and more! Get hours of your day back.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-900 text-slate-200`}>
        <header className="flex justify-center items-center">
          <div className="container py-6 mx-4 border-b flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-16">
            <Link href="/" className="flex gap-3 items-center mb-4 sm:mb-0">
              <div className="h-12 w-10">
                <Image alt="a test" src={logo} className="object-contain h-full"/>
              </div>
              <h1 className="font-extrabold text-3xl">Quizzip</h1>
            </Link>
            <div>
              <Link className="mr-4 text-sm font-semibold hover:underline underline-offset-8" href="/contact">Contact</Link>
              <Link className="mr-4 text-sm font-semibold hover:underline underline-offset-8" href="/pricing">Pricing</Link>
              <Link href='sign-in'><PrimaryButton extra_classes="px-8">Sign In</PrimaryButton></Link>
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}
