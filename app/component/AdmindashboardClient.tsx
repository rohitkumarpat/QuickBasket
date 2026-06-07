
"use client";
import React from 'react'


import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  Package,
  Users,
  Truck,
  IndianRupee,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type DashboardData = {
  totalOrders: number;
  totalCustomers: number;
  pendingDeliveries: number;
  totalRevenue: number;
  todayRevenue: number;

  chartData: {
    day: string;
    orders: number;
  }[];
};



export default function AdmindashboardClient() {
  const [loading, setLoading] = useState(true);

  const [data, setData] =
    useState<DashboardData | null>(null);

  const [filter, setFilter] = useState("today");

 useEffect(() => {
  setLoading(true);
  fetchDashboard();
}, [filter]);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(
        `/api/admin/dashboard?filter=${filter}`
      );

      setData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading Dashboard...
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
              <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-700">
          📊 Admin Dashboard
        </h1>

        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value)
          }
          className="border rounded-lg px-4 py-2 bg-white"
        >
          <option value="today">Today</option>
          <option value="week">
            Last 7 Days
          </option>
          <option value="month">
            Last Month
          </option>
        </select>
      </div>
            <motion.div
        initial={{
          opacity: 0,
          y: -30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="
        bg-green-50
        border
        border-green-200
        rounded-2xl
        p-8
        text-center
        mb-8
      "
      >
        <p className="text-gray-500">
          Today's Earnings
        </p>

        <h2 className="text-5xl font-bold text-green-600 mt-2">
          ₹{data.todayRevenue}
        </h2>
      </motion.div>
            <div
        className="
        grid
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-4
        gap-5
        mb-8
      "
      >        <motion.div
          whileHover={{ scale: 1.03 }}
          className="
          bg-white
          rounded-xl
          shadow-sm
          p-5
          flex
          items-center
          gap-4
        "
        >
          <Package
            className="text-green-600"
            size={28}
          />

          <div>
            <p className="text-gray-500">
              Total Orders
            </p>

            <h2 className="text-2xl font-bold">
              {data.totalOrders}
            </h2>
          </div>
        </motion.div>
                <motion.div
          whileHover={{ scale: 1.03 }}
          className="
          bg-white
          rounded-xl
          shadow-sm
          p-5
          flex
          items-center
          gap-4
        "
        >
          <Users
            className="text-green-600"
            size={28}
          />

          <div>
            <p className="text-gray-500">
              Total Customers
            </p>

            <h2 className="text-2xl font-bold">
              {data.totalCustomers}
            </h2>
          </div>
        </motion.div>

                <motion.div
          whileHover={{ scale: 1.03 }}
          className="
          bg-white
          rounded-xl
          shadow-sm
          p-5
          flex
          items-center
          gap-4
        "
        >
          <Truck
            className="text-green-600"
            size={28}
          />

          <div>
            <p className="text-gray-500">
              Pending Deliveries
            </p>

            <h2 className="text-2xl font-bold">
              {data.pendingDeliveries}
            </h2>
          </div>
        </motion.div>

                <motion.div
          whileHover={{ scale: 1.03 }}
          className="
          bg-white
          rounded-xl
          shadow-sm
          p-5
          flex
          items-center
          gap-4
        "
        >
          <IndianRupee
            className="text-green-600"
            size={28}
          />

          <div>
            <p className="text-gray-500">
              Total Revenue
            </p>

            <h2 className="text-2xl font-bold">
              ₹{data.totalRevenue}
            </h2>
          </div>
        </motion.div>
      </div>

            <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="
        bg-white
        rounded-2xl
        shadow-sm
        p-6
      "
      >
        <h2 className="font-bold mb-6">
          📈 Orders Overview
        </h2>

        <ResponsiveContainer
          width="100%"
          height={350}
        >
          <BarChart
            data={data.chartData}
          >
            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis dataKey="day" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="orders"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
            </div>
  );
}

