"use client";

import Comments from "@/components/Comment";
import Header from "@/components/Header";
import { useEffect, useState, use } from "react";
import { toast } from "react-toastify";
import Slider from "react-slick";
import { useSession } from "next-auth/react";

export default function BlogPage({ params }) {
    const { title } = use(params);
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    const { data: session } = useSession();
    const user = session?.user;

    useEffect(() => {
        async function fetchBlog() {
        try {
            const res = await fetch(`/api/blog/${encodeURIComponent(title)}`);
            if (!res.ok) toast.error("Blog not found");
            const data = await res.json();
            setBlog(data);
        } catch (err) {
            toast.error("Blog not found");
            setBlog(null);
        } finally {
            setLoading(false);}
        }

        fetchBlog();
    }, [title]);

    if (loading) return <div>Loading...</div>;
    if (!blog) return <div>Blog not found</div>;
    
    return (
        <div>
            <Header />
            {user && user.admin && (
                <div className=" max-w-3xl mx-auto p-6 flex justify-between items-center my-4 ">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-xl text-lg font-medium transition-all duration-300 hover:bg-transparent hover:text-blue-500 border-[3px] border-blue-500 hover:scale-105"
                        onClick={() => window.location.href = `/admin/editBlog/${encodeURIComponent(blog.title)}`}
                    >
                        Edit Blog
                    </button>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded-xl text-lg font-medium transition-all duration-300 hover:bg-transparent hover:text-red-500 border-[3px] border-red-500 hover:scale-105"
                        onClick={async () => {
                            const res = await fetch(`/api/blog/${encodeURIComponent(blog.title)}`, {
                                method: "DELETE",
                            });
                            if (res.ok) {
                                toast.success("Blog deleted successfully!");
                                window.location.href = "/blogs";
                            } else {
                                toast.error("Failed to delete blog.");
                            }
                        }}
                    >
                        Delete Blog
                    </button>
                </div>
            )}
            
            <div className="max-w-3xl mx-auto p-6 flex flex-col gap-8">
                <div className="flex flex-col items-center gap-2 my-8">
                    {blog.coverImage && (
                        <img
                            src={blog?.coverImage}
                            alt="Image"
                            className="w-full h-[350px] rounded-xl border-2 border-green-500"
                        />
                    )}
                    <h1 className="text-3xl font-bold text-center">{blog?.title}</h1>
                    {blog?.categories?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {blog?.categories?.map((category, index) => (
                                <span
                                key={index}
                                className="bg-green-500 text-white px-3 py-1 rounded-2xl text-sm"
                                >
                                    {category}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {blog?.content?.map((block, index) => {
                    switch (block.type) {
                        case "Paragraph":
                            return <p key={index} className="mb-4">{block.content}</p>;
                        case "Image":
                            return <img key={index} src={block.content} alt="" className="mb-4 max-h-350px rounded-xl" />;
                        case "Collage":
                            const settings = {
                                dots: true,
                                infinite: true,
                                speed: 500,
                                slidesToShow: 1,
                                slidesToScroll: 1,
                                arrows: true,
                                autoplay: true,
                                autoplaySpeed: 3000,
                            };
                            return (
                                <div key={index} className="mb-6 w-full">
                                    <Slider {...settings}>
                                        {block.content.map((url, idx) => (
                                        <div key={idx}>
                                            <img
                                                src={url}
                                                alt={`Collage ${idx}`}
                                                className="w-full max-h-[350px] object-cover rounded-xl mx-auto"
                                            />
                                        </div>
                                        ))}
                                    </Slider>
                                </div>
                            );
                        case "Code Snippet":
                            return( 
                                <div key={index}>
                                    <h2 className="text-xl font-semibold mb-2">Code Snippet</h2>
                                    <pre className="bg-gray-700 text-orange-400 p-4 rounded-xl mb-4 overflow-x-auto">
                                        {block.content}
                                    </pre>
                                </div>
                            );
                        default:
                            return null;
                    }
                })}
                <div className="w-full border-t-2 border-green-500 pt-6">
                    <Comments title={title} />
                </div>
            </div>
        </div>
    );
}
