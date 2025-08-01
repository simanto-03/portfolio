import { NextResponse } from 'next/server';
import Info from '@/models/Info';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
    await connectToDatabase();    
    const info = await Info.findOne();
    return NextResponse.json(info?.education || []);
}

export async function POST(req) {
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.admin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectToDatabase();
    const newEducation = await req.json();

    const info = await Info.findOne();
    if (!info) return NextResponse.json({ error: "Info not found" }, { status: 404 });

    info.education.push(newEducation);
    await info.save();

    return NextResponse.json(info.education);
}

export async function DELETE(req) {
  await connectToDatabase();
  const { index } = await req.json();

  const info = await Info.findOne();
  if (!info) return NextResponse.json({ error: "Info not found" }, { status: 404 });

  if (index < 0 || index >= info.education.length) {
    return NextResponse.json({ error: "Invalid index" }, { status: 400 });
  }

  info.education.splice(index, 1);
  await info.save();

  return NextResponse.json(info.education);
}
