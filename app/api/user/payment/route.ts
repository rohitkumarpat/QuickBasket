import connectToDatabase from "@/app/lib/db";
import Order from "@/app/model/order.model";
import User from "@/app/model/user.model";


const stripe=new Stripe(process.env.Secret_key!)



import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

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


       const session=await stripe.checkout.sessions.create({
        payment_method_types:["card"],
        mode:"payment",
        success_url:`${process.env.NEXT_BASE_URL}/frontend/user/order-sucess`,
        cancel_url:`${process.env.NEXT_BASE_URL}/frontend/user/order-cancel`,
       line_items: [{
      price_data: {
        currency: 'inr',
        product_data: {
          name: 'QuickBasket Order Payment',
        },
        unit_amount: totalamount*100,
      },
      quantity: 1,
        }],

       metadata:{
        orderId:neworder._id.toString(),
      }
       });
    

       return NextResponse.json({url:session.url}, { status: 200 });


         }catch (error) {
          return NextResponse.json({ message: "Failed payment" }, { status: 500 });
    }
}