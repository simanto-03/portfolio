'use client';

import AdminHeader from '@/components/AdminHeader';
import { useState, useEffect, useRef } from 'react';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "@/lib/firebase";
import { toast } from 'react-toastify';

export default function ContactForm() {
    const [phones, setPhones] = useState(['']);
    const [emails, setEmails] = useState(['']);
    const [links, setLinks] = useState([{ name: '', url: '', logo: '' }]);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState(null);    

    const filePickerRef = useRef();

    useEffect(() => {
        if (imageFile) {
            uploadImage();
        }
    }, [imageFile]);

    useEffect(() => {
        async function fetchContact() {
            try {
                setLoading(true);
                const res = await fetch(`/api/contacts`);
                const data = await res.json();
                if (!data || !data._id) {
                    toast.error("No contact data found");
                    setLoading(false);
                    return;
                }
                setId(data._id);
                setPhones(data.phones || ['']);
                setEmails(data.emails || ['']);
                setLinks(data.links || [{ name: '', url: '', logo: '' }]);
                setLoading(false);
            } catch (error) {
                toast.error("Failed to fetch contact data");
            }
        }
        fetchContact();
    }, []);


    const handlePhoneChange = (index, value) => {
        const newPhones = [...phones];
        newPhones[index] = value;
        setPhones(newPhones);
    };

    const handleEmailChange = (index, value) => {
        const newEmails = [...emails];
        newEmails[index] = value;
        setEmails(newEmails);
    };

    const handleLinkChange = (index, field, value) => {
        const newLinks = [...links];
        newLinks[index][field] = value;
        setLinks(newLinks);
    };

    const handleImageChange = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile({ file, index });
            e.target.value = "";
        }
    };


    const uploadImage = async () => {
        if (!imageFile?.file) return;

        setImageFileUploading(true);
        const fileName = new Date().getTime() + imageFile.file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile.file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageFileUploadProgress(progress.toFixed(0));
            },
            (error) => {
                console.error("Upload Error:", error);
                setImageFileUploading(false);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                handleLinkChange(imageFile.index, 'logo', downloadURL);
                setImageFileUploading(false);
                setImageFile(null);
                setImageFileUploadProgress(null);
            }
        );
    };


    const addPhone = () => setPhones([...phones, '']);
    const addEmail = () => setEmails([...emails, '']);
    const addLink = () => setLinks([...links, { name: '', url: '', logo: '' }]);

    const removePhone = (index) => setPhones(phones.filter((_, i) => i !== index));
    const removeEmail = (index) => setEmails(emails.filter((_, i) => i !== index));
    const removeLink = (index) => setLinks(links.filter((_, i) => i !== index));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch(`/api/contacts/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phones, emails, links }),
        });

        if (res.ok) {
            toast.success("Contact updated");
            const updatedContact = await res.json();
            setPhones(updatedContact.phones || ['']);
            setEmails(updatedContact.emails || ['']);
            setLinks(updatedContact.links || [{ name: '', url: '', logo: '' }]);
            setId(updatedContact._id);
        } else {
            toast.error("Failed to update contact");
        }
    };

  if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Loading...</h1>
                    <p>Please wait while we fetch the contact data.</p>
                </div>
            </div>
        );
  }

    return (
        <div className="">
            <AdminHeader />
            <h1 className="text-2xl font-bold my-4 text-center">Contact Editor</h1>
            <form onSubmit={handleSubmit} className="space-y-4 flex flex-col p-4 items-center justify-center gap-4">
                <div className=' w-full max-w-2xl space-y-4'>
                    <h2 className="text-xl font-bold">Phone Numbers</h2>
                    {phones.map((phone, index) => (
                        <div key={index} className="w-full flex items-center space-x-2">
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => handlePhoneChange(index, e.target.value)}
                                className=" border p-2"
                                placeholder="Phone number"
                                required
                            />
                            <button type="button" onClick={() => removePhone(index)} className="text-red-500">
                                Remove
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addPhone} className="mt-2 text-blue-500">
                        Add Phone
                    </button>
                </div>

                <div className=' w-full max-w-2xl space-y-4'>
                    <h2 className="text-xl font-bold">Emails</h2>
                    {emails.map((email, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => handleEmailChange(index, e.target.value)}
                                className="border p-2"
                                placeholder="Email address"
                                required
                            />
                            <button type="button" onClick={() => removeEmail(index)} className="text-red-500">
                                Remove
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addEmail} className="mt-2 text-blue-500">
                        Add Email
                    </button>
                </div>

                <div className=' w-full max-w-2xl space-y-4'>
                    <h2 className="text-xl font-bold">Social Links</h2>
                    {links.map((link, index) => (
                        <div key={index} className="space-y-2 border p-2 mb-2">
                            <input
                                type="text"
                                value={link.name}
                                onChange={(e) => handleLinkChange(index, 'name', e.target.value)}
                                className="border p-2 w-full"
                                placeholder="Social Media Name"
                            />
                            <input
                                type="url"
                                value={link.url}
                                onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                                className="border p-2 w-full"
                                placeholder="Profile URL"
                                required
                            />
                            <div className="flex flex-col items-center mt-4">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e, index)}
                                    ref={filePickerRef}
                                    hidden
                                />

                                <button
                                    className={`relative mt-4 bg-blue-600 text-white px-4 py-2 text-xl rounded-xl transition-all duration-500
                                        hover:bg-transparent hover:text-blue-600 border-2 border-blue-600 hover:font-semibold hover:scale-110 cursor-pointer
                                        ${
                                        !imageFileUploading
                                            ? "opacity-100"
                                            : "opacity-70 cursor-not-allowed"
                                        }
                                    `}
                                    disabled={imageFileUploading}
                                    title={imageFileUploading ? "Uploading" : ""}
                                    onClick={() => filePickerRef.current.click()}
                                >
                                    Upload Logo
                                </button>

                                <div className="relative w-64 h-64 mt-2">
                                    <img
                                        src={link.logo ? link.logo : "/assets/no_img.jpg"}
                                        alt={`Logo`}
                                        className="w-full h-full object-cover rounded-xl"
                                    />
                                    <button
                                        className="absolute top-0 right-0 bg-red-500 text-white p-1 px-2 rounded-full"
                                        onClick={() => handleLinkChange(index, 'logo', "")}
                                    >
                                        X
                                    </button>
                                </div>
                                {imageFileUploading && (
                                    <div className="h-20 mt-2">
                                        Uploading ({imageFileUploadProgress}%)...
                                    </div>
                                )}
                            </div>
                            <button type="button" onClick={() => removeLink(index)} className="text-red-500">
                                Remove Link
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addLink} className="mt-2 text-blue-500">
                        Add Link
                    </button>
                </div>

                <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                    Save Contact
                </button>
            </form>
        </div>
    );
}
