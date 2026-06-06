import connectToDatabase from "@/app/lib/db";
import Msg from "@/app/model/msg.model";
import { NextRequest, NextResponse } from "next/server";
import Order from "@/app/model/order.model";

export async function POST(req: NextRequest) {
         await connectToDatabase();
    try {
        const { roomid, text, senderid, time } = await req.json();  
         const room=await Order.findById(roomid);
        if(!room) {
            return NextResponse.json({ error: "Chatroom not found" }, { status: 404 });
        }

        const message=await Msg.create({ roomid, text, senderid, time });
        return NextResponse.json({ message }, { status: 200 });


    } catch (error) {
        console.error("Error saving message:", error);
        return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
    }
}
   