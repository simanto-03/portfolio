'use client';

import AdminHeader from "@/components/AdminHeader";
import PublicationForm from "@/components/PublicationForm";
import { toast } from "react-toastify";

export default function CreatePublicationPage() {

    const handleSubmit = async (formData) => {
        try {
            const res = await fetch("/api/publications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                toast.error("An error occurred! Please try again");
                return;
            }

            toast.success("Saved Successfully!");
            localStorage.removeItem("publication-form");
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } catch (error) {
            toast.error("Failed to submit publication");
        }
    };


    return (
        <div className="w-full flex flex-col justify-center items-center">
            <AdminHeader />
            <div className="container mx-auto h-full py-4">
                <div className="flex justify-center items-center">
                    <h1 className="text-3xl font-bold uppercase">Create Blog</h1>
                </div>
                <div className="my-12 flex flex-col w-full justify-center items-center">
                    <PublicationForm onSubmit={handleSubmit} /> 
                </div>
            </div>
        </div>
    );
}
