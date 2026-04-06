import { auth } from "@/app/auth";
import User from "@/app/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    try {
        const session=await auth();
        if(!session){
            return NextResponse.json({message:"Unauthorized"},{status:401})
        }

        const user=await User.findOne({email:session.user?.email}).select("-password");

        if(!user){
            return NextResponse.json({message:"User not found"},{status:404})
        }
        return NextResponse.json({user},{status:200})

}catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
