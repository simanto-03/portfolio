import { NextResponse } from "next/server";
import { storage } from "../../../lib/firebase"; // Adjust this based on your actual import path
import { ref, uploadString, getDownloadURL } from "firebase/storage";

// Ensure the POST method is handled
export async function POST(req) {
    
  try {
    const { image } = await req.json(); // Expect base64 image from the client
    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Generate a unique name for the image
    const imageRef = ref(storage, `images/${Date.now()}.png`);

    // Upload the base64 image to Firebase Storage
    await uploadString(imageRef, image, "base64");

    // Get the download URL of the uploaded image
    const url = await getDownloadURL(imageRef);    

    return NextResponse.json({ url }); // Return the image URL
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
