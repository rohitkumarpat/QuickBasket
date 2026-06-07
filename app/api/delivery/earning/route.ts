import { NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/db";
import Order from "@/app/model/order.model";
import { auth } from "@/app/auth";

export async function GET() {
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

    const DELIVERY_COMMISSION = 50;

    const today = new Date();

    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const deliveredOrders = await Order.find({
      assignmentdeliveryboyId: deliveryBoyId,
      status: "delivered",
      deliveryat: {
        $gte: startOfToday,
      },
    });

    const totalDeliveries = deliveredOrders.length;

    const totalEarnings =
      totalDeliveries * DELIVERY_COMMISSION;

    return NextResponse.json(
      {
        totalDeliveries,
        totalEarnings,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Error fetching delivery earnings:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to fetch earnings",
      },
      {
        status: 500,
      }
    );
  }
}