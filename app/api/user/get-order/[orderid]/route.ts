import connectToDatabase from "@/app/lib/db";
import Order from "@/app/model/order.model";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { orderid: string } }) {
    await connectToDatabase();
    try {
        const { orderid } = await params;
        const order = await Order.findById(orderid).populate("assignmentdeliveryboyId").lean();
        if (!order) {
             return NextResponse.json(
                { message: "Order not found" },
                { status: 404 }
            );
        }
    return NextResponse.json(
        { order },
        { status: 200 }
    );
    }
    catch (error) {
        console.error("Error fetching order details:", error);
        return NextResponse.json(
            { message: "Failed to fetch order details" },
            { status: 500 }
        );
    }
}
      