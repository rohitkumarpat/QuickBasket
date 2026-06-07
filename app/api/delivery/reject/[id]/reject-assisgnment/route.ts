import { auth } from "@/app/auth";
import connectToDatabase from "@/app/lib/db";
import DeliveryAssignment from "@/app/model/deliveryassignment";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const session = await auth();

    const deliveryBoyId = session?.user?.id;

    if (!deliveryBoyId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const assignment = await DeliveryAssignment.findById(id);

    if (!assignment) {
      return NextResponse.json(
        { message: "Assignment not found" },
        { status: 404 }
      );
    }

    await DeliveryAssignment.findByIdAndUpdate(id, {
      $pull: {
        broadcasterId: deliveryBoyId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        assignmentId: id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to reject assignment" },
      { status: 500 }
    );
  }
}