import { connectToDatabase } from "@/lib/mongodb";
import Blog from "@/models/Blog";

export async function POST(req, context) {
    try {
        await connectToDatabase();
        const { title } = context.params;
        const decodedTitle = decodeURIComponent(title);
        const { user, content, parentCommentId } = await req.json();

        const blog = await Blog.findOne({ title: decodedTitle });

        if (!blog) return new Response("Blog not found", { status: 404 });

        if (parentCommentId) {
            const comment = blog.comments.id(parentCommentId);
            if (!comment) return new Response("Comment not found!", { status: 404 });
            comment.replies.push({ user, content });
        } else {
            blog.comments.push({ user, content, replies: [] });
        }

        await blog.save();
        return Response.json(blog.comments);
    } catch (error) {
        return new Response("Internal Server Error", { status: 500 });
        
    }
}