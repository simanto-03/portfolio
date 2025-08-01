import React from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import Nav from './Nav'
import MobileNav from './MobileNav'
import ThemeToggle from './ThemeToggle'

export default function Header() {
    return (
        <header className='transition-colors-400 py-8 xl:py-12 dark:text-bgLight bg-bgNavLight dark:bg-bgNavDark'>
            <div className="container mx-auto flex justify-between items-center">

                <Link href={'/'}>
                    <h1 className=' text-4xl font-semibold'>
                        S.<span className=' text-cBlue'>Das</span>
                    </h1>
                </Link>

                {/* desktop nav */}
                <div className=' hidden xl:flex items-center gap-8'>
                    <Nav />
                    <ThemeToggle />
                </div>  

                {/* mobile nav */}
                <div className='flex gap-4 xl:hidden'>
                    <ThemeToggle />
                    <MobileNav />
                </div>
                
            </div>
        </header>
    )
}
