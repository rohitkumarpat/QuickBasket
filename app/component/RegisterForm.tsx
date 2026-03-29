"use client"

import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

type WelcomeProps = {
  nextstep: (step: number) => void
}

export default function RegisterForm({ nextstep }: WelcomeProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const isValidGmail = /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

  const isDisabled = !name || !email || !password || !isValidGmail || loading;


  const isEmailError = error.toLowerCase().includes("email");
  const isPasswordError = error.toLowerCase().includes("password");

  async function registerhandler() {
    try {
      setLoading(true);
      setError("");

      const res = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });

      router.push("/frontend/login");

    } catch (err: any) {
      console.error(err);

      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong");
      }

    } finally {
      setLoading(false);
      router.push("/frontend/login");  // Registration ke baad login page pe bhej dega
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
      >

        {/* Back */}
        <button 
          onClick={() => nextstep(1)}  
          className="text-green-600 mb-4 text-sm hover:underline"
        >
          ← Back
        </button>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-green-700 text-center">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Join QuickBasket today 🌿
        </p>

        {/* 🔴 ERROR BOX */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-4">

          {/* Name */}
          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-green-400">
            <User className="text-gray-400 mr-2" size={18} />
            <input
              type="text"
              placeholder="Your Name"
              className="w-full bg-transparent outline-none text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className={`flex items-center border rounded-lg px-3 py-2 bg-gray-50 
            ${isEmailError ? "border-red-400" : ""}`}>
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
              Enter a valid Gmail address
            </p>
          )}

          {/* Password */}
          <div className={`flex items-center border rounded-lg px-3 py-2 bg-gray-50 
            ${isPasswordError ? "border-red-400" : ""}`}>
            <Lock className="text-gray-400 mr-2" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent outline-none text-sm"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
            </button>
          </div>

          {/* Button */}
          <button 
            onClick={registerhandler}
            disabled={isDisabled}
            className={`w-full py-2 rounded-lg font-medium transition ${
              isDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <div className="flex-1 h-px bg-gray-200"></div>
            OR
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Google */}
          <button onClick={() => signIn("google",{ callbackUrl: "/" })}
           className="w-full flex items-center justify-center gap-2 border rounded-lg py-2 hover:bg-gray-100">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <span 
              onClick={() => router.push("/frontend/login")}
              className="text-green-600 cursor-pointer"
            >
              Sign in
            </span>
          </p>

        </div>
      </motion.div>
    </div>
  );
}