"use client"

import Adminordercard from "@/app/component/Adminordercard";
import axios from "axios"
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

export interface IOrder {
  id: string; 
  userId: string;

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
    latitude: number;
    longitude: number;
  };

  status: "pending" | "out-for-delivery" | "delivered" | "cancelled";

  createdAt?: string; 
  updatedAt?: string;
}



export default function Manageorder() {
    const router = useRouter();
    const [orders, setOrders] = useState<IOrder[]>([]);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const res = await axios.get("/api/admin/getorder");
                setOrders(res.data.order || []);
            } catch (error) {
                console.log(error);
            }
        }

        fetchOrders(); 
    }, [])

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
                <Adminordercard key={order.id} order={order} />
            ))}
             </div>
      </div>

      
    )
}
