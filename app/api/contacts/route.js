import Contact from "@/models/Contact";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
    try {
        await connectToDatabase();
        const contacts = await Contact.find();
        if (!contacts || contacts.length === 0) {
            return new Response(JSON.stringify({ error: "No contacts found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }
        return new Response(JSON.stringify(contacts[0]), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to fetch contacts" }), {
            status: 500,
        });
    }
}

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        await connectToDatabase();
        const body = await req.json();
        const contact = await Contact.create(body);

        return new Response(JSON.stringify(contact), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error(error);
            return new Response(JSON.stringify({ error: "Failed to create contact" }), {
            status: 500,
        });
    }
}
