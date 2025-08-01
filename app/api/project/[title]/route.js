import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import { generateSlugFromContent } from "@/utils/slugify";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Category from "@/models/Category";

export async function GET(req, context)  {
  const { title } = context.params;
  try {
    const decodedTitle = decodeURIComponent(title);
    await connectToDatabase();

    const project = await Project.findOne({ title: decodedTitle });

    if (!project) {
      return new Response(JSON.stringify({ error: "Project not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(project), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {    
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function PUT(req, context) {
    const { title } = context.params;
    try {
      const session = await getServerSession(authOptions);
      if (!session || !session.user?.admin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }

      const decodedTitle = decodeURIComponent(title);

      await connectToDatabase();
      const body = await req.json();
      const { header, content } = body;
        
      if (!content || content.length === 0) {
        return NextResponse.json({ message: "Content is required." }, { status: 400 });
      }

      const categories = header.categories || [];
      for (const categoryName of categories) {
        const existingCategory = await Category.findOne({ name: categoryName });
        if (!existingCategory) {
          const newCategory = new Category({ name: categoryName });
          await newCategory.save();
        }
      }

      const slug = generateSlugFromContent(header.title, categories, content); 
            
      let preview = "No Preview";
      const firstParagraph = content.find(item => item.type === "Paragraph");
      if (firstParagraph && typeof firstParagraph.content === "string") {
        preview = firstParagraph.content.split(" ").slice(0, 20).join(" ") + "...";
      }

      const uppro = {
        title: header.title,
        slug,
        content,
        categories,
        coverImage: header.coverImage,
        preview
      };

      const updatedProject = await Project.findOneAndUpdate({ title: decodedTitle }, uppro, { new: true });
      return NextResponse.json(updatedProject, { status: 200 });
    } catch (err) {
      return NextResponse.json({ error: "Failed to update project!" }, { status: 500 });
    }
}

export async function DELETE(req, context) {
  const { title } = context.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const decodedTitle = decodeURIComponent(title);
    await connectToDatabase();

    const deletedProject = await Project.findOneAndDelete({ title: decodedTitle });

    if (!deletedProject) {
      return new Response(JSON.stringify({ error: "Project not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "Project deleted successfully" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}