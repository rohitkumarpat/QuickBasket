"use client";

import MotionWrapper from "@/app/component/MotionWrapper";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OrderSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">

      <MotionWrapper>

        {/* ✅ CENTERED Circle + Tick */}
        <div className="flex items-center justify-center mb-10">
          <motion.svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            initial={{ rotate: -180 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            {/* Circle */}
            <motion.circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#16a34a"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="314"
              strokeDashoffset="314"
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />

            {/* Tick */}
            <motion.path
              d="M40 62 L55 75 L80 45"
              fill="none"
              stroke="#16a34a"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="100"
              strokeDashoffset="100"
              animate={{ strokeDashoffset: 0 }}
              transition={{ delay: 1, duration: 0.5, ease: "easeOut" }}
            />
          </motion.svg>
        </div>

        {/* ✅ Title */}
        <h1 className="text-3xl font-bold text-green-600 mb-3">
          Order Placed Successfully
        </h1>

        {/* ✅ Subtitle */}
        <p className="text-gray-500 max-w-md mb-8">
          Thank you for shopping with us! Your order has been placed and is being
          processed. You can track its progress in your{" "}
          <span className="text-green-600 font-medium">My Orders</span> section.
        </p>

        {/* ✅ Cube Infinite Bounce */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mb-8"
        >
          <Package className="text-green-500 w-12 h-12 mx-auto" />
        </motion.div>

        {/* ✅ Button */}
        <button
          onClick={() => router.push("/frontend/user/order")}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-medium transition duration-200"
        >
          Go to My Orders →
        </button>

      </MotionWrapper>
    </div>
  );
}