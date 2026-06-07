import { auth } from "@/app/auth";
import connectToDatabase from "@/app/lib/db";
import Grocery from "@/app/model/grocery.model";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
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

    await Grocery.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Delete failed" },
      { status: 500 }
    );
  }
}