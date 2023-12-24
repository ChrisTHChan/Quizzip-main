'use client'

import Image from 'next/image';
import logo from '../../public/images/logo.png';
import Link from 'next/link';
import HeaderProfile from '@/components/headerProfile';
import {useState} from 'react'
import menu from '../../public/images/menu.svg'

const Header = () => {

    const [menuOpen, setMenuOpen] = useState(false)

    const toggleMenu = () => {
        setMenuOpen(!menuOpen)
    }
    
    return (
        <>
            <div className="w-full flex justify-between items-center">
              <Link href="/" className="flex gap-3 items-center sm:mb-0">
                <div className="h-12 w-10">
                  <Image alt="a test" src={logo} className="object-contain h-full"/>
                </div>
                <h1 className="font-extrabold text-3xl">Quizzip<span className="text-blue-500">IO</span></h1>
              </Link>
              <button onClick={toggleMenu} className="sm:hidden"><Image alt="menu" src={menu} className="object-contain w-[30px]"/></button>
            </div>
            <div className={`${menuOpen ? 'flex' : 'hidden'} sm:flex sm:items-center flex-col-reverse sm:flex-row mt-6 sm:mt-0`}>
              <Link className="mb-2 sm:mb-0 mr-4 sm:text-sm font-semibold hover:underline underline-offset-8" href="/contact">Contact</Link>
              {/* <Link className="mb-2 sm:mb-0 mr-4 sm:text-sm font-semibold hover:underline underline-offset-8" href="/pricing">Pricing</Link> */}
              <HeaderProfile/>
            </div>
        </>
    )
}

export default Header