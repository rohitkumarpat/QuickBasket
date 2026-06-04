"use client"

import Adminordercard from "@/app/component/Adminordercard";
import { getsocket } from "@/app/lib/socket";
import axios from "axios"
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

export interface IOrder {
  _id: string;

  item: {
    groceryId: string;
    name: string;
    price: number;
    unit: string;
    image: string;
    quantity: number;
  }[];

  ispaid: boolean;
  totalamount: number;
  paymentMethod: "cod" | "online";

  address: {
    fullName: string;
    city: string;
    state: string;
    postalCode: string;
    fulladdress: string;
    mobile: string;
  };

  status:
    | "pending"
    | "out-for-delivery"
    | "delivered"
    | "cancelled";

  createdAt: string;

  assignmentdeliveryboyId?: {
    _id: string;
    name: string;
    mobile: string;
    image?: string;
  };
}





export default function Manageorder() {
    const router = useRouter();
    const [orders, setOrders] = useState<IOrder[]>([]);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const res = await axios.get("/api/admin/getorder");
                setOrders(res.data.order || []);
                console.log("Fetched orders:", res.data.order);


            } catch (error) {
                console.log(error);
            }
        }

        fetchOrders(); 
    }, [])


useEffect(() => {
  const socket = getsocket();
  socket.connect();

  const handleConnect = () => {
    console.log("Manage order socket connected:", socket.id);
  };

  const handleConnectError = (error: Error) => {
    console.error("Manage order socket connection error:", error.message);
  };

  socket.on("connect", handleConnect);
  socket.on("connect_error", handleConnectError);

  socket.on("new-order", (neworder) => {
    console.log("Received new order:", neworder);
    setOrders((prevOrders) => {
      const alreadyExists = prevOrders.some((order) => order._id === neworder._id);
      if (alreadyExists) {
        return prevOrders;
      }

      return [neworder, ...prevOrders];
    });
  });

  return () => {
    socket.off("connect", handleConnect);
    socket.off("connect_error", handleConnectError);
    socket.off("new-order");
  };
}, []);

    return (
        <div>
          <div className="flex items-center justify-center gap-3 p-4 border-b bg-white sticky top-0 z-10">
        <button
          onClick={() => router.push("/")}
          className="text-xl hover:cursor-pointer"
        >
          <MoveLeft />
        </button>
        <h1 className="text-lg font-semibold text-green-600">Manage Orders</h1>
        </div>


        <div className="max-w-4xl mx-auto px-4 py-4  min-h-screen"> 
            {orders.map((order) => (
                <Adminordercard key={order._id} order={order} />
            ))}
             </div>
      </div>

      
    )
}
