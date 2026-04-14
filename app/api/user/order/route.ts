import connectToDatabase from "@/app/lib/db";
import Order from "@/app/model/order.model";
import User from "@/app/model/user.model";


import { NextRequest, NextResponse } from "next/server";

export  async function POST(req:NextRequest){
    try {
        await connectToDatabase();

        const { userId, item, totalamount, paymentMethod, address } = await req.json();

        if(!userId || !item || !totalamount || !paymentMethod || !address){
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }
      
        const Userdetail=await User.findById(userId);
        if(!Userdetail){
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
         
       const neworder=await Order.create({
        userId,
        item,
        totalamount,
        paymentMethod,
        address,
       });

       return NextResponse.json({ message: "Order created successfully", order: neworder }, { status: 201 });



         }catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ message: "Failed to create order" }, { status: 500 });
    }
}