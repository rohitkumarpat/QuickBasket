"use client";

import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import {
  setcartdata,
  increaseQuantity,
  decreaseQuantity,
} from "../redux/cartslice";
import { motion } from "framer-motion";

interface Iitems {
  _id: string;
  name: string;
  price: number;
  image: string;
  unit: string;
  category?: string;
}

function Groceryitem({ item }: { item: Iitems }) {
  const dispatch = useDispatch<AppDispatch>();

  const cartitem = useSelector(
    (state: RootState) => state.cart.cartdata
  );

  const cartdata = cartitem.find(
    (cart) => cart._id === item._id
  );

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

      {/* Image */}
      <div className="h-40 flex items-center justify-center bg-gray-100">
        <img
          src={item.image}
          alt={item.name}
          className="h-28 object-contain"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-gray-500">{item.category}</p>

        <h3 className="font-semibold text-gray-800">
          {item.name}
        </h3>

        <div className="flex justify-between items-center mt-2">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
            {item.unit}
          </span>

          <span className="text-green-600 font-semibold">
            ₹{item.price}
          </span>
        </div>

        {/* BUTTON / COUNTER */}
        {!cartdata ? (
          <button
            onClick={() =>
              dispatch(setcartdata({ ...item, quantity: 1 }))
            }
            className="w-full mt-4 bg-green-600 text-white py-2 rounded-full flex items-center justify-center gap-2 hover:bg-green-700"
          >
            <ShoppingCart size={18} />
            Add to Cart
          </button>
        ) : (
        <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
  className="flex items-center justify-between mt-4  bg-green-200 rounded-full px-2 py-1.5 w-full gap-2"
>
        <button
          onClick={() => dispatch(decreaseQuantity(item._id))}
          className="bg-white hover:bg-green-200 text-green-700 rounded-full p-1.5 transition"
        >
          <Minus size={16} />
        </button>

      <motion.span
        key={cartdata.quantity} 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="px-2 text-sm font-semibold text-green-800"
      >
        {cartdata.quantity}
      </motion.span>
        <button
          onClick={() => dispatch(increaseQuantity(item._id))}
          className="bg-white hover:bg-green-200 text-green-700 rounded-full p-1.5 transition"
        >
          <Plus size={16} />
        </button>
      </motion.div>
              )}
            </div>
          </div>
        );
      }

      export default Groceryitem;