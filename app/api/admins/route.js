import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(req) {
    await connectToDatabase();
    
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.admin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const admins = await Admin.find({});
    return NextResponse.json(admins);
}