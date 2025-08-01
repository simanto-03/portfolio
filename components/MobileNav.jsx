"use client";

import React from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetDescription, SheetTitle } from './ui/sheet';
import { usePathname } from 'next/navigation';
import { CiMenuFries } from "react-icons/ci";
import Link from 'next/link';

const links = [
    { name: "Home", path: "/" },
    { name: "About Me", path: "/about" },
    { name: "Projects", path: "/projects" },
    { name: "Publications", path: "/publications" },
    { name: "Blogs", path: "/blogs" },
    { name: "Contact Me", path: "/contact" },
];

export default function MobileNav() {
    const pathname = usePathname();

    // useEffect(() => {
    //     // Close the sheet when the pathname changes
    //     document.querySelector(".sheet-close-btn")?.click();
    // }, [pathname]);

    return (
        <Sheet>
            <SheetTrigger className='flex justify-center items-center'>
                <CiMenuFries className='text-[32px] text-bgDark dark:text-bgLight' />
            </SheetTrigger>
            <SheetContent className="flex flex-col">
                <SheetTitle></SheetTitle>
                
                <div>
                    <h1 className='font-semibold'>
                        S.<span className='text-cBlue'>Das</span>
                    </h1>
                </div>
                
                <SheetDescription>
                </SheetDescription>

                <nav className='flex flex-col justify-center items-center gap-8'>
                    {links.map((link, index) => {
                        return (
                            <Link href={link.path} key={index}
                                className={`${link.path === pathname && "text-fGreen border-b-2 border-fGreen"}
                                capitalize text-xl font-medium hover:text-cBlue transition-all`}
                            >
                                <SheetClose asChild>
                                    <span>{link.name}</span>
                                </SheetClose>
                            </Link>
                        );
                    })}
                </nav>
            </SheetContent>
        </Sheet>
    );
}
