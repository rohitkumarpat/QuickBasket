import { connect } from "http2";
import Image from "next/image";
import connectToDatabase from "./lib/db";
import { auth } from "./auth";
import User from "./model/user.model";
import { redirect } from "next/navigation";
import Editrolemobile from "./component/editrolemobile";
import Nav from "./component/Nav";



export default async function Home() {
   await connectToDatabase();
   const session=await auth();   //for server ke liye and for csr we use sessionhook
  

      if (!session?.user?.id) {
        throw new Error("Unauthorized");
      }

    const user = await User.findById(session.user.id).lean();
    if (user) {
  user._id = user._id.toString(); 
}
    

     if(!user) {
      redirect("/frontend/login");
     }

   const isMobileMissing = !user.mobile;
const isRoleMissing = !user.role;

const incompleteProfile = isMobileMissing || isRoleMissing;
     
       if(incompleteProfile) {
         return <Editrolemobile />
       }

      return (
        <div>
         <>
         <Nav user={user} />
         </>
        </div>
      );
    }
