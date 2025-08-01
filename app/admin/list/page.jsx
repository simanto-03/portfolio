"use client";

import AdminHeader from "@/components/AdminHeader";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react"; // ✅ import useSession
import "react-toastify/dist/ReactToastify.css";

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const response = await fetch("/api/admins");
                const data = await response.json();
                if (response.ok) {
                    setAdmins(data);
                } else {
                    toast.error(data.error);
                }
            } catch {
                toast.error("Failed to fetch admins");
            }
            setLoading(false);
        };

        fetchAdmins();
    }, []);

    const handleDelete = async (id) => {
        try {
            const response = await fetch("/api/admins/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("Admin deleted successfully!");
                setAdmins(admins.filter(admin => admin._id !== id));
            } else {
                toast.error(data.error);
            }
        } catch {
            toast.error("Failed to delete admin");
        }
    };

    const handlePromote = async (id) => {
        try {
            const response = await fetch("/api/admins/promote", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("User promoted to admin!");
                setAdmins(admins.map(admin => admin._id === id ? { ...admin, admin: true } : admin));
            } else {
                toast.error(data.error);
            }
        } catch {
            toast.error("Failed to promote user");
        }
    };

    return (
        <div className="w-full">
            <AdminHeader />
            <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl my-8">
                <h2 className="text-2xl font-semibold text-center mb-4">Admin List</h2>
                
                {loading || status === "loading" ? (
                    <p>Loading...</p>
                ) : (
                    <ul className="space-y-4">
                        {admins.map((admin) => {
                            const isCurrentUser = session?.user?.id === admin._id;
                            return (
                                <li key={admin._id} className="flex justify-between items-center border p-4 rounded-md">
                                    <span className="text-lg">
                                        {admin.username} {admin.admin ? "(Admin)" : ""}
                                    </span>
                                    <div className="space-x-2">
                                        <button
                                            onClick={() => handlePromote(admin._id)}
                                            className="bg-blue-500 text-white py-1 px-3 rounded-xl hover:bg-blue-700 disabled:opacity-50"
                                            disabled={admin.admin}
                                        >
                                            Promote to Admin
                                        </button>
                                        <button
                                            onClick={() => handleDelete(admin._id)}
                                            className="bg-red-500 text-white py-1 px-3 rounded-xl hover:bg-red-700 disabled:opacity-50"
                                            disabled={isCurrentUser}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}
