'use client';
import { useEffect, useState, useRef } from "react";

export default function PublicationForm({ onSubmit, initialData = {} }) {
    const [form, setForm] = useState({
        title: "",
        doi: "",
        url: "",
    });

    const hasInitialized = useRef(false); // 🛡️ Prevents repeated initialization

    // Load saved form from localStorage once
    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        const saved = localStorage.getItem("publication-form");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setForm({
                    title: parsed.title || "",
                    doi: parsed.doi || "",
                    url: parsed.url || "",
                });
            } catch (err) {
                console.error("Failed to parse localStorage value:", err);
            }
        } else {
            setForm({
                title: initialData.title || "",
                doi: initialData.doi || "",
                url: initialData.url || "",
            });
        }
    }, []);

    // Save form to localStorage on every change
    useEffect(() => {
        localStorage.setItem("publication-form", JSON.stringify(form));
    }, [form]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-[700px] text-xl text-black flex flex-col justify-center items-center">
            <textarea
                id="title"
                name="title"
                className="w-full h-32 border-2 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Your Full paper title with details..."
                value={form.title}
                onChange={handleChange}
                required
            />
            <input name="doi" value={form.doi} onChange={handleChange} placeholder="DOI" className="w-full p-2 border" />
            <input name="url" value={form.url} onChange={handleChange} placeholder="URL" className="w-full p-2 border" />
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
        </form>
    );
}
