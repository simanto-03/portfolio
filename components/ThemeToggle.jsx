"use client";

import React, { useEffect, useState } from 'react'
import {FaMoon, FaSun} from 'react-icons/fa';
import { Button } from './ui/button';


export default function ThemeToggle() {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) {
            setTheme(storedTheme);
            document.documentElement.classList.toggle("dark", storedTheme === "dark");
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
    };

    return (
        <div className=' w-[70px]'>
            <Button onClick={toggleTheme} variant="outline" size="lg" className=" w-full flex justify-between px-2 rounded-full font-bold text-2xl">
                <span
                    className={`transition-opacity duration-500 ease-in-out ${
                        theme === 'light' ? 'opacity-100 ' : 'opacity-50'
                    }`}
                >
                    <FaSun />
                </span>
                <span
                    className={` transition-opacity duration-500 ease-in-out ${
                        theme === 'light' ? 'opacity-50' : 'opacity-100'
                    }`}
                >
                    <FaMoon />
                </span>
            </Button>
        </div>
    );
}
