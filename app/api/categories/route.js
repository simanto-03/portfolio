import { connectToDatabase } from "@/lib/mongodb";
import Category from "@/models/Category";

export async function GET() {
  await connectToDatabase();
  const categories = await Category.find().select("name -_id");
  return Response.json(categories);
}
