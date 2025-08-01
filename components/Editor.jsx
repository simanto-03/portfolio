"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
const CreatableSelect = dynamic(() => import("react-select/creatable"), {
  ssr: false,
});
import makeAnimated from "react-select/animated";
import { toast } from "react-toastify";
import { supabase } from "@/lib/supabase";

const types = ["Paragraph", "Image", "Collage", "Code Snippet"];


export default function Editor({ address, method, LOCAL_STORAGE_KEY, editingData = {} }) {    
    const [formData, setFormData] = useState(editingData.formData || []);
    const [currStep, setCurrStep] = useState(editingData.currStep || 0);
    const [type, setType] = useState( editingData.type || "header");
    const [content, setContent] = useState( editingData.content || {
        title: "",
        coverImage: "",
        categories: [],
    });
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [categoryOptions, setCategoryOptions] = useState([]);

    const filePickerRef = useRef();
    const animatedComponents = makeAnimated();

    useEffect(() => {
        async function fetchCategories() {
            const res = await fetch("/api/categories");
            const data = await res.json();
            setCategoryOptions(
                data.map((cat) => ({ value: cat.name, label: cat.name }))
            );
        }
        fetchCategories();

        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setFormData(parsed.formData || []);
                setCurrStep(parsed.currStep || 0);
                setType(parsed.type || "header");
                setContent(parsed.content || {
                    title: "",
                    coverImage: "",
                    categories: [],
                });
            } catch (err) {
                console.error("Error parsing localStorage data:", err);
            }
        }

    }, []);

    useEffect(() => {
        const dataToSave = {
            formData,
            currStep,
            type,
            content,
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
    }, [formData, currStep, type, content]);


    useEffect(() => {
        if (imageFile) {
            uploadImage();
        }
    }, [imageFile]);

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    const handleTypeChange = (e) => {
        setType(e.target.value);
        setContent(e.target.value === "Collage" ? [] : "");
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            e.target.value = "";
        }
        if (type === "Image") {
            setContent("");
        }
    };

    const uploadImage = async () => {
        if (!imageFile) return;

        setImageFileUploading(true);
        setImageFileUploadProgress(0);

        const fileName = `${Date.now()}_${imageFile.name}`;
        const bucket = "images";
        const path = `public/${fileName}`;
        const url = `${supabase.supabaseUrl}/storage/v1/object/${bucket}/${path}`;

        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                const percent = ((e.loaded / e.total) * 100).toFixed(0);
                setImageFileUploadProgress(percent);
            }
        };

        xhr.onload = async () => {
            if (xhr.status === 200 || xhr.status === 204) {
                const { data } = supabase.storage
                    .from(bucket)
                    .getPublicUrl(path);

                const publicUrl = data?.publicUrl;
                if (type === "Image") {
                    setContent(publicUrl);
                } else if (type === "header") {
                    setContent((prevContent) => ({
                    ...prevContent,
                    coverImage: publicUrl,
                    }));
                } else {
                    setContent((prev) => [...prev, publicUrl]);
                }
            }else {
                toast.error(`Upload failed!`);
                console.log("Upload Error: ", xhr.responseText);
            }
            setImageFileUploading(false);
            setImageFile(null);
        }

        xhr.onerror = () => {
            toast.error("Upload error occurred.");
            console.log("Upload Error:", xhr.responseText);
            setImageFileUploading(false);
        };

        xhr.open("POST", url);
        xhr.setRequestHeader("Authorization", `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`);

        xhr.send(imageFile);
    };

    const removeCollageImage = (url) => {
        setContent((prev) => prev.filter((img) => img !== url));
    };

    const handleNext = async () => {
        const newData = [...formData];
        newData[currStep] = { type, content };
        setFormData(newData);
        setContent(formData[currStep + 1]?.content || "");
        setType(formData[currStep + 1]?.type || "Paragraph");
        setCurrStep(currStep + 1);
    };

    const handlePrevious = () => {
        if (currStep > 0) {
            const newData = [...formData];
            newData[currStep] = { type, content };
            setFormData(newData);
            setType(formData[currStep - 1]?.type || "Paragraph");
            setContent(formData[currStep - 1]?.content || "");
            setCurrStep(currStep - 1);
        }
    };

    const handleSubmit = async () => {
        const fullData = [...formData];
        fullData[currStep] = { type, content };

        const headerItem = fullData[0];
        const otherContent = fullData.slice(1);

        const payload = {
            header: headerItem.content,
            content: otherContent,
        };

        if (!payload.header.title.trim()) {
            toast.error("Title is required.");
            return;
        }

        try {

            const res = await fetch(address, {
                method: method || "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                toast.success(`Saved successfully!`);
                localStorage.removeItem(LOCAL_STORAGE_KEY);
                setFormData([]);
                setCurrStep(0);
                setType("header");
                setContent({
                    title: "",
                    coverImage: "",
                    categories: [],
                });
                setImageFile(null);
                setImageFileUploadProgress(null);
                setImageFileUploading(false);
                setCategoryOptions([]);
            } else {
                const err = await res.json();
                toast.error("Error: " + err.error);
            }
        } catch (err) {
            toast.error("Something went wrong.");
        }
    };

  return (
    <div className="w-full flex flex-col items-center justify-center">
        {currStep === 0 ? (
            <div className=" w-full flex flex-col items-center justify-center">
                <h3 className=" text-xl mb-2">Title*</h3>
                <div className="w-full flex flex-col items-center justify-center mb-4">
                    <input
                        id="title"
                        type="text"
                        className="w-[95%] md:w-[80%] lg:w-[70%] xl:w-[60%] h-14 border-2 border-gray-300 rounded-md px-3 py-2 
                            focus:outline-none focus:border-blue-500 text-xl text-black"
                        placeholder="Your Title"
                        value={content.title}
                        onChange={(e) =>
                            setContent((prev) => ({ ...prev, title: e.target.value }))
                        }
                    />

                    <div className="flex flex-col items-center mt-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
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
                            Add a Cover Image
                        </button>

                        {content.coverImage && (
                            <div className="relative w-64 h-64 mt-2">
                                <img
                                    src={content.coverImage}
                                    alt={`Image`}
                                    className="w-full h-full object-cover rounded-xl"
                                />
                                <button
                                    className="absolute top-0 right-0 bg-red-500 text-white p-1 px-2 rounded-full"
                                    onClick={() =>
                                        setContent((prev) => ({ ...prev, coverImage: "" }))
                                    }
                                >
                                    X
                                </button>
                            </div>
                        )}
                        {imageFileUploading && (
                            <div className="h-20 mt-2">
                                Uploading ({imageFileUploadProgress}%)...
                            </div>
                        )}
                    </div>

                    <div className="my-6">
                        <label className="block mb-2 text-center text-xl font-medium">
                            Categories
                        </label>
                        <CreatableSelect
                            isMulti
                            components={animatedComponents}
                            options={categoryOptions}
                            value={content.categories.map((cat) => ({
                                label: cat,
                                value: cat,
                            }))}
                            onChange={(selectedOptions) =>
                                setContent((prev) => ({
                                    ...prev,
                                    categories: selectedOptions.map((opt) => opt.value),
                                }))
                            }
                            placeholder="Select or create categories"
                            className="text-black dark:text-white"
                        />
                    </div>
                </div>
            </div>
        ) : (
            <div className="w-full flex flex-col items-center justify-center mb-4 px-20 transition-all duration-500">
                <div className="w-[90%] md:w-[70%] lg:w-[50%] flex flex-col items-start justify-center mb-4 relative group">
                    <select
                        className="w-full bg-gray-200 border border-gray-400 rounded-lg p-2 outline-none dark:bg-gray-800 dark:text-gray-200"
                        onChange={handleTypeChange} // ✅ Updates type inside description
                        value={type || "Paragraph"} // ✅ Defaults to Paragraph
                    >
                        {types.map((tpe) => (
                            <option key={tpe} value={tpe}>
                                {tpe}
                            </option>
                        ))}
                    </select>
                </div>

                {type === "Paragraph" && (
                    <textarea
                        id="paragraph"
                        className="w-full h-52 border-2 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 text-xl text-black"
                        placeholder="Your Paragraph..."
                        value={content || ""} // ✅ Correct field reference
                        onChange={handleContentChange} // ✅ Updates state in real-time
                    />
                )}
                {type === "Image" && (
                    <div className="flex flex-col items-center mt-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
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
                                }`
                            }
                            disabled={imageFileUploading}
                            title={imageFileUploading ? "Uploading" : ""}
                            onClick={() => filePickerRef.current.click()}
                        >
                            Select Image
                        </button>

                        {content && (
                            <div className="relative w-64 h-64 mt-2">
                                <img
                                    src={content}
                                    alt={`Image`}
                                    className="w-full h-full object-cover rounded-xl"
                                />
                                <button
                                    className="absolute top-0 right-0 bg-red-500 text-white p-1 px-2 rounded-full"
                                    onClick={() => setContent("")}
                                >
                                    X
                                </button>
                            </div>
                        )}

                        {imageFileUploading && (
                            <div className="h-20 mt-2">
                                Uploading ({imageFileUploadProgress}%)...
                            </div>
                        )}
                    </div>
                )}
                {type === "Collage" && (
                    <div className="flex flex-col items-center mt-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
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
                            Add Image
                        </button>

                        <div className=" flex flex-wrap m-4 mx-auto gap-4 ">
                            { content.length>0 && content.map((url, index) => (
                                <div key={index} className="relative w-64 h-64 mt-2">
                                    <img
                                        src={url}
                                        alt={`Collage Image ${index + 1}`}
                                        className="w-full h-full object-cover rounded-xl"
                                    />
                                    <button
                                        className="absolute top-0 right-0 bg-red-500 text-white p-1 px-2 rounded-full"
                                        onClick={() => removeCollageImage(url)}
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>

                        {imageFileUploading && (
                            <div className="h-20 mt-2">
                                Uploading ({imageFileUploadProgress}%)...
                            </div>
                        )}
                    </div>
                )}
                {type === "Code Snippet" && (
                    <textarea
                        className="w-full h-52 border-2 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 text-xl text-black"
                        placeholder="Write your code here..."
                        value={content || ""}
                        onChange={handleContentChange}
                    />
                )}
            </div>
        )}

        <div className="w-full flex items-center justify-between px-20 mt-4">
            <button
                className={`relative mt-4 bg-blue-600 text-white px-4 py-2 text-xl rounded-xl transition-all duration-500
                    hover:bg-transparent hover:text-blue-600 border-2 border-blue-600 hover:font-semibold hover:scale-110 cursor-pointer
                    ${
                        currStep === 0
                        ? "opacity-70 cursor-not-allowed"
                        : "opacity-100"
                    }`
                }
                disabled={currStep === 0}
                onClick={handlePrevious}
            >
                Previous
            </button>

            <button
                className={`relative mt-4 bg-blue-600 text-white px-4 py-2 text-xl rounded-xl transition-all duration-500
                    hover:bg-transparent hover:text-blue-600 border-2 border-blue-600 hover:font-semibold hover:scale-110 cursor-pointer
                    ${
                        type === "Collage"
                        ? content.length > 0
                            ? "opacity-100"
                            : "opacity-70 cursor-not-allowed"
                        : type === "header"
                        ? content.title.trim()
                            ? "opacity-100"
                            : "opacity-70 cursor-not-allowed"
                        : typeof content === "string" && content.trim()
                        ? "opacity-100"
                        : "opacity-70 cursor-not-allowed"
                    }`}
                disabled={
                    type === "Collage"
                        ? content.length === 0
                        : type === "header"
                        ? !content.title.trim()
                        : !(typeof content === "string" && content.trim())
                }
                onClick={handleNext}
            >
                Next
            </button>
        </div>

        <div>
            <button
            onClick={handleSubmit}
            className=" bg-green-600 px-3 py-1 mt-4 text-white text-xl rounded-xl border-[3px] border-green-600 transition-all 
                        duration-300 hover:bg-transparent hover:text-green-600 font-semibold hover:scale-105"
            >
                Save
            </button>
        </div>
    </div>
  );
}
