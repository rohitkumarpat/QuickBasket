import { auth } from "@/app/auth";
import connectToDatabase from "@/app/lib/db";
import User from "@/app/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    try {
  await connectToDatabase();

  const {role, mobile } = await req.json();

  if (!role || !mobile) {
    return NextResponse.json({ message: "Role and mobile number are required" }, { status: 400 });
  }
  
  const session = await auth();

  const user=await User.findOneAndUpdate({email: session?.user?.email}, {role, mobile},{ returnDocument: "after" });

  if(!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

    return NextResponse.json({ message: "Profile updated successfully", user }, { status: 200 });

}catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
}
}