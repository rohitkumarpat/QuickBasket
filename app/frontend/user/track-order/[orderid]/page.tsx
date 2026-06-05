"use client";

import { use, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import axios from "axios";
import mongoose from "mongoose";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { getsocket } from "@/app/lib/socket";



interface IOrder {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  item: [
    {
      groceryId: mongoose.Types.ObjectId;
      name: string;
      price: number;
      unit: string;
      image: string;
      quantity: number;
    }
  ]
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
  }
  assignment?: mongoose.Types.ObjectId | null;
  assignmentdeliveryboyId?: mongoose.Types.ObjectId | null;
  status: "pending" | "out-for-delivery" | "delivered" | "cancelled";
  createdAt?: Date;
  updatedAt?: Date;

}

const Livemap = dynamic(
  () => import("@/app/component/Livemap"),
  {
    ssr: false,
  }
);

export default function Trackorder({ params }: { params: Promise<{ orderid: string }> }) {
  const { orderid } = use(params);
  const { user } = useSelector((state: RootState) => state.user);

  const [order, setOrder] = useState<IOrder>();

  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [deliveryLocation, setDeliveryLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/user/get-order/${orderid}`);
        setOrder(res.data.order);

        // console.log("rohitporevnh", res.data.order);

        setLocation({
          latitude: res.data.order.address.latitude,
          longitude: res.data.order.address.longitude,
        });

        const boy = res.data.order.assignmentdeliveryboyId;
        if (boy?.location?.coordinates) {
          setDeliveryLocation({
            longitude: boy.location.coordinates[0],
            latitude: boy.location.coordinates[1],
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrder();
  }, [orderid]);


  useEffect(() => {
    if (!order) return;
    const socket = getsocket();


    const handleLocationUpdate = ({ userId,latitude,longitude,}: {
      userId: string; latitude: number; longitude: number; }) => {
      console.log("LOCATION EVENT RECEIVED");
        console.log("socket userId:", userId);
           console.log(
    "order.assignmentdeliveryboyId:",
    order.assignmentdeliveryboyId
          );


      // if (userId.toString() ===String(order.assignmentdeliveryboyId)) {
      //   setDeliveryLocation({ latitude,longitude,});
      // }
    };

    socket.on(
      "update-delivery-boy-location",
      handleLocationUpdate
    );

    return () => {  socket.off("update-delivery-boy-location",handleLocationUpdate); };
  }, [user, order]);



  if (!order || !location) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="bg-white  px-6 py-6">
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => router.push("/frontend/user/my-order")}
              className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center text-xl font-bold shadow-md hover:bg-green-600 transition"
            >
              ←
            </button>

            <h1 className="text-xl font-bold text-gray-600">
              Back
            </h1>
          </div>

          <div className="text-center mt-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Track Order
            </h1>

            <p className="text-lg text-gray-600 mt-2">
              Order #{String(order._id).slice(-6)}
            </p>

            <span className="inline-block mt-3 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
              {order.status.replaceAll("-", " ")}
            </span>
          </div>
        </div>

        {/* Map Card */}
        <div className="flex justify-center mt-8">
          <div className="w-full max-w-3xl overflow-hidden rounded-[32px] border bg-white shadow-lg">
            <Livemap
              location={location}
              deliverylocation={deliveryLocation}
            />
          </div>
        </div>

      </div>
    </div>
  );
}