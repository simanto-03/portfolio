import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import bcrypt from "bcrypt";

export async function POST(req) {
    try {
         await connectToDatabase();

        const { username, password } = await req.json(); 
        
        if (!username || !password) {
            return Response.json({ error: "Invalid input" }, { status: 400 });
        }

        const existingUser = await Admin.findOne({ username });
        if (existingUser) {
            return Response.json({ error: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new Admin({ username, password: hashedPassword });
        await newUser.save();

        return Response.json({ message: "User registered successfully" }, { status: 201 });
    } catch (error) {
        return Response.json({ error: "Server error" }, { status: 500 });
    }
    
}