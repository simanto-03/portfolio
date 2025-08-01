"use client";
import { useSession } from "next-auth/react";

import AdminHeader from '@/components/AdminHeader'
import React, { useEffect, useState } from 'react'
import Intro from "@/components/EditProfile/Intro";
import AboutEdit from "@/components/EditProfile/AboutEdit";

export default function page() {

    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch('/api/getInfo');
                if (!response.ok) {
                    throw new Error('Failed to fetch user info');
                }
                const data = await response.json();
                setUserInfo(data);
            } catch (error) {
                console.error('Error fetching user info:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserInfo();
    }, []);
    

    return (
        <div>
            <AdminHeader />
            <div className="flex flex-col items-center justify-center mt-8">
                <h1 className="text-2xl font-bold mb-4">Edit Info</h1>
                
                {isLoading ? (
                    <p className=" text-center text-xl font-semibold">Loading...</p>
                ): userInfo ?
                (
                    <div className="w-full flex flex-col items-center justify-center gap-6">
                        <Intro userInfo={userInfo} />
                        <AboutEdit userInfo={userInfo} />
                    </div>
                )
                : (
                    <p className=" text-center text-xl font-semibold">Failed to load user info</p>
                )}

            </div>
        </div>
    )
}
