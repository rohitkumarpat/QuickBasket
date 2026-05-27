import connectToDatabase from "@/app/lib/db";
import User from "@/app/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();

        const { userId, latitude, longitude } = await req.json();

        if (!userId || latitude === undefined || longitude === undefined) {
            return NextResponse.json(
                { message: "userId, latitude and longitude are required" },
                { status: 400 }
            );
        }

        const user = await User.findByIdAndUpdate(
            userId,
            {
                location: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                }
            },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(
            { message: "Location updated successfully", location: user.location },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating user location:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
