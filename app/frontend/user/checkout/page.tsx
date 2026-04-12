"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Phone, User, Home } from "lucide-react";
import Link from "next/link";
import MotionWrapper from "../../../component/MotionWrapper";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { number } from "motion";
import dynamic from "next/dynamic";

const Mapview = dynamic(
  () => import("../../../component/Mapview"),
  { ssr: false }
);

export default function CheckoutPage() {
  const cartdata = useSelector((state: RootState) => state.cart.cartdata);
  const user = useSelector((state: RootState) => state.user.user);

  const [payment, setPayment] = useState("cod");

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    city: "",
    state: "",
    pincode: "",
    fullAddress: "",
  });
   
  const [position,setposition] = useState<[number,number] | null >(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
            setposition([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          console.error("Error getting location:", err);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }

    }, []);

    // console.log("User's current position:", position);


  // ✅ Sync Redux → State
  useEffect(() => {
    if (user) {
      setAddress((prev) => ({
        ...prev,
        name: user.name || "",
        phone: user.mobile || "",
      }));
    }
  }, [user]);



  // ✅ SAME LOGIC AS CART
  const subtotal = cartdata.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const delivery = subtotal > 500 ? 0 : 50;
  const total = subtotal + delivery;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* 🔙 Back */}
        <MotionWrapper>
          <Link
            href="/frontend/user/cart"
            className="flex items-center gap-2 text-green-600 mb-6"
          >
            <ArrowLeft size={20} />
            Back to Cart
          </Link>
        </MotionWrapper>

        {/* Title */}
        <MotionWrapper>
          <h1 className="text-3xl font-bold text-green-600 text-center mb-8">
            Checkout
          </h1>
        </MotionWrapper>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT - ADDRESS */}
          <MotionWrapper>
            <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">

              <h2 className="font-semibold text-lg flex items-center gap-2">
                <MapPin className="text-green-600" />
                Delivery Address
              </h2>

              {/* Name */}
              <div className="flex items-center gap-2 border p-3 rounded-lg">
                <User size={18} />
                <input
                  type="text"
                  value={address.name}
                  onChange={(e) =>
                    setAddress({ ...address, name: e.target.value })
                  }
                  className="w-full outline-none"
                  placeholder="Full Name"
                />
              </div>

              {/* Phone */}
              <div className="flex items-center gap-2 border p-3 rounded-lg">
                <Phone size={18} />
                <input
                  type="text"
                  value={address.phone}
                  onChange={(e) =>
                    setAddress({ ...address, phone: e.target.value })
                  }
                  className="w-full outline-none"
                  placeholder="Phone Number"
                />
              </div>

              {/* Full Address */}
              <div className="flex items-center gap-2 border p-3 rounded-lg">
                <Home size={18} />
                <input
                  type="text"
                  value={address.fullAddress}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      fullAddress: e.target.value,
                    })
                  }
                  className="w-full outline-none"
                  placeholder="Full Address"
                />
              </div>

              {/* City / State / Pincode */}
              <div className="grid grid-cols-3 gap-3">
                <input
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                  className="border p-3 rounded-lg"
                  placeholder="City"
                />

                <input
                  value={address.state}
                  onChange={(e) =>
                    setAddress({ ...address, state: e.target.value })
                  }
                  className="border p-3 rounded-lg"
                  placeholder="State"
                />

                <input
                  value={address.pincode}
                  onChange={(e) =>
                    setAddress({ ...address, pincode: e.target.value })
                  }
                  className="border p-3 rounded-lg"
                  placeholder="Pincode"
                />
              </div>

              {/* 🔍 Search */}
              <div className="flex gap-2">
                <input
                  placeholder="Search city or area..."
                  className="flex-1 border p-3 rounded-lg"
                />
                <button className="bg-green-600 text-white px-4 rounded-lg">
                  Search
                </button>
              </div>

              {/* 🗺 Map */}
              <div className="h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
                <Mapview position={position} />
              </div>

            </div>
          </MotionWrapper>

          {/* RIGHT - PAYMENT + SUMMARY */}
          <MotionWrapper>
            <div className="bg-white p-6 rounded-2xl shadow-md space-y-6">

              {/* Payment */}
              <div>
                <h2 className="font-semibold text-lg mb-4">
                  Payment Method
                </h2>

                <div
                  onClick={() => setPayment("online")}
                  className={`p-3 border rounded-lg mb-3 cursor-pointer ${
                    payment === "online"
                      ? "border-green-500 bg-green-50"
                      : ""
                  }`}
                >
                  Pay Online
                </div>

                <div
                  onClick={() => setPayment("cod")}
                  className={`p-3 border rounded-lg cursor-pointer ${
                    payment === "cod"
                      ? "border-green-500 bg-green-50"
                      : ""
                  }`}
                >
                  Cash on Delivery
                </div>
              </div>

              <hr />

              {/* 🧾 Summary */}
              <div className="space-y-3 text-gray-700">

                <div className="flex justify-between">
                  <span>Subtotal ({cartdata.length} items)</span>
                  <span>₹ {subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="text-green-600">
                    {delivery === 0 ? "Free" : `₹ ${delivery}`}
                  </span>
                </div>

                <hr />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-green-600 text-xl">
                    ₹ {total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Button */}
              <button className="w-full bg-green-600 text-white py-4 rounded-full text-lg font-semibold hover:bg-green-700 transition">
                Place Order
              </button>

              <p className="text-xs text-gray-500 text-center">
                Safe & Secure Payment • Free Delivery above ₹500
              </p>

            </div>
          </MotionWrapper>

        </div>
      </div>
    </div>
  );
}