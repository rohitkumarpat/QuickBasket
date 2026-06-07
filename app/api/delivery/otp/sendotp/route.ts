import connectToDatabase from "@/app/lib/db";
import { sendEmail } from "@/app/lib/mail";
import Order from "@/app/model/order.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest) {
    await connectToDatabase();
    try {
        const { orderId} = await req.json();
        const order = await Order.findById(orderId).populate("userId");

        if (!order) {
            return NextResponse.json(
                { message: "Order not found" },
                { status: 404 }
            );
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        order.deliveryotp = otp;
        await order.save();

        await sendEmail(
            order.userId.email,
            "Your Delivery OTP",
            `<p>Your OTP for order delivery is: <strong>${otp}</strong></p>`
        );

        return NextResponse.json(
            { message: "OTP generated and saved successfully", otp },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error generating OTP:", error);
        return NextResponse.json(
            { message: "Failed to generate OTP" },
            { status: 500 }
        );
    }
}