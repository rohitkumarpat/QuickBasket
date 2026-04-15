import { auth } from "@/app/auth";
import connectToDatabase from "@/app/lib/db";
import Order from "@/app/model/order.model";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    
    // console.log("SESSION USER ID:", session.user.id);
    // console.log("TYPE:", typeof session.user.id);

                const order = await Order.find({
                userId: new mongoose.Types.ObjectId(session.user.id),
                }).lean();

    if (!order || order.length === 0) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

            const formattedOrders = order.map((o: any) => ({
            id: o._id.toString(),
            date: o.createdAt,
            isPaid: o.ispaid,             
            deliveryStatus: o.status,     
            total: o.totalamount,         
            address: o.address.fulladdress, 
            paymentMethod: o.paymentMethod,
            items: o.item,            
            }));
                // console.log("ordersdetail", formattedOrders);

    return NextResponse.json({ order: formattedOrders }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "my-order not found" }, { status: 500 });
  }
}