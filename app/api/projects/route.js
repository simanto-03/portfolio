import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Category from "@/models/Category";
import Project from "@/models/Project";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.admin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

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
    
    let preview = "No Preview";
    const firstParagraph = content.find(item => item.type === "Paragraph");
    if (firstParagraph && typeof firstParagraph.content === "string") {
      preview = firstParagraph.content.split(" ").slice(0, 20).join(" ") + "...";
    }

    const newProject = new Project({ title:header.title, content, categories, coverImage: header.coverImage, preview });
    await newProject.save();
    return NextResponse.json({ message: "Project saved"}, { status: 201 });
  } catch (err) {
    return Response.json({ error: "Failed to create Project." }, { status: 500 });
  }
}


export async function GET(req) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = 8;

        const totalProjects = await Project.countDocuments({});
        const totalPages = Math.ceil(totalProjects / limit);

        const projects = await Project.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

        return Response.json({ projects, totalPages });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}