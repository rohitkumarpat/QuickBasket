import { auth } from "@/app/auth";
import connectToDatabase from "@/app/lib/db";
import emiteventhandler from "@/app/lib/emiteventhandler";
import DeliveryAssignment from "@/app/model/deliveryassignment";
import Order from "@/app/model/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    const session = await auth();
    const deliveryboyId = session?.user?.id;

    if (!deliveryboyId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const assisgnment = await DeliveryAssignment.findById(id);

    if (!assisgnment) {
      return NextResponse.json(
        { message: "Assignment not found" },
        { status: 404 }
      );
    }

    if (assisgnment.status !== "broadcast") {
      return NextResponse.json(
        { message: "Assignment already accepted" },
        { status: 400 }
      );
    }

    const allreadyasssigned = await DeliveryAssignment.findOne({
      assigneid: deliveryboyId,
      status: { $nin: ["completed", "broadcast"] },
    });

    if (allreadyasssigned) {
      return NextResponse.json(
        { message: "You have already accepted another assignment" },
        { status: 400 }
      );
    }

    assisgnment.assigneid = deliveryboyId;
    assisgnment.status = "assigned";

    await assisgnment.save();

    const order = await Order.findById(assisgnment.orderId);

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    order.assignmentdeliveryboyId = deliveryboyId;

    await order.save();
    await order.populate("assignmentdeliveryboyId");

    await emiteventhandler("order-assignment", {
      orderId: order._id.toString(),
      assignmentdeliveryboyId: order.assignmentdeliveryboyId,
    });

    const updatedAssignment = await DeliveryAssignment.findById(
      assisgnment._id
    )
      .populate("orderId")
      .lean();

    return NextResponse.json(
      {
        message: "Delivery assignment accepted successfully",
        assignment: updatedAssignment,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error accepting delivery assignment:", error);

    return NextResponse.json(
      { message: "Failed to accept delivery assignment" },
      { status: 500 }
    );
  }
}