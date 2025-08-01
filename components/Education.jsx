"use client"

import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

export default function Education() {
    const [educations, setEducations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [educationAdd, setEducationAdd] = useState(false);
    const [showbtn, setShowbtn] = useState(true);

    const { data: session } = useSession();
    const isAdmin = session?.user?.admin || false; 


    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/info/education", {
                    method: "GET",
                    cache: "no-cache",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!res.ok) toast.error("Failed to fetch info");
                const data = await res.json();
                setEducations(data);
            } catch (err) {
                toast.error(err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);
    
    if (loading) {
        return (
            <div className='w-full h-[300px] flex justify-center items-center'>
                <div className='text-2xl font-semibold'>Loading...</div>
            </div>
        );
    }

    if (educations.length === 0) {
        return (
            <div className='w-full flex flex-col justify-center items-center gap-8'>
                <div className='text-2xl font-semibold'>No Education Data Found</div>
                {isAdmin && !educationAdd && (
                    <button
                        className='bg-blue-500 text-white px-4 py-2 rounded-xl text-xl font-medium transition-all duration-300 hover:bg-blue-600'
                        onClick={() => setEducationAdd(true)}
                    >
                        Add Education
                    </button>
                )}
                {educationAdd && (
                    <div className='w-[80%] max-w-3xl py-4 rounded-2xl my-4 flex flex-col items-center justify-center'>
                        <h2 className='text-2xl font-semibold mb-4'>Add Education</h2>
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const newEducation = {
                                    degree: formData.get('degree'),
                                    institute: formData.get('institute'),
                                    result: formData.get('result'),
                                    description: formData.get('description'),
                                };
                                try {
                                    const res = await fetch("/api/info/education", {
                                        method: "POST",
                                        cache: "no-cache",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify(newEducation),
                                    });
                                    if (!res.ok) toast.error("Failed to add education");
                                    const updatedEducations = await res.json();
                                    setEducations(updatedEducations);
                                    setEducationAdd(false);
                                    setShowbtn(true);
                                    toast.success("Education added successfully");
                                } catch (err) {
                                    console.error(err);
                                    toast.error("Failed to add education.");
                                }
                            }}
                            className='w-full flex flex-col gap-4'
                        >
                            <input
                                type='text'
                                name='degree'
                                placeholder='Degree'
                                required
                                className='p-2 rounded-lg border border-gray-300'
                            />
                            <input
                                type='text'
                                name='institute'
                                placeholder='Institution'
                                required
                                className='p-2 rounded-lg border border-gray-300'
                            />
                            <input
                                type='text'
                                name='result'
                                placeholder='Result'
                                required
                                className='p-2 rounded-lg border border-gray-300'
                            />
                            <textarea
                                name='description'
                                placeholder='Description'
                                required
                                className='p-2 rounded-lg border border-gray-300 h-[100px]'
                            ></textarea>
                            <button
                                type='submit'
                                className='bg-green-500 text-white px-4 py-2 rounded-xl text-xl font-medium transition-all duration-300 hover:bg-green-600'
                            >
                                Add
                            </button>
                        </form>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className='w-full flex flex-col gap-4 items-center over'>
            <div className='w-full flex flex-wrap gap-4 justify-center items-center'>
                {educations.map((education, index) => (
                    <div
                        key={index}
                        className='w-[80%] lg:w-[40%] h-[350px] py-4 rounded-2xl bg-bgNavLight dark:bg-bgNavDark shadow-lg my-4 transform 
                        transition-transform duration-1000 hover:scale-105'
                    >
                        <div className='flex justify-center text-xl font-semibold mb-2'>
                            {education.degree}
                        </div>
                        <div
                            className='h-[200px] p-4 flex flex-col'
                        >
                            <p><strong>Institution:</strong> {education.institute}</p>
                            <p><strong>Result:</strong> {education.result}</p>
                            <p><strong>Description:</strong> {education.description}</p>
                        </div>
                        {isAdmin && (
                            <button
                                className='bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                                 hover:bg-red-600 absolute top-4 right-4'
                                onClick={async () => {
                                    try {
                                        const res = await fetch("/api/info/education", {
                                            method: "DELETE",
                                            cache: "no-cache",
                                            headers: {
                                                "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify({ index }),
                                        });
                                        if (!res.ok) throw new Error("Failed to delete education");
                                        const updatedEducations = await res.json();
                                        setEducations(updatedEducations);
                                        toast.success("Education deleted successfully");
                                    } catch (err) {
                                        console.error(err);
                                        toast.error("Failed to delete education.");
                                    }
                                }}
                            >
                                Delete
                            </button>
                        )}
                    </div>
                ))}
            </div>
            {isAdmin && !educationAdd && (
                    <button
                        className='bg-blue-500 text-white px-4 py-2 rounded-xl text-xl font-medium transition-all duration-300 hover:bg-blue-600'
                        onClick={() => setEducationAdd(true)}
                    >
                        Add Education
                    </button>
            )}
            {educationAdd && (
                <div className='w-[80%] max-w-3xl py-4 rounded-2xl my-4 flex flex-col items-center justify-center'>
                    <h2 className='text-2xl font-semibold mb-4'>Add Education</h2>
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const newEducation = {
                                degree: formData.get('degree'),
                                institute: formData.get('institute'),
                                result: formData.get('result'),
                                description: formData.get('description'),
                            };
                            try {
                                const res = await fetch("/api/info/education", {
                                    method: "POST",
                                    cache: "no-cache",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(newEducation),
                                });
                                if (!res.ok) toast.error("Failed to add education");
                                const updatedEducations = await res.json();
                                setEducations(updatedEducations);
                                setEducationAdd(false);
                                setShowbtn(true);
                                toast.success("Education added successfully");
                            } catch (err) {
                                console.error(err);
                                toast.error("Failed to add education.");
                            }
                        }}
                        className='w-full flex flex-col gap-4'
                    >
                        <input
                            type='text'
                            name='degree'
                            placeholder='Degree'
                            required
                            className='p-2 rounded-lg border border-gray-300'
                        />
                        <input
                            type='text'
                            name='institute'
                            placeholder='Institution'
                            required
                            className='p-2 rounded-lg border border-gray-300'
                        />
                        <input
                            type='text'
                            name='result'
                            placeholder='Result'
                            required
                            className='p-2 rounded-lg border border-gray-300'
                        />
                        <textarea
                            name='description'
                            placeholder='Description'
                            required
                            className='p-2 rounded-lg border border-gray-300 h-[100px]'
                        ></textarea>
                        <button
                            type='submit'
                            className='bg-green-500 text-white px-4 py-2 rounded-xl text-xl font-medium transition-all duration-300 hover:bg-green-600'
                        >
                            Add
                        </button>
                    </form>
                </div>
            )}
        </div>
    )
}
