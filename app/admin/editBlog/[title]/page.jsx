"use client";

import AdminHeader from "@/components/AdminHeader";
import Editor from "@/components/Editor";
import React, { useEffect, useState } from "react"; 
import { toast } from "react-toastify";

const LOCAL_STORAGE_KEY = "unsaved_editing_blog_data";

export default function EditBlogs({ params }) {
    const {title} = React.use(params);

    const [blogData, setBlogData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editingData, setEditingData] = useState({
        formData: [],
        type: "",
        content: {
            title: "",
            coverImage: "",
            categories: [],
        },
        currStep: 0,
    });

    const address = `/api/blog/${encodeURIComponent(title)}`;
    
    useEffect(() => {
        async function fetchBlogData() {
            setLoading(true);
            const res = await fetch(`/api/blog/${encodeURIComponent(title)}`);
            if (res.ok) {
                const data = await res.json();
                setBlogData(data);
                const header = {
                    title: data.title,
                    coverImage: data.coverImage || "",
                    categories: data.categories || [],
                };
                const formDataWithHeader = [{type: "header", content: header }, ...(data.content || [])];
                setEditingData({
                    formData: formDataWithHeader,
                    type: "header",
                    content: header,
                    currStep: 0,
                });
            } else {
                toast.error("Failed to fetch blog data");
            }
            setLoading(false);
        }
        fetchBlogData();
    }, [title]);    

    if (loading) {
        return <div className="flex justify-center items-center h-full">Loading...</div>;
    }
    
    return (
        <section className="h-full">
        <AdminHeader />
        <div className="container mx-auto h-full py-4">
            <div className="flex justify-center items-center">
                <h1 className="text-3xl font-bold uppercase">Edit Blog</h1>
            </div>
            <div className="my-12 flex flex-col w-full justify-center items-center">
                <Editor address={address} method={"PUT"} LOCAL_STORAGE_KEY={LOCAL_STORAGE_KEY} editingData={editingData} />
            </div>
        </div>
        </section>
    );
}
