'use client'

import React, { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Link from 'next/link'
import { toast } from 'react-toastify';


export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true); 

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/blogs?page=${page}&search=${search}`);
      const data = await res.json();
      setBlogs(data.blogs);
      setTotalPages(data.totalPages);
      setLoading(false);
      if (!res.ok) {
        toast.error('Failed to fetch blogs');
      }
    } catch (error) {
      toast.error('Failed to fetch blogs');
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page, search]);

  if (loading) {
    return (
      <div className='w-full'>
        <Header />
        <div className=" w-[90%] p-4 mx-auto flex flex-col items-center justify-center gap-[10px]">
            <input
              type="text"
              placeholder="Search blogs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-[500px] px-4 py-2 border rounded mb-4"
            />
            <p className='text-xl font-semibold'>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full'>
      <Header />
      <div className=" w-[90%] p-4 mx-auto flex flex-col items-center justify-center gap-4">
        <input
          type="text"
          placeholder="Search blogs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-[500px] px-4 py-2 border rounded mb-4"
        />

        {blogs.length === 0 ? (
          <p className=' pb-80'>No blogs found.</p>
        ) : (
          <div className=' w-full flex flex-wrap gap-4 justify-center'>
            {blogs?.map((blog) => (
              <Link key={blog._id} href={`/blog/${blog.title}`}>
                <div className=" w-[300px] h-[400px] mb-6 p-2 border rounded shadow hover:shadow-lg transition-all cursor-pointer duration-300
                flex flex-col items-center hover:scale-105 dark:shadow-gray-500">
                  <img
                    src={blog.coverImage ? blog.coverImage : "/assets/no_img.jpg"}
                    alt={blog.title}
                    className="w-full h-[180px] object-cover mb-2 rounded"
                  />
                  {blog.categories && blog.categories.length > 0 && (
                    <div className="mb-1 flex flex-wrap gap-2">
                      {blog.categories.map((category, index) => (
                        <span key={index} className="text-sm bg-green-500 text-white px-[2px] py-[1px] rounded-md">
                          {category}
                        </span>
                      ))}
                    </div>
                  )}
                  <h2 className="text-lg font-semibold">{blog.title}</h2>
                  <p className=" text-base">{blog.preview ? blog.preview : "No Preview..."}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className=" w-full max-w-[700px] flex justify-between items-center">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300 disabled:cursor-not-allowed"
          > 
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
