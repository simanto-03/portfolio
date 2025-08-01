'use client'

import React, { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Link from 'next/link'
import { toast } from 'react-toastify';


export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);  

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/projects?page=${page}`);
      const data = await res.json();
      setProjects(data.projects);
      setTotalPages(data.totalPages);
      setLoading(false);
      if (!res.ok) {
        toast.error('Failed to fetch Projects');
      }
    } catch (error) {
      toast.error('Failed to fetch Projects');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [page]);

  if (loading) {
    return (
      <div className='w-full'>
        <Header />
        <p className='text-xl font-semibold mt-4'>Loading...</p>
      </div>
    );
  }

  return (
    <div className='w-full'>
      <Header />
      <h1 className='text-2xl font-bold text-center my-4'>Projects</h1>
      <div className=" w-[90%] p-4 mx-auto flex flex-col items-center justify-between">
        {projects.length === 0 ? (
          <p className=' pb-80'>No Porject found!</p>
        ) : (
          <div className=' w-full flex flex-wrap gap-4 justify-center'>
            {projects?.map((project) => (
              <Link key={project._id} href={`/project/${project.title}`}>
                <div className=" w-[300px] h-[480px] mb-6 p-2 border rounded shadow hover:shadow-lg transition-all cursor-pointer duration-300
                flex flex-col items-center hover:scale-105 dark:shadow-gray-500">
                  <img
                    src={project.coverImage ? project.coverImage : "/assets/no_img.jpg"}
                    alt={project.title}
                    className="w-full h-[220px] object-cover mb-2 rounded"
                  />
                  {project.categories && project.categories.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-2">
                      {project.categories.map((category, index) => (
                        <span key={index} className="text-sm bg-green-500 text-white px-2 py-1 rounded-xl">
                          {category}
                        </span>
                      ))}
                    </div>
                  )}
                  <h2 className="text-xl font-bold">{project.title}</h2>
                  <p className="">{project.preview ? project.preview : "No Preview..."}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        <div className="mx-auto w-full max-w-[700px] flex justify-between items-center mt-6">
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
