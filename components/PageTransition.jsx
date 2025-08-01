"use client";

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation';

export default function PageTransition({ children }) {
    const pathname = usePathname();
    return (
        <AnimatePresence>
            <div key={pathname}>
                <motion.div
                    initial={{opacity: 1}}
                    animate={{
                        opacity: 0,
                        transition:{ delay: 1, duration: .4, ease: "easeOut" },
                    }} 
                    className=' h-screen w-screen fixed bg-bgLight dark:bg-bgDark top-0 pointer-events-none'
                />
                {children}
            </div>
        </AnimatePresence>
    )
}
