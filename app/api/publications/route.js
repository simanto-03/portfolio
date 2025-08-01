import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import Publication from "@/models/Publication";

export async function GET() {
    await connectToDatabase();
    const publications = await Publication.find().sort({ year: -1 });
    return NextResponse.json(publications);
}

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        await connectToDatabase();
        const body = await req.json();
        const newPub = new Publication(body);
        await newPub.save();
        return NextResponse.json({ message: "Created", publication: newPub }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: "Failed to add publication" }, { status: 500 });
    }
}
