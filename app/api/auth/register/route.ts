import connectToDatabase from "@/app/lib/db";
import User from "@/app/model/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
          await connectToDatabase();
        const { name, email, password} = await req.json();

            if (!name || !email || !password) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json({ message: "User with this email already exists" }, { status: 400 });
        }
        
        if(password.length < 6) {
            return NextResponse.json({ message: "Password must be at least 6 characters long" }, { status: 400 });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        const user=await User.create({
            name,
            email,
            password: hashedPassword,
            role: "user"
        })
         return NextResponse.json({ message: "User registered successfully", user }, { status: 201 });


    } catch (error) {
        console.error("Error in registration:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }

}