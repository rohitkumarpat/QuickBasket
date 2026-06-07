import { NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/db";
import Grocery from "@/app/model/grocery.model";
import { auth } from "@/app/auth";

export async function GET() {
  try {
    await connectToDatabase();

    const session = await auth();

    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const groceries = await Grocery.find().sort({
      createdAt: -1,
    });

    return NextResponse.json({
      groceries,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch groceries" },
      { status: 500 }
    );
  }
}