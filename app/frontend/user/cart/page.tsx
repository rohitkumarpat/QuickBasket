"use client";

import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import Link from "next/link";
import CartItem from "../../../component/CartItem";
import MotionWrapper from "../../../component/MotionWrapper";
import { ShoppingCart, ArrowLeft, CreditCard } from "lucide-react";


export default function CartPage() {
  const cartdata = useSelector((state: RootState) => state.cart.cartdata);
 

  const totalAmount = cartdata.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const cartEmpty = cartdata.length === 0;

  // ✅ EMPTY CART
  if (cartEmpty) {
    return (
      <MotionWrapper>
        <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-50 py-20 flex flex-col items-center justify-center">
          <div className="text-center max-w-md px-4">
            <div className="w-24 h-24 bg-green-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-md">
              <ShoppingCart size={48} className="text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Your cart is empty
            </h1>

            <p className="text-gray-600 mb-8 text-lg">
              Looks like you haven't added any items yet.
            </p>

            <Link
              href="/"
              className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition flex items-center gap-2 shadow-lg justify-center"
            >
              <ArrowLeft size={20} />
              Continue Shopping
            </Link>
          </div>
        </div>
      </MotionWrapper>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto ">

        {/* 🔙 Back Button */}
        <MotionWrapper>
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-700 hover:text-green-600 font-medium transition"
            >
              <ArrowLeft size={20} />
              Back to Home
            </Link>
          </div>
        </MotionWrapper>

        {/* Header */}
            <MotionWrapper>
        <div className="text-center mb-12 flex items-center justify-center gap-3 ">
          
          <ShoppingCart size={40} className="text-green-600 " />

          <h1 className="text-4xl font-bold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent pb-2 ">
            Your Shopping Cart
          </h1> 

        </div>

      </MotionWrapper>

        {/* Cart Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">

          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartdata.map((item, index) => (
              <MotionWrapper key={item._id} >
                <CartItem item={item} />
              </MotionWrapper>
            ))}
          </div>

          {/* Summary */}
          <MotionWrapper>
  <div className="lg:col-span-1 bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 sticky top-8 h-fit border border-gray-100">
    
    <h2 className="text-2xl font-bold text-gray-800 mb-6">
      Order Summary
    </h2>

    {/* 🧾 BILL DETAILS */}
    <div className="space-y-4 mb-6 text-gray-700">

      {/* Subtotal */}
      <div className="flex justify-between">
        <span>Subtotal ({cartdata.length} items)</span>
        <span className="font-medium">₹{totalAmount.toFixed(2)}</span>
      </div>

      {/* Delivery */}
      <div className="flex justify-between">
        <span>Delivery Fee</span>
        <span className="font-medium">
          {totalAmount > 500 ? "Free" : "₹50.00"}
        </span>
      </div>

      {/* Divider */}
      <hr className="border-gray-200" />

      {/* Final Total */}
      <div className="flex justify-between text-lg font-bold text-gray-900">
        <span>Total Amount</span>
        <span className="text-green-600 text-2xl">
          ₹
          {(totalAmount + (totalAmount > 500 ? 0 : 50)).toFixed(2)}
        </span>
      </div>

    </div>

    {/* Checkout Button */}
    <Link
      href="/frontend/user/checkout"
      className="w-full bg-linear-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
    >
      <CreditCard size={24} />
      Proceed to Checkout
    </Link>

    <p className="text-xs text-gray-500 text-center mt-4">
      Safe & Secure Payment • Free Delivery above ₹500
    </p>
  </div>
</MotionWrapper>
        </div>
      </div>
    </div>
  );
}