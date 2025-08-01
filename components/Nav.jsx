"use client";

import React from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
    {
        name: "Home",
        path: "/",
    },
    {
        name: "About Me",
        path: "/about",
    },
    {
        name: "Projects",
        path: "/projects",
    },
    {
        name: "Publications",
        path: "/publications",
    },
    {
        name: "Blogs",
        path: "/blogs",
    },
    {
        name: "Contact Me",
        path: "/contact",
    },
]

export default function Nav() {

    const pathname = usePathname();

  return (
    <nav className=' flex gap-8'>
        {links.map((link, index) => {
            return (
                <Link href={link.path} key={index} 
                    className={`${link.path === pathname && " text-fGreen border-b-2 border-fGreen"}
                     capitalize font-medium hover:text-cBlue transition-all`}
                >
                    {link.name}
                </Link>
            );
        })}
    </nav>
  )
}
