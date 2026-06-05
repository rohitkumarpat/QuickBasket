"use client"

import axios from "axios";
import React, { useEffect, useState } from "react";
import { getsocket } from "../lib/socket";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Geoupdater from "./Geoupdater";


interface Assignment {
  _id: string;

  orderId: {
    _id: string;

    address: {
      fullName: string;
      city: string;
      state: string;
      postalCode: string;
      fulladdress: string;
    };

    paymentMethod: string;
    status: string;
    totalamount: number;
  };
}

interface NewDeliveryAssignmentPayload {
  assignment: {
    _id: string;
  };
  orderId: Assignment["orderId"];
}


import dynamic from "next/dynamic";

const Livemap = dynamic(
  () => import("@/app/component/Livemap"),
  {
    ssr: false,
  }
);

function Deliveryboydashboard() {

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const { user }=useSelector((state:RootState)=>state.user);
  const [activeorder,setactiveorder]=useState<any>(null);
  const [location,setlocation]=useState<{latitude:number,longitude:number}|null>(null);

const [deliverylocation,setdeliverylocation]=useState<{latitude:number,longitude:number}|null>(null);


  useEffect(() => {

    const fetchData = async () => {

      try {

        const response = await axios.get(
          "/api/delivery/get-assignment"
        );

        console.log(response.data.assignment);

        setAssignments(response.data.assignment);

      } catch (error) {

        console.error(
          "Error fetching delivery assignments:",
          error
        );

      }
    };

    fetchData();

  }, [user]);


  
  useEffect(() => {
    const socket = getsocket();
    socket.connect();

    const handleNewDeliveryAssignment = ({
      assignment,
      orderId,
    }: NewDeliveryAssignmentPayload) => {

      console.log("ASSIGNMENT RECEIVED", { assignment, orderId });

      setAssignments((prev) => [
        ...prev,
        {
          _id: assignment._id,
          orderId,
        },
      ]);
    };

    socket.on("new-delivery-assignment", handleNewDeliveryAssignment);

    return () => {
      socket.off("new-delivery-assignment", handleNewDeliveryAssignment);
    };
  }, []);



   const handleAccept = async (assignmentId: string) => {
  try {
    const response = await axios.get(
      `/api/delivery/accept/${assignmentId}/accept-assignment`
    );
   setAssignments(prev =>
      prev.filter(a => a._id !== assignmentId)
    );
    console.log(response.data);

  } catch (error) {
    console.error(error);
  }
};


// const handleReject = async (assignmentId: string) => {
//   try {
//     const response = await axios.post(
//       `/api/delivery/reject/${assignmentId}/reject-assignment`
//     );

//     console.log(response.data);
//     setAssignments((prev) => prev.filter((a) => a._id !== assignmentId));

//   } catch (error) {
//     console.error(error);
//   }
// };

//fetch the current active assignment of delivery boy using axios and display it in the dashboard
 useEffect(() => {

    const fetchCurrentAssignment = async () => {

      try {

        const response = await axios.get(
          "/api/delivery/current-order"
        );
    // console.log("current assignment response",response.data);
          if(response.data.active){
            setactiveorder(response.data.assignment[0]);
            setlocation({
              latitude:response.data.assignment[0].orderId.address.latitude,
              longitude:response.data.assignment[0].orderId.address.longitude
            })
          }
      } catch (error) {

        console.error(
          "Error fetching delivery assignments:",
          error
        );

      }
    };

    fetchCurrentAssignment();

  }, [user]);


if (activeorder && location){
  return (
    <div className="p-4 pt-[50px] min-h-screen bg-gray-50">
      {user?._id ? (
        <Geoupdater
          userId={String(user._id)}
          onLocationChange={(nextLocation) => {
            console.log("[delivery-dashboard] local map state updated", nextLocation);
            setdeliverylocation(nextLocation);
          }}
        />
      ) : null}
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-green-700 mb-2">
          Active Delivery
        </h1>

        <p className="text-gray-600 text-sm mb-4">
          order#{activeorder.orderId._id.slice(-6)}
        </p>

        <div className="rounded-xl border shadow-lg overflow-hidden mb-6">
          <Livemap location={location} deliverylocation={deliverylocation} />
        </div>
      </div>
    </div>
  );
}
  return (

    <div className="w-full min-h-screen bg-gray-100 p-4">

      <div className="max-w-2xl mx-auto">

        <h2 className="text-2xl font-bold mt-6 mb-6">
          Delivery Assignments
        </h2>

        {assignments.map((a) => (

          <div
            key={a._id.toString()}
            className="bg-white border rounded-2xl shadow-md p-4 mb-4"
          >

            {/* Order ID */}
            <h3 className="text-base font-bold mb-1">

              Order Id #

              {a.orderId._id.toString().slice(-6)}

            </h3>

            {/* Address */}
            <p className="text-sm text-gray-600 mb-3">

              {a.orderId.address.fulladdress},

              {" "}

              {a.orderId.address.city},

              {" "}

              {a.orderId.address.state},

              {" "}

              {a.orderId.address.postalCode}

            </p>

            {/* Extra Details */}
            <div className="space-y-1 mb-4 text-sm">

              <p>
                <span className="font-semibold">
                  Customer:
                </span>

                {" "}

                {a.orderId.address.fullName}
              </p>

              <p>
                <span className="font-semibold">
                  Payment:
                </span>

                {" "}

                {a.orderId.paymentMethod}
              </p>

              <p>
                <span className="font-semibold">
                  Total:
                </span>

                {" "}

                ₹{a.orderId.totalamount}
              </p>



            </div>

            {/* Buttons */}
            <div className="flex gap-3">

              <button
                onClick={() => handleAccept(a._id)}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-semibold transition"
              >
                Accept
              </button>

              <button
                //  onClick={() => handleReject(a._id)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-semibold transition"
              >
                Reject
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Deliveryboydashboard;
