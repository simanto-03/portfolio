'use client'

import AdminHeader from '@/components/AdminHeader'
import React from 'react'

import { useSession } from "next-auth/react";
import Link from 'next/link';


export default function page() {

    const { data: session } = useSession();
    
    return (
        <div>
            <AdminHeader />
            <div className=' flex flex-col items-center justify-center mt-20'>
                <div className=' flex flex-wrap gap-8'>
                    <Link href={'/admin/profile'} className='bg-blue-500 text-white px-4 py-2 rounded-xl text-xl font-medium transition-all
                    duration-300 hover:bg-transparent hover:text-blue-500 border-[3px] border-blue-500 hover:scale-105'>
                        Profile
                    </Link>
                    <Link href={'/admin/createBlog'} className='bg-blue-500 text-white px-4 py-2 rounded-xl text-xl font-medium transition-all
                        duration-300 hover:bg-transparent hover:text-blue-500 border-[3px] border-blue-500 hover:scale-105'>
                        Create Blog
                    </Link>
                    <Link href={'/admin/createProject'} className='bg-blue-500 text-white px-4 py-2 rounded-xl text-xl font-medium transition-all
                        duration-300 hover:bg-transparent hover:text-blue-500 border-[3px] border-blue-500 hover:scale-105'>
                        Add Project
                    </Link>
                    <Link href={'/admin/publication/create'} className='bg-blue-500 text-white px-4 py-2 rounded-xl text-xl font-medium transition-all
                        duration-300 hover:bg-transparent hover:text-blue-500 border-[3px] border-blue-500 hover:scale-105'>
                        Add Publication
                    </Link>
                    <Link href={'/admin/contact/update'} className='bg-blue-500 text-white px-4 py-2 rounded-xl text-xl font-medium transition-all
                        duration-300 hover:bg-transparent hover:text-blue-500 border-[3px] border-blue-500 hover:scale-105'>
                        Update Contacts
                    </Link>
                    <Link href={'/admin/list'} className='bg-blue-500 text-white px-4 py-2 rounded-xl text-xl font-medium transition-all
                        duration-300 hover:bg-transparent hover:text-blue-500 border-[3px] border-blue-500 hover:scale-105'>
                        Admin List
                    </Link>
                </div>
            </div>
        </div>
    )
}
