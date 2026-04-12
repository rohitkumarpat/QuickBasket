"use client";

import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { increaseQuantity, decreaseQuantity, removeItem } from "../redux/cartslice";
import { motion } from "framer-motion";

interface ICartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  unit: string;
  quantity: number;
}

function CartItem({ item }: { item: ICartItem }) {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 flex gap-4 items-center border hover:shadow-xl transition-all duration-300"
    >
      {/* Image */}
      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="h-16 w-16 object-contain"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-800 text-lg truncate">{item.name}</h3>
        <p className="text-xs text-gray-500 capitalize">{item.unit}</p>
        <p className="text-green-600 font-bold text-lg">₹{item.price}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={() => dispatch(decreaseQuantity(item._id))}
          className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition text-gray-600"
        >
          <Minus size={16} />
        </button>
        <span className="font-bold text-lg min-w-[2rem] text-center">{item.quantity}</span>
        <button
          onClick={() => dispatch(increaseQuantity(item._id))}
          className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition text-white"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Subtotal */}
      <div className="text-right flex flex-col items-end flex-shrink-0 gap-1">
        <span className="font-bold text-lg text-green-600">
          ₹{(item.price * item.quantity).toFixed(2)}
        </span>
        <p className="text-xs text-gray-500">per {item.unit}</p>
      </div>

      {/* Remove */}
      <button
        onClick={() => dispatch(removeItem(item._id))}
        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition ml-2 flex-shrink-0"
        title="Remove item"
      >
        <Trash2 size={20} />
      </button>
    </motion.div>
  );
}

export default CartItem;

