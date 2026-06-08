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
import Geoupdater from "./component/Geoupdater";


export default async function Home({searchParams,}: {searchParams: Promise<{ q?: string }>; }) {
  await connectToDatabase();

  const params = await searchParams;
    const query = params.q || "";

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

      <Geoupdater userId={user._id} />
       
      {user.role === "user" && <Userdashboard query={query} />}

      {user.role === "deliveryboy" && <Delivery />}

      {user.role === "admin" && <Admindashboard />}
    </div>
  );
}
