"use client"
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Education from "@/components/Education";
import Header from "@/components/Header";
import { toast } from "react-toastify";
export default function About() {

  const [type, setType] = useState(1);

  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(true);
  
  const fetchInfo = async () => {
    try {
        setLoading(true);
        const res = await fetch(`/api/getInfo`);
        const data = await res.json();
        setInfo(data);
        if (!res.ok) {
            toast.error('Failed to fetch info.');
        }
    } catch (error) {
        toast.error('Failed to fetch info.');
    }
    setLoading(false);
  };
  
  useEffect(() => {
      fetchInfo();
  }, []);


  return (
    <section className="h-full">
      <Header />
      <div className="container mx-auto h-full py-4">
        {/* header */}
        <div className="flex justify-center items-center">
          <h1 className="text-3xl font-bold uppercase">About me</h1>
        </div>

        {/* nav */}
        <div className="my-12 flex flex-row justify-between w-full">
          <h1
            className={`w-[45%] text-lg md:text-xl xl:text-2xl 
                        transition-all duration-500 cursor-pointer px-4
                        hover:text-cBlue flex justify-center items-center ${
                          type === 1
                            ? "border-b-4 border-fGreen"
                            : "border-b-4 border-transparent"
                        }`}
            onClick={() => setType(1)}
          >
            Introduction
          </h1>
          <h1
            className={`w-[45%] text-lg md:text-xl xl:text-2xl 
                        transition-all duration-500 cursor-pointer px-4
                        hover:text-cBlue flex justify-center items-center ${
                          type === 2
                            ? "border-b-4 border-fGreen"
                            : "border-b-4 border-transparent"
                        }`}
            onClick={() => setType(2)}
          >
            Education
          </h1>
        </div>

        {/* body */}
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-xl font-semibold">Loading...</p>
          </div>
        ) : (
          <div>
              { type === 1 ? (
                <div className=" flex flex-col xl:flex-row items-center justify-between xl:pt-8 xl:pb-24 transition-all duration-500">
                    <div className="w-full xl:w-[70%] text-center xl:text-left text-bgDark dark:text-bgLight order-2 xl:order-none">
                        <p className=" mb-9 text-bgDark/80 dark:text-bgLight/80"> 
                            { info.about }
                        </p>
                    </div>
        
                    <div className=" order-1 xl:order-none mb-8 xl:mb-0">
                        <Image 
                          src={"/assets/photo.png"}
                          quality={100}
                          height={300}
                          width={400}
                          alt=""
                          className=""
                        />
                    </div>
                </div>
              ):(
                <div className=" transition-all duration-500">
                    <Education />
                </div>
              )}
          </div>
        )}
      </div>
    </section>
  );
}
