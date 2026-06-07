  "use client"

  import axios from "axios";
  import React, { useEffect, useState } from "react";
  import { getsocket } from "../lib/socket";
  import { useSelector } from "react-redux";
  import { RootState } from "../redux/store";
  import Geoupdater from "./Geoupdater";


  import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";


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
  import Deliverychat from "./Deliverychat";
  import { useRouter } from "next/navigation";

  const Livemap = dynamic(
    () => import("@/app/component/Livemap"),
    {
      ssr: false,
    }
  );

  function Deliveryboydashboard() {

    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const { user } = useSelector((state: RootState) => state.user);
    const [activeorder, setactiveorder] = useState<any>(null);
    const [location, setlocation] = useState<{ latitude: number, longitude: number } | null>(null);

    const [deliverylocation, setdeliverylocation] = useState<{ latitude: number, longitude: number } | null>(null);

    const [showotpbox, setshowotpbox] = useState(false);
    const [otp, setopt] = useState("");
    const router = useRouter();
    const [sendingOtp, setSendingOtp] = useState(false);
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [earning, setEarning] = useState({ totalDeliveries: 0,
    totalEarnings: 0,});

    const [refreshLoading, setRefreshLoading] = useState(false);


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
      await axios.get(
        `/api/delivery/accept/${assignmentId}/accept-assignment`
      );

      const currentOrderRes = await axios.get(
        "/api/delivery/current-order"
      );

      if (currentOrderRes.data.active) {
        const order = currentOrderRes.data.assignment[0];

        setactiveorder(order);
        console.log("ordertjkfdn",order);

        setlocation({
          latitude: order.orderId.address.latitude,
          longitude: order.orderId.address.longitude,
        });
      }

      setAssignments((prev) =>
        prev.filter((a) => a._id !== assignmentId)
      );

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
          if (response.data.active) {
            setactiveorder(response.data.assignment[0]);
            setlocation({
              latitude: response.data.assignment[0].orderId.address.latitude,
              longitude: response.data.assignment[0].orderId.address.longitude
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

    const sendotp = async () => {
      try {
        setSendingOtp(true);
        setStatusMessage("");

        await axios.post(
          "/api/delivery/otp/sendotp",
          {
            orderId: activeorder.orderId._id,
          }
        );

        setshowotpbox(true);
        setStatusMessage("OTP sent to customer's email.");
      } catch (error) {
        console.error(error);
        setStatusMessage("Failed to send OTP.");
      } finally {
        setSendingOtp(false);
      }
    };


    const verifyOtp = async () => {
      try {
        setVerifyingOtp(true);
        setStatusMessage("");

        await axios.post(
          "/api/delivery/otp/verifyotp",
          {
            orderId: activeorder.orderId._id,
            otp,
          }
        );

        setStatusMessage("Delivery completed successfully.");

        setTimeout(() => {
          setactiveorder(null);
          router.refresh();
        }, 1000);

      } catch (error: any) {
        console.error(error);

        setStatusMessage(
          error?.response?.data?.message || "Invalid OTP"
        );
      } finally {
        setVerifyingOtp(false);
      }
    };

      const handleReject = async (assignmentId: string) => {
    try {
      await axios.post(
        `/api/delivery/reject/${assignmentId}/reject-assisgnment`
      );

      setAssignments((prev) =>
        prev.filter((a) => a._id !== assignmentId)
      );
    } catch (error) {
      console.error(error);
    }
  };



  useEffect(() => {
  fetchEarning();
}, []);

const fetchEarning = async () => {
  try {
    setRefreshLoading(true);
    const res = await axios.get(
      "/api/delivery/earning"
    );

    setEarning(res.data);
  } catch (error) {
    console.log(error);
  }finally {
    setRefreshLoading(false);
  }
};


    if (activeorder && location) {
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
          <div className="mx-auto max-w-6xl">
            <h1 className="text-2xl font-bold text-green-700 mb-2">
              Active Delivery
            </h1>

            <p className="text-gray-600 text-sm mb-4">
              order#{activeorder.orderId._id.slice(-6)}
            </p>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.85fr)] lg:items-start">
              <div className="overflow-hidden rounded-xl border shadow-lg">
                <Livemap location={location} deliverylocation={deliverylocation} />
              </div>
              {user?._id ? (
                <div>
                  <h2 className="mb-3 text-xl font-bold text-green-700">
                    Chat with Customer
                  </h2>
                  <Deliverychat
                    orderid={String(activeorder.orderId._id)}
                    deliveryboyid={String(user._id)}
                  />
                  <div className="mt-4 rounded-2xl border-1 border-black bg-white p-4 shadow-md">
                    <h3 className="text-lg font-bold text-black mb-2">
                      Delivery Status
                    </h3>

                    <p className="text-sm text-gray-600 mb-4">
                      Once the customer has received the order,
                      verify the OTP to complete delivery.
                    </p>

                    {statusMessage && (
                      <div className="mb-3 rounded-lg bg-gray-100 p-3 text-sm text-gray-700">
                        {statusMessage}
                      </div>
                    )}

                    {!showotpbox ? (
                      <button
                        onClick={sendotp}
                        disabled={sendingOtp}
                        className="w-full rounded-xl bg-green-600 px-4 py-3 font-semibold text-white disabled:opacity-50"
                      >
                        {sendingOtp ? "Sending OTP..." : "Send Delivery OTP"}
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setopt(e.target.value)}
                          placeholder="Enter Customer OTP"
                          className="w-full rounded-xl border border-gray-300 p-3"
                        />

                        <button
                          onClick={verifyOtp}
                          disabled={verifyingOtp}
                          className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-50"
                        >
                          {verifyingOtp
                            ? "Verifying OTP..."
                            : "Verify OTP & Complete Delivery"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      );
    }
  return (
  <div className="min-h-screen bg-[#eef8ef] p-4">
    <div className="max-w-7xl mx-auto">

      {assignments.length === 0 ? (
        <div className="max-w-lg mx-auto">

          <div className="text-center mt-20">
            <h2 className="text-4xl font-bold text-gray-800">
              No Active Deliveries 🚚
            </h2>

            <p className="text-gray-500 mt-2">
              Stay online to receive new orders
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6 mt-8 border">
            <h2 className="text-center text-green-700 font-bold text-xl mb-6">
              Today's Performance
            </h2>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={[
                  {
                    name: "Today",
                    deliveries: earning.totalDeliveries,
                    earnings: earning.totalEarnings,
                  },
                ]}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />

                <Bar
                  dataKey="deliveries"
                  fill="#16a34a"
                />

                <Bar
                  dataKey="earnings"
                  fill="#22c55e"
                />
              </BarChart>
            </ResponsiveContainer>

            <h3 className="text-center text-3xl font-bold text-green-700 mt-5">
              ₹{earning.totalEarnings}
            </h3>

            <p className="text-center text-gray-600">
              Earned Today
            </p>

           <button
  onClick={fetchEarning}
  disabled={refreshLoading}
  className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white
    py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed">
  {refreshLoading ? (
    <div className="flex items-center justify-center gap-2">
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      Refreshing...
    </div>
  ) : (
    "Refresh Earnings"
  )}
</button>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">

          {/* LEFT SIDE */}
          <div
       className=" bg-white rounded-3xl shadow-xl p-6 border h-fit lg:stickylg:top-4">
            <h2 className="text-center text-green-700 font-bold text-xl mb-6">
              Today's Performance
            </h2>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={[
                  {
                    name: "Today",
                    deliveries: earning.totalDeliveries,
                    earnings: earning.totalEarnings,
                  },
                ]}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />

                <Bar
                  dataKey="deliveries"
                  fill="#16a34a"
                />

                <Bar
                  dataKey="earnings"
                  fill="#22c55e"
                />
              </BarChart>
            </ResponsiveContainer>

            <h3 className="text-center text-3xl font-bold text-green-700 mt-5">
              ₹{earning.totalEarnings}
            </h3>

            <p className="text-center text-gray-600">
              Earned Today
            </p>

            <button
              onClick={fetchEarning}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl"
            >
              Refresh Earnings
            </button>
          </div>

          {/* RIGHT SIDE */}
          <div>
            <h2 className="text-2xl font-bold mb-6">
              Delivery Assignments
            </h2>

            {assignments
              .filter((a) => a?._id)
              .map((a) => (
                <div
                  key={a._id}
                  className="bg-white border rounded-2xl shadow-md p-4 mb-4"
                >
                  <h3 className="text-base font-bold mb-1">
                    Order Id #
                    {a.orderId._id.toString().slice(-6)}
                  </h3>

                  <p className="text-sm text-gray-600 mb-3">
                    {a.orderId.address.fulladdress},
                    {" "}
                    {a.orderId.address.city},
                    {" "}
                    {a.orderId.address.state},
                    {" "}
                    {a.orderId.address.postalCode}
                  </p>

                  <div className="space-y-1 mb-4 text-sm">
                    <p>
                      <span className="font-semibold">
                        Customer:
                      </span>{" "}
                      {a.orderId.address.fullName}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Payment:
                      </span>{" "}
                      {a.orderId.paymentMethod}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Total:
                      </span>{" "}
                      ₹{a.orderId.totalamount}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        handleAccept(a._id)
                      }
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() =>
                        handleReject(a._id)
                      }
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
          </div>

        </div>
      )}
    </div>
  </div>
);
  }

  export default Deliveryboydashboard;
