"use client";

import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';


export default function page() {

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const router =useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await signIn("credentials", {
                username: formData.username,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Login successful!");
            }

            router.replace("/admin/dashboard");
        } catch (error) {
            toast.error("Something went wrong!");
        }
    }

    return (
        <div className="w-full flex flex-col items-center justify-center">
            <div className=' w-full bg-blue-500 flex flex-col items-center justify-between'>
                <div className=' text-white text-3xl font-extrabold py-8'>Admin Panel</div>
            </div>
            <div className="w-full max-w-md p-6 rounded-lg shadow-md my-8">
                <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="text" 
                        name="username"
                        placeholder="Username" 
                        value={formData.username} 
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required 
                    />
                    <input 
                        type="password" 
                        name="password"
                        placeholder="Password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required 
                    />
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-700 transition text-xl font-medium">
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}
