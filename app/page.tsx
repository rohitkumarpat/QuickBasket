import Image from "next/image";
import connectToDatabase from "./lib/db";
import { auth } from "./auth";
import User from "./model/user.model";
import { redirect } from "next/navigation";
import Editrolemobile from "./component/editrolemobile";
import Nav from "./component/Nav";
import Userdashboard from "./component/Userdashboard";
import Admindashboard from "./component/Admindashboard";
import Delivery from "./component/Delivery";

export default async function Home() {
  await connectToDatabase();

  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const user = await User.findById(session.user.id).lean();
  console.log("User from database:", user);

  if (!user) {
    redirect("/frontend/login");
  }

  // Convert _id to string
  user._id = user._id.toString();

  const isMobileMissing = !user.mobile;
  const isRoleMissing = !user.role;

  const incompleteProfile = isMobileMissing || isRoleMissing;

  if (incompleteProfile) {
    return <Editrolemobile />;
  }

  return (
    <div>
      <Nav user={user} />

      {user.role === "user" && <Userdashboard />}

      {user.role === "deliveryboy" && <Delivery />}

      {user.role === "admin" && <Admindashboard />}
    </div>
  );
}