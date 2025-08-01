import { connectToDatabase } from "@/lib/mongodb";
import Publication from "@/models/Publication";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function PUT(req, context) {
    const { id } = context.params;
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        await connectToDatabase();
        const body = await req.json();
        const updatedPub = await Publication.findByIdAndUpdate(id, body, { new: true });
        return NextResponse.json(updatedPub);
    } catch (err) {
        return NextResponse.json({ error: "Failed to update publication!" }, { status: 500 });
    }
}
