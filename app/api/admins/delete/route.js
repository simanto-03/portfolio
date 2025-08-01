import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(req) {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    
    if (!session || !session.user.admin) {
        return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await req.json();
    await Admin.findByIdAndDelete(id);
    
    return Response.json({ message: "Admin deleted successfully" });
}