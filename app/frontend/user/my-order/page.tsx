"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MoveLeft } from "lucide-react";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
  image: string;
};

type Order = {
  id: string;
  date: string;
  isPaid: boolean;
  deliveryStatus: string;
  total: number;
  address: string;
  paymentMethod?: string;
  items: OrderItem[];
};

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/user/my-order");
        setOrders(res.data.order || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto">

      {/* ✅ HEADER */}
      <div className="flex items-center gap-2 p-4 border-b bg-white sticky top-0 z-10">
        <button
          onClick={() => router.push("/")}
          className="text-xl hover:cursor-pointer"
        >
          <MoveLeft />
        </button>
        <h1 className="text-lg font-semibold">My Orders</h1>
      </div>

      <div className="p-4 space-y-6">
        {orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        )}
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-xl border shadow-sm overflow-hidden">

      {/* ✅ GREEN HEADER */}
      <div className="flex justify-between items-start bg-green-50 p-4">
        <div>
          <h2 className="font-semibold text-green-700">
            order #{order.id.slice(-6)}
          </h2>
          <p className="text-xs text-gray-500">{order.date}</p>
        </div>

        <div className="flex gap-2">
          <span className={`px-2 py-1 text-xs rounded-full 
            ${order.isPaid ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
            {order.isPaid ? "Paid" : "Unpaid"}
          </span>

          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-600">
            {order.deliveryStatus}
          </span>
        </div>
      </div>

      {/* ✅ BODY */}
      <div className="p-4 bg-gray-50 space-y-3">

        <p className="text-sm text-gray-700">
          {order.paymentMethod === "cod"
            ? "Cash On Delivery"
            : "Online Payment"}
        </p>

        <p className="text-sm text-gray-600">{order.address}</p>

        {/* TOGGLE */}
        <div
          onClick={() => setOpen(!open)}
          className="flex justify-between items-center text-sm text-green-600 cursor-pointer"
        >
          <p>
            {open ? "Hide Order Items" : `View ${order.items.length} Items`}
          </p>
          <span>{open ? "▲" : "▼"}</span>
        </div>

        {/* ✅ ANIMATION */}
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
              <div className="border-t pt-3 space-y-3">
                {order.items.map((item, i) => (
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
                        {item.quantity} x pack
                      </p>
                    </div>

                    <p className="font-medium">₹{item.price}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FOOTER */}
        <div className="flex justify-between border-t pt-3 text-sm">
          <p>
            Delivery:{" "}
            <span className="text-green-600">
              {order.deliveryStatus}
            </span>
          </p>
          <p className="font-semibold text-green-600">
            Total: ₹{order.total}
          </p>
        </div>
      </div>
    </div>
  );
}