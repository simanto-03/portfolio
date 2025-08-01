"use client";

import Header from '@/components/Header'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

export default function contact() {

  const [phones, setPhones] = useState(['']);
  const [emails, setEmails] = useState(['']);
  const [links, setLinks] = useState([{ name: '', url: '', logo: '' }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchContact() {
      try {
        setLoading(true);
        const res = await fetch(`/api/contacts`);
        const data = await res.json();
        setPhones(data.phones || ['']);
        setEmails(data.emails || ['']);
        setLinks(data.links || [{ name: '', url: '', logo: '' }]);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Failed to fetch contact data");
      }
    }
    fetchContact();
  }, []);

  if (loading) {
    return (
      <section className="h-full flex items-center justify-center">
        <div className="text-2xl font-bold">Loading...</div>
      </section>
    );
  }

  return (
    <section className="h-full">
      <Header />
      <h1 className="text-3xl font-bold uppercase text-center my-4">Contact ME</h1>
      <div className="container mx-auto h-full py-4">
        {phones.length > 0 && (
          <div className="mb-4 flex gap-4 bg-gray-100 dark:bg-gray-800 p-4 rounded">
            <h2 className="text-xl font-semibold">Phones: </h2>
            <div className="flex flex-wrap gap-2 px-2 bg-white dark:bg-black rounded">
              {phones.map((phone, index) => (
                <div key={index} className="text-lg">{phone}</div>
              ))}
            </div>
          </div>
        )}
        {emails.length > 0 && (
          <div className="mb-4 flex gap-4 bg-gray-100 dark:bg-gray-800 p-4 rounded">
            <h2 className="text-xl font-semibold">Emails: </h2>
            <div className="flex flex-wrap gap-2 px-2 bg-white dark:bg-black rounded">
              {emails.map((email, index) => (
                <div key={index} className="text-lg">{email}</div>
              ))}
            </div>
          </div>
        )}
        {links.length > 0 && (
          <div className="mb-4 flex flex-col gap-4 bg-gray-100 dark:bg-gray-800 p-4 rounded">
            <h2 className="text-xl font-semibold">Find me in: </h2>
            <div className="flex flex-wrap gap-2 px-2 bg-white dark:bg-black rounded">
              {links.map((link, index) => (
                <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className=" p-2 text-lg flex flex-col items-center gap-1">
                  {link.logo && <img src={link.logo} alt={link.name} className="w-20 h-20 rounded p-[2px] border-[2px] border-green-500" />}
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
