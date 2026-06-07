import { auth } from "@/app/auth";
import connectToDatabase from "@/app/lib/db";
import Grocery from "@/app/model/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const session = await auth();

    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const body = await req.json();

    const grocery = await Grocery.findByIdAndUpdate(
      id,
      {
        name: body.name,
        price: body.price,
        category: body.category,
        unit: body.unit,
        description: body.description,
      },
      {
        new: true,
      }
    );

    return NextResponse.json({
      message: "Updated successfully",
      grocery,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Update failed" },
      { status: 500 }
    );
  }
}