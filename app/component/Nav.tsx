"use client";

import {
  LogOut,
  Package,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

interface IUser {
  _id?: string;
  name: string;
  email: string;
  role: "user" | "deliveryboy" | "admin";
  image?: string;
  mobile?: string;
}

export default function Nav({ user }: { user: IUser }) {
  const [showSearch, setShowSearch] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const {cartdata}=useSelector((state:RootState)=>state.cart)


  const profileRef = useRef<HTMLDivElement>(null);

  // ✅ Close profile on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setOpenProfile(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full bg-green-600 px-4 py-3 shadow-md relative">
      {/* Navbar */}
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-3">
  
              {user.role === "admin" && (
                <button
                  onClick={() => setOpenSidebar(true)}
                  className="md:hidden text-white text-2xl"
                >
                  ☰
                </button>
              )}

              <h1 className="text-white font-bold text-xl">QuickBasket</h1>
            </div>


        {user.role=="user" &&
        <div className="hidden md:flex w-full max-w-md mx-6">
          <div className="w-full flex items-center bg-white rounded-full px-4 py-2">
            <Search className="text-gray-400 mr-2" size={18} />
            <input
              type="text"
              placeholder="Search groceries..."
              className="w-full outline-none text-sm"
            />
          </div>
        </div> 
        }

        {/* Right Side */}
        <div
          ref={profileRef}
          className="flex items-center gap-4 relative"
        >
          {user.role=="user" &&
          <button
            onClick={() => setShowSearch((prev) => !prev)}
            className="md:hidden text-white"
          >
            <Search size={22} />
          </button> 
          }

          {user.role=="user" &&
          <div className="relative bg-white p-2 rounded-full">
            <ShoppingCart 
            onClick={() => window.location.href = "/frontend/user/cart"}
            size={18} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
              {cartdata?.length || 0}
            </span>
          </div>}


              {user.role === "admin" && (
          <div className="hidden md:flex items-center gap-3">

            <Link
              href="/frontend/admin/add-grocery"
              className="bg-white text-green-700 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm hover:bg-gray-200 transition"
            >
              ➕ Add Grocery
            </Link>

            <Link
              href="/frontend/admin/view-grocery"
              className="bg-white text-green-700 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm hover:bg-gray-200 transition"
            >
              👁 View Grocery
            </Link>

            <Link
              href="/frontend/admin/manage-orders"
              className="bg-white text-green-700 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm hover:bg-gray-200 transition"
            >
              📦 Manage Orders
            </Link>

          </div>
        )}

          {/* Profile */}
          <div
            onClick={() => setOpenProfile((prev) => !prev)}
            className="w-8 h-8 bg-orange-500 text-white flex items-center justify-center rounded-full font-bold cursor-pointer"
          >
            {user?.name?.charAt(0)}
          </div>

          {/* Profile Dropdown */}
          <AnimatePresence>
            {openProfile && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-12 w-52 bg-white rounded-lg shadow-lg p-3 z-50"
              >
                {/* User Info */}
                <div className="flex items-center gap-2 border-b pb-2 mb-2">
                  <User size={18} className="text-gray-600" />
                  <div>
                    <p className="font-semibold text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>

                {user.role=="user" &&
                <button className="w-full flex items-center gap-2 text-sm py-2 hover:bg-gray-100 rounded px-2">
                  <Package size={16} />
                  My Orders
                </button> }

                {/* Logout */}
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-2 text-sm py-2 text-red-500 hover:bg-gray-100 rounded px-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 🔍 Mobile Search (ABSOLUTE - no layout shift) */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="md:hidden absolute top-[50px] left-0 w-full  px-4 py-3 z-40"
          >
            <div className="flex items-center bg-white rounded-full border border-gray-300 shadow-2xl px-4 py-2">
              <Search className="text-gray-400 mr-2" size={18} />

              <input
                type="text"
                placeholder="Search groceries..."
                className="w-full outline-none text-sm"
              />

              {/* ❌ Close */}
              <button onClick={() => setShowSearch(false)}>
                <X className="text-gray-500 ml-2" size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>



      <AnimatePresence>
  {openSidebar && (
    <>
      {/* OVERLAY */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        exit={{ opacity: 0 }}
        onClick={() => setOpenSidebar(false)}
        className="fixed inset-0 bg-black z-40"
      />

      {/* SIDEBAR */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ duration: 0.3 }}
       className="fixed top-0 left-0 w-[80%] max-w-xs h-full z-50 p-4 flex flex-col"
        style={{
          background: "linear-gradient(180deg, #166534, #16a34a)",
        }}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-lg font-bold">
            Admin Panel
          </h2>
          <X
            className="text-white cursor-pointer"
            onClick={() => setOpenSidebar(false)}
          />
        </div>

        {/* PROFILE */}
        <div className="flex items-center gap-3 bg-green-500/30 backdrop-blur-md p-3 rounded-xl mb-6">
          <div className="w-10 h-10 rounded-full bg-purple-400 flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0)}
          </div>

          <div>
            <p className="text-white font-semibold">
              {user.name}
            </p>
            <p className="text-xs text-white/80">
              Admin
            </p>
          </div>
        </div>

        {/* MENU ITEMS */}
      <div className="flex flex-col gap-4 flex-1">
     
          <Link
            href="/frontend/admin/add-grocery"
            onClick={() => setOpenSidebar(false)}
             className="bg-green-500/30 backdrop-blur-md p-3 rounded-xl text-white 
             transition duration-200 
             hover:bg-green-400/50 hover:scale-[1.02] 
             active:scale-95"
          >
            ➕ Add Grocery
          </Link>

          <Link
            href="/frontend/admin/view-grocery"
            onClick={() => setOpenSidebar(false)}
             className="bg-green-500/30 backdrop-blur-md p-3 rounded-xl text-white 
             transition duration-200 
             hover:bg-green-400/50 hover:scale-[1.02] 
             active:scale-95"
          >
            👁 View Grocery
          </Link>

          <Link
            href="/frontend/admin/manage-orders"
            onClick={() => setOpenSidebar(false)}
             className="bg-green-500/30 backdrop-blur-md p-3 rounded-xl text-white 
             transition duration-200 
             hover:bg-green-400/50 hover:scale-[1.02] 
             active:scale-95"
          >
            📦 Manage Orders
          </Link>
        </div>

         <button
            onClick={() => signOut()}
            className="mt-auto flex items-center justify-center gap-2 
                      bg-red-500/20 text-white
                      p-3 rounded-xl 
                      border border-red-400/30
                      transition-all duration-200 
                      hover:bg-red-500/30 hover:text-red-200 hover:scale-[1.02]
                      active:scale-95"
          >
            <LogOut size={18} />
            Logout
          </button>
      </motion.div>
    </>
  )}
</AnimatePresence>
    </div>




  );
}