"use client"

import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Google from "next-auth/providers/google";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const isValidGmail = /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
  const isDisabled = !email || !password || !isValidGmail || loading;

  async function backfunction() {
    router.push("/frontend/register?step=2");
  }


  async function loginHandler() {
    try {
      setLoading(true);
      setError("");

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password ❌");
      } else {
        router.push("/");
      }

    } catch (err) {
      setError("Something went wrong ❌");
    } finally {
      setLoading(false);
      router.push("/");  // Login ke baad home page pe bhej dega
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8"
      >

        {/* Back */}
        <button 
          onClick={backfunction}  
          className="flex items-center text-green-600 mb-4 text-sm"
        >
          ← Back
        </button>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-green-700 text-center">
          Login to QuickBasket
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Welcome back 👋
        </p>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-4">

          {/* Email */}
          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
            <Mail className="text-gray-400 mr-2" size={18} />
            <input
              type="email"
              placeholder="Your Gmail"
              className="w-full bg-transparent outline-none text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {!isValidGmail && email && (
            <p className="text-sm text-red-500">
              Please enter a valid Gmail address 
            </p>
          )}

          {/* Password */}
          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
            <Lock className="text-gray-400 mr-2" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent outline-none text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {/* Login Button */}
          <button 
            onClick={loginHandler}   // ✅ IMPORTANT
            disabled={isDisabled}
            className={`w-full py-2 rounded-lg font-medium transition ${
              isDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <div className="flex-1 h-px bg-gray-200"></div>
            OR
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

            {/* Google */}
            <button   onClick={() => signIn("google",{callbackUrl: "/"})}
            className="w-full flex items-center justify-center gap-2 border rounded-lg py-2 hover:bg-gray-100">
                <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="google"
                className="w-5 h-5"
                />
                Continue with Google
            </button>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <span  
              onClick={() => router.push("/frontend/register?step=2")}
              className="text-green-600 cursor-pointer"
            >
              Sign up
            </span>
          </p>

        </div>
      </motion.div>
    </div>
  );
}