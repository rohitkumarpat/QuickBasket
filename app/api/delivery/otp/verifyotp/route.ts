import connectToDatabase from "@/app/lib/db";
import DeliveryAssignment from "@/app/model/deliveryassignment";
import Order from "@/app/model/order.model";
import next from "next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await connectToDatabase();
    try {
        const { orderId, otp } = await req.json();

        const order = await Order.findById(orderId);
        if (!order) {
            return NextResponse.json(
                { message: "Order not found" },
                { status: 404 }
            );
        }
        if (!otp) {
            return NextResponse.json(
                { message: "OTP is required" },
                { status: 400 }
            );
        }

        if (order.deliveryotp !== otp) {
            return NextResponse.json(
                { message: "Invalid OTP" },
                { status: 400 }
            );
        }
        order.status = "delivered";
        order.ispaid = true;
        order.deliveryotpverfication = true;
        order.deliveryat = new Date();

        await order.save();

        await DeliveryAssignment.findOneAndUpdate(
            { orderId: order._id },
        
            {
                status: "completed",
                assigneid: null,
            } 
        );

        return NextResponse.json(
            { message: "Order delivered successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return NextResponse.json(
            { message: "Error verifying OTP" },
            { status: 500 }
        );
    }
}

