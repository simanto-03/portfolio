"use client";

import Header from "@/components/Header";
import Photo from "@/components/Photo";
import Social from "@/components/Social";
import Stats from "@/components/Stats";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { toast } from "react-toastify";

export default function Home() {
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchInfo = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/getInfo`);
      console.log("Response:", res);
      const data = await res.json();
      console.log("Data:", data);
      setInfo(data);
      if (!res.ok) {
        toast.error("Failed to fetch info");
      }
    } catch (error) {
      toast.error("Failed to fetch info.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  console.log("Info:", info);

  return (
    <section className=" h-full">
      <Header />
      {loading ? (
        <div className=" w-full h-full flex items-center justify-center">
          <p className=" text-xl font-semibold">Loading...</p>
        </div>
      ):(
        <div>
        <div className=" container mx-auto h-full">
            <div
              className=" flex flex-col xl:flex-row items-center justify-between
                          xl:pt-8 xl:pb-24"
            >
              <div className=" text-center xl:text-left text-bgDark dark:text-bgLight order-2 xl:order-none">
                <span>Mechanical Engineer</span>
                <h1 className="h1 mb-6">
                  Hello I'm <br />{" "}
                  <span className=" text-fGreen/85">Simanto Das</span>
                </h1>
                <p className=" max-w-[500px] mb-9 text-bgDark/80 dark:text-bgLight/80">
                  {info?.intro ||
                    "I excel at Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
                </p>
                <div className=" flex flex-col xl:flex-row items-center gap-8">
                  <Button
                    variant="outline"
                    size="lg"
                    className=" uppercase flex items-center gap-2 text-fGreen border-fGreen bg-transparent dark:bg-transparent dark:hover:bg-fGreen hover:bg-fGreen rounded-full hover:text-white"
                  >
                    <span>DownLoad CV</span>
                    <FiDownload className=" text-xl" />
                  </Button>
                  <div className=" mb-8 xl:mb-0">
                    <Social
                      containerStyles={"flex gap-6"}
                      iconStyles=" w-9 h-9 border border-fGreen rounded-full flex justify-center items-center 
                                      text-fGreen text-base hover:bg-fGreen hover:text-white hover:transition-all duration-500"
                    />
                  </div>
                </div>
              </div>

              <div className=" order-1 xl:order-none mb-8 xl:mb-0">
                <Photo />
              </div>
            </div>
          
          </div>

          <Stats />
        </div>
      )}
    </section>
  );
}
