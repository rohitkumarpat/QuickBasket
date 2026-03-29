"use client";

import { LogOut, Package, Search, ShoppingCart, User } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";

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

  return (
    <div className="w-full bg-green-600 px-4 py-3 shadow-md">
      
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        
        {/* Logo */}
        <h1 className="text-white font-bold text-xl">
          QuickBasket
        </h1>

        {/* Search */}
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

        {/* Right Side */}
        <div className="flex items-center gap-4 relative">
          
          {/* Mobile Search */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="md:hidden text-white"
          >
            <Search size={22} />
          </button>

          {/* Cart */}
          <div className="relative bg-white p-2 rounded-full">
            <ShoppingCart size={18} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
              1
            </span>
          </div>

          {/* Profile */}
          <div
            onClick={() => setOpenProfile(!openProfile)}
            className="w-8 h-8 bg-orange-500 text-white flex items-center justify-center rounded-full font-bold cursor-pointer"
          >
            {user?.name?.charAt(0)}
          </div>

        <AnimatePresence>
        {openProfile && (
            <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-12 w-52 bg-white rounded-lg shadow-lg p-3 z-50"
            >
            
            {/* 👤 User Info */}
            <div className="flex items-center gap-2 border-b pb-2 mb-2">
                <User size={18} className="text-gray-600" />
                <div>
                <p className="font-semibold text-sm">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">
                    {user.role}
                </p>
                </div>
            </div>

            {/* 📦 My Orders */}
            <button className="w-full flex items-center gap-2 text-sm py-2 hover:bg-gray-100 rounded px-2">
                <Package size={16} />
                My Orders
            </button>

            {/* 🚪 Logout */}
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

      {/* Mobile Search */}
      {showSearch && (
        <div className="mt-3 md:hidden">
          <div className="flex items-center bg-white rounded-full px-4 py-2">
            <Search className="text-gray-400 mr-2" size={18} />
            <input
              type="text"
              placeholder="Search groceries..."
              className="w-full outline-none text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}