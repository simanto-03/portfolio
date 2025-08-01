"use client";

import AdminHeader from '@/components/AdminHeader'
import React, { useState } from 'react'
import { toast } from 'react-toastify';

export default function page() {

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            
            if (response.ok) {
                toast.success("Registration successful!");
            } else {
                toast.error(data.error || "Registration failed!");
            }
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
                <h2 className="text-2xl font-semibold text-center mb-4">Register</h2>
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
                    <input 
                        type="password" 
                        name="confirmPassword"
                        placeholder="Confirm Password" 
                        value={formData.confirmPassword} 
                        onChange={handleChange} 
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required 
                    />
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-700 transition text-xl font-medium">
                        Register
                    </button>
                </form>
            </div>
        </div>
    )
}
