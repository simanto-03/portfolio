import AdminHeader from "@/components/AdminHeader";
import Editor from "@/components/Editor";
import React from "react"; 

export default function CreateBlogs() {

  const LOCAL_STORAGE_KEY = "unsaved_creating_project_data";
  const address = "/api/projects"

  return (
    <section className="h-full">
      <AdminHeader />
      <div className="container mx-auto h-full py-4">
        <div className="flex justify-center items-center">
          <h1 className="text-3xl font-bold uppercase">Create Project</h1>
        </div>
        <div className="my-12 flex flex-col w-full justify-center items-center">
          <Editor address={address} method={"POST"} LOCAL_STORAGE_KEY={LOCAL_STORAGE_KEY} />
        </div>
      </div>
    </section>
  );
}
