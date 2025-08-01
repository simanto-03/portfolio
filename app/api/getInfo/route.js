import { connectToDatabase } from "@/lib/mongodb";
import Info from "@/models/Info";

export async function GET()  {
  try {
    await connectToDatabase();
    const info = await Info.findOne();

    if (!info) {
      return new Response(JSON.stringify({ error: "Information not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(info), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
