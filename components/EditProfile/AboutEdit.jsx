'use client'

import React, { useState } from 'react'
import { toast } from 'react-toastify';

export default function Intro({userInfo}) {

    const [about, setAbout] = useState(userInfo?.about);
    const [isEditing, setIsEditing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/updateInfo/updateAbout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ about }),
            });

            if (!response.ok) {
                toast.error('Failed to update intro');
            }
            const data = await response.json();
            setAbout(data.about);
            setIsEditing(false);
        } catch (error) {
            toast.error('Error updating intro:', error);
        }
    }

    return (
        <div className='w-[90%] max-w-[700px] flex flex-col items-center justify-center'>
            <h1 className='text-2xl font-bold mb-4'>About</h1>
            {about}
            {!isEditing && (
                <button className=' px-2 py-1 my-2 bg-blue-500 text-lg font-medium border-2 border-blue-500 rounded transition-all duration-300
                    hover:bg-transparent text-white hover:text-blue-500 hover:scale-105'
                    onClick={() => setIsEditing(true)}
                >
                    Edit
                </button>
            )}{ isEditing && (
                <form onSubmit={handleSubmit} className=' w-full mt-4'  >
                    <textarea
                        className='w-[90%] h-32 p-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500'
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                    />
                    <div className='flex justify-between mt-2'>
                        <button
                            type='submit'
                            className='px-4 py-2 bg-blue-500 text-white rounded mr-2 hover:bg-blue-600 transition-all duration-300'
                        >
                            Save
                        </button>
                        <button
                            type='button'
                            className='px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-all duration-300'
                            onClick={() => {
                                setIsEditing(false);
                                setAbout(userInfo?.about || "");
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    )
}
