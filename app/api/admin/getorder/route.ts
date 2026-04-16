import connectToDatabase from "@/app/lib/db";
import Order from "@/app/model/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const orders = await Order.find({}).lean();

    const formattedOrders = orders.map((o: any) => ({
      id: o._id.toString(),
      userId: o.userId?.toString(),

      item: o.item,
      ispaid: o.ispaid,
      totalamount: o.totalamount,
      paymentMethod: o.paymentMethod,

      address: o.address,
      status: o.status,

      createdAt: o.createdAt?.toISOString(),
      updatedAt: o.updatedAt?.toISOString(),
    }));

    return NextResponse.json({ order: formattedOrders }, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to get the order" }, { status: 500 });
  }
}