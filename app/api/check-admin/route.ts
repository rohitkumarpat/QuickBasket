
import connectToDatabase from "@/app/lib/db";
import User from "@/app/model/user.model";
import { NextResponse } from "next/server";

export async function GET() {
    await connectToDatabase();
 try {
        const user=await User.find({role:"admin"});
        if(user.length>0){
            return NextResponse.json({ 
                isAdmin: true,
             }, { status: 200 });
        }else {
            return NextResponse.json({ 
                isAdmin: false,
             }, { status: 200 });
        }
}


catch (error) {
    console.log(error);
    return NextResponse.json({ message: "not a admin" }, { status: 401 });
  }
}
