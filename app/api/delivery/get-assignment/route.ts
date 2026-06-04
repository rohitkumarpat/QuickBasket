import { auth } from "@/app/auth";
import connectToDatabase from "@/app/lib/db";
import DeliveryAssignment from "@/app/model/deliveryassignment";
import { NextRequest, NextResponse } from "next/server";
import "@/app/model/order.model";

export async function GET(req: NextRequest) {

    try {

        await connectToDatabase();

        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        console.log(session);

        const assignment = await DeliveryAssignment.find({
            broadcasterId: session.user.id,
            status: "broadcast"
        }).populate("orderId");
           
        console.log(assignment);
        
        return NextResponse.json(
            { assignment },
            { status: 200 }
        );

    } catch (error) {

        console.error("Error fetching delivery assignments:", error);

        return NextResponse.json(
            { message: "Failed to fetch delivery assignments" },
            { status: 500 }
        );
    }
}
