
import connectToDatabase from "@/app/lib/db";
import Msg from "@/app/model/msg.model";
import Order from "@/app/model/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await connectToDatabase();
    try {
        const { roomid } = await req.json();
        const room = await Order.findById(roomid);
        if(!room) {
            return NextResponse.json({ error: "Chatroom not found" }, { status: 404 });
        }

        const messages = await Msg.find({ roomid });
        return NextResponse.json({ messages }, { status: 200 });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }
}
        
