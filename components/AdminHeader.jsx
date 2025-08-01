"use client"

import React from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

export default function AdminHeader() {
    return (
        <div className=' w-full bg-blue-500 flex flex-col items-center justify-between'>
            <div className=' text-white text-3xl font-extrabold py-8'>Admin Panel</div>
            <div className=' w-[300px] p-2 flex justify-between text-white font-[20px]
            '>
                <Link href={'/admin/dashboard'}><div>Dashboard</div></Link>
                <Link href={'/'}><div>Home</div></Link>
                <div onClick={() => signOut()} className=' py-1 px-2 bg-red-500 rounded-xl border-2 border-red-500 cursor-pointer transition-all duration-500
                hover:bg-white hover:text-red-500 text-lg font-medium'>
                    Logout
                </div>
            </div>
        </div>
    )
}
