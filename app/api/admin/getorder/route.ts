import connectToDatabase from "@/app/lib/db";
import Order from "@/app/model/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const orders = await Order.find()
      .populate(
        "assignmentdeliveryboyId",
        "name mobile"
      ).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ order: orders }, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to get the order" }, { status: 500 });
  }
}
