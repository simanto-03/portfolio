import Blog from "@/models/Blog";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { generateSlugFromContent } from "@/utils/slugify";
import { connectToDatabase } from "@/lib/mongodb";
import Category from "@/models/Category";

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

    const slug = generateSlugFromContent(header.title, categories, content); 
    
    let preview = "No Preview";
    const firstParagraph = content.find(item => item.type === "Paragraph");
    if (firstParagraph && typeof firstParagraph.content === "string") {
      preview = firstParagraph.content.split(" ").slice(0, 20).join(" ") + "...";
    }
    

    const newBlog = new Blog({ title:header.title, slug, content, categories, coverImage: header.coverImage, preview });
    await newBlog.save();

    return NextResponse.json({ message: "Blog saved", blog: newBlog }, { status: 201 });
  } catch (err) {    
    return Response.json({ error: "Failed to create blog." }, { status: 500 });
  }
}


export async function GET(req) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = 8;
    const query = search
      ? { slug: { $regex: search, $options: 'i' } }
      : {};

    const totalBlogs = await Blog.countDocuments(query);
    const totalPages = Math.ceil(totalBlogs / limit);

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return Response.json({ blogs, totalPages });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}