"use client";

import { useState } from "react";
import { User, Bike, Shield } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Editrolemobile() {
  const [role, setRole] = useState("");
  const [mobile, setMobile] = useState("");
  const router=useRouter();

  const isDisabled = !role || mobile.length !== 10;

  async function handleroleandmobile() {
    try {
      const res = await axios.post("/api/user/editroleandmobile", {
        role,
        mobile,
      });
     
    } catch (err) {
      console.error("Error updating profile:", err);
    }finally {
      router.push("/");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-4">
      
      <h1 className="text-3xl font-bold text-green-700 mb-10">
        Select Your Role
      </h1>

      <div className="flex gap-6 mb-8 flex-wrap justify-center">
        
        <div
          onClick={() => setRole("admin")}
          className={`cursor-pointer w-40 h-32 rounded-xl flex flex-col items-center justify-center border shadow-sm 
          transition-all duration-300 hover:-translate-y-2 hover:shadow-lg active:scale-95
          ${role === "admin" ? "bg-green-100 border-green-500" : "bg-white"}`}
        >
          <Shield size={24} />
          <p className="mt-2">Admin</p>
        </div>

        <div
          onClick={() => setRole("user")}
          className={`cursor-pointer w-40 h-32 rounded-xl flex flex-col items-center justify-center border shadow-sm 
          transition-all duration-300 hover:-translate-y-2 hover:shadow-lg active:scale-95
          ${role === "user" ? "bg-green-100 border-green-500" : "bg-white"}`}
        >
          <User size={24} />
          <p className="mt-2">User</p>
        </div>

        <div
          onClick={() => setRole("deliveryboy")}
          className={`cursor-pointer w-40 h-32 rounded-xl flex flex-col items-center justify-center border shadow-sm 
          transition-all duration-300 hover:-translate-y-2 hover:shadow-lg active:scale-95
          ${role === "deliveryboy" ? "bg-green-100 border-green-500" : "bg-white"}`}
        >
          <Bike size={24} />
          <p className="mt-2">Delivery Boy</p>
        </div>
      </div>

      <div className="w-full max-w-xs mb-6">
        <p className="text-center text-gray-600 mb-2">
          Enter Your Mobile No.
        </p>

        <input  type="text"
           placeholder="eg. 0000000000"
            value={mobile}
            onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ""); 
            setMobile(value);
          }}
          maxLength={10}
          className="w-full border rounded-lg px-4 py-2 text-center outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

            <button 
            onClick={handleroleandmobile}
        disabled={isDisabled}
        className={`px-6 py-2 rounded-full flex items-center gap-2 transition ${
          isDisabled
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-green-500 text-white hover:bg-green-600 active:scale-95"
        }`}
      >
        Go to Home →
      </button>
    </div>
  );
}