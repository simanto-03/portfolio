import { connectToDatabase } from '@/lib/mongodb';
import Contact from '@/models/Contact';
import { NextResponse } from 'next/server';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function PUT(req, context) {
  const { id } = context.params;
  await connectToDatabase();
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (!id) {
      return NextResponse.json({ error: 'Contact ID is required' }, { status: 400 });
    }

    const body = await req.json();
    const updated = await Contact.findByIdAndUpdate(id, body, { new: true });

    if (!updated) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
  }
}
