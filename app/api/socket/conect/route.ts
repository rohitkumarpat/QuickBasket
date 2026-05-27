import connectToDatabase from "@/app/lib/db";
import User from "@/app/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export  async function POST(req:NextRequest) {
     try {
        await connectToDatabase();
        const {socketid,userid}=await req.json();
        const user=await User.findByIdAndUpdate(userid,
            {socketid:socketid,
            isonline:true
        });

        if(!user){
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "User connected successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error connecting user:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
     }
}