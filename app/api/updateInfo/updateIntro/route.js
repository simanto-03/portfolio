import { connectToDatabase } from "@/lib/mongodb";
import Info from "@/models/Info";

export async function POST(req)  {
  try {
    await connectToDatabase();

    const { intro } = await req.json();
    if (!intro) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const info = await Info.findOne();
    if (!info) {
      return new Response(JSON.stringify({ error: "Information not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    info.intro = intro;
    await info.save();

    return new Response(JSON.stringify(info), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
