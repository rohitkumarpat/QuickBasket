import { auth } from "@/app/auth";
import { cloudinaryUpload } from "@/app/lib/cloudinary";
import connectToDatabase from "@/app/lib/db";
import Grocery from "@/app/model/grocery.model";
import { form, image } from "motion/react-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const session = await auth();

    if (session?.user.role !== "admin") {
      return NextResponse.json({ message: "you are not admin" }, { status: 400 });
    }

    const formData = await req.formData();

    const name = formData.get("name")?.toString();
    const price = Number(formData.get("price"));
    const category = formData.get("category")?.toString();
    const file = formData.get("file") as File;
    const unit = formData.get("unit")?.toString();
    const description = formData.get("description")?.toString();

    if (!name || !price || !category || !unit) {
      return NextResponse.json({ message: "All fields required" }, { status: 400 });
    }

    let imageUrl = "";

    if (file && file instanceof File) {
      imageUrl = await cloudinaryUpload(file);
    }

    const groceryItem = await Grocery.create({
      name,
      price,
      category,
      image: imageUrl,
      unit,
      description,
    });

    return NextResponse.json(
      { message: "grocery item added successfully", groceryItem },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding grocery item:", error);
    return NextResponse.json(
      { message: "Failed to add grocery item" },
      { status: 500 }
    );
  }
}