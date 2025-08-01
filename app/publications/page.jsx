'use client';
import { useEffect, useState } from "react";

import Header from '@/components/Header'
import React from 'react'

export default function publications() {

  const [publications, setPublications] = useState([]);

  useEffect(() => {
    async function fetchPublications() {
      const res = await fetch("/api/publications");
      const data = await res.json();
      setPublications(data);
    }
    fetchPublications();
  }, []);

  return (
    <div>
      <Header />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Publications</h1>
        {publications.map((pub) => (
          <div key={pub._id} className="mb-6 p-4 border-2 border-green-500 rounded">
            <h2 className="text-xl font-semibold">{pub.title}</h2>
            {pub.doi && <p className="text-sm text-gray-600 dark:text-gray-400">DOI: {pub.doi}</p>}
            {pub.url && (
              <a
                href={pub.url.startsWith("http") ? pub.url : `https://${pub.url}`}
                className="w-full text-blue-600 underline mt-1 inline-block text-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Paper
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
