import connectToDatabase from "@/app/lib/db";
import Order from "@/app/model/order.model";
import { connect } from "http2";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_WEBHOOK_SECRET!);


export async function POST(req: NextRequest) {
    const sign=req.headers.get("stripe-signature");
    const rawBody=await req.text();
     let event:Stripe.Event;
    try{
       event=stripe.webhooks.constructEvent(rawBody,sign!,process.env.STRIPE_WEBHOOK_SECRET!);
        
    }catch(error) {
           console.log("Error verifying webhook signature:", error);
           return NextResponse.json({message:"error in verfying the webhook signature"}, {status:400});
    }

  if(event.type==="checkout.session.completed"){
    const session=event.data.object as Stripe.Checkout.Session;
    await connectToDatabase();
    await Order.findByIdAndUpdate(session.metadata?.orderId,{
         ispaid:true,
    });

     return NextResponse.json({message:"Payment successful and order updated"}, {status:200
    });
  } 

}
