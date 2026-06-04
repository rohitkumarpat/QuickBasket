import connectToDatabase from "@/app/lib/db";
import { auth } from "@/app/auth";
import { NextResponse } from "next/dist/server/web/spec-extension/response";
import DeliveryAssignment from "@/app/model/deliveryassignment";

export async function GET() {
    try {
        await connectToDatabase();
        const session = await auth();
        const deliveryBoyId = session?.user?.id;
        if (!deliveryBoyId) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        // Fetch the current order assigned to the delivery boy
        const activeassignment = await DeliveryAssignment.find({
            assigneid: deliveryBoyId,
            status: "assigned"
        })
            .populate("orderId")
            .lean();


        if (!activeassignment) {
            return NextResponse.json(
                { active: false, message: "No active orders assigned" },
                { status: 404 }
            );
        }

        if (activeassignment.length === 0) {
            return NextResponse.json(
                { active: false, message: "No active orders assigned" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { active: true, assignment: activeassignment },
            { status: 200 }
        );;



    } catch (error) {
        return NextResponse.json(
            { message: "error in fetching current order of delivery boy" },
            { status: 500 }
        );
    }
}