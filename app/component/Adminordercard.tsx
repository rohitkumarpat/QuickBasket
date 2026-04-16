import React, { useState } from "react";
import { IOrder } from "../frontend/admin/manage-order/page";
import { motion, AnimatePresence } from "framer-motion";

function Adminordercard({ order }: { order: IOrder }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.08)] p-5 flex justify-between items-start mb-5 hover:shadow-lg transition mt-3">
      
      {/* LEFT SIDE */}
      <div className="space-y-2 w-full">
        
        {/* Order ID */}
        <h2 className="text-green-700 font-semibold text-lg">
          Order #{order.id.slice(-6)}
        </h2>

        {/* Payment Badge */}
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${
            order.ispaid
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {order.ispaid ? "Paid" : "Unpaid"}
        </span>

        {/* Date */}
        <p className="text-sm text-gray-500">
          {order.createdAt
            ? new Date(order.createdAt).toLocaleString()
            : "No date"}
        </p>

        {/* User Info */}
        <div className="text-sm text-gray-700 space-y-1">
          <p>👤 {order.address.fullName}</p>
          <p>📞 {order.address.mobile}</p>
          <p>
            📍 {order.address.fulladdress}, {order.address.city},{" "}
            {order.address.state} - {order.address.postalCode}
          </p>
        </div>

        {/* TOGGLE BUTTON */}
        <div
          onClick={() => setOpen(!open)}
         className="flex justify-between items-center text-sm text-green-600 cursor-pointer border-b border-gray-300 pb-2"
        >
          <p>
            {open
              ? "Hide Order Items"
              : `View ${order.item.length} Items`}
          </p>
          <span>{open ? "▲" : "▼"}</span>
        </div>

        {/* ANIMATION */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className=" pt-3 space-y-3">
                {order.item.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded object-cover"
                    />

                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} x {item.unit}
                      </p>
                    </div>

                    <p className="text-sm font-medium">
                      ₹ {item.price}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Payment Method */}
        <p className="text-sm text-gray-600">
          💳{" "}
          {order.paymentMethod === "cod"
            ? "Cash on Delivery"
            : "Online Payment"}
        </p>

        {/* Total */}
         <div className="flex justify-between  pt-3 text-sm">
          <p>
            Delivery:{" "}
            <span className="text-green-600">
              {order.status}
            </span>
          </p>
          <p className="font-semibold text-green-600">
            Total: ₹{order.totalamount}
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-col items-end gap-2 ml-4">
        
        {/* Status Badge */}
        <span
          className={`text-xs px-3 py-1 rounded-full ${
            order.status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : order.status === "out-for-delivery"
              ? "bg-blue-100 text-blue-700"
              : order.status === "delivered"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {order.status}
        </span>

        {/* Dropdown */}
        <select
          defaultValue={order.status}
          className="border rounded-md px-2 py-1 text-sm"
        >
          <option value="pending">PENDING</option>
          <option value="out-for-delivery">OUT FOR DELIVERY</option>
          <option value="delivered">DELIVERED</option>
          <option value="cancelled">CANCELLED</option>
        </select>
      </div>
    </div>
  );
}

export default Adminordercard;