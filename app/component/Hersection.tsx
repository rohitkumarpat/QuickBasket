"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Truck, Smartphone } from "lucide-react";

export default function HerSection() {
  const slides = [  
    {
      id: 1,
      icon: <Leaf className="w-16 h-16 text-green-400" />,
      title: "Fresh Organic Groceries 🥦",
      subtitle:
        "Farm-fresh fruits, vegetables, and daily essentials delivered to your doorstep.",
      btnText: "Shop Now",
      bg: "https://images.unsplash.com/photo-1542838132-92c53300491e",
    },
    {
      id: 2,
      icon: <Truck className="w-16 h-16 text-yellow-400" />,
      title: "Fast & Reliable Delivery 🚚",
      subtitle:
        "We ensure your groceries reach your doorstep in no time.",
      btnText: "Order Now",
      bg: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da",
    },
    {
      id: 3,
      icon: <Smartphone className="w-16 h-16 text-blue-400" />,
      title: "Shop Anytime, Anywhere 📱",
      subtitle:
        "Easy and seamless online grocery shopping experience.",
      btnText: "Explore",
      bg: "https://images.unsplash.com/photo-1586201375761-83865001e31c",
    },
  ];

  const [current, setCurrent] = useState(0);

  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);
  

  return (
    <div className="relative w-full h-[80vh] ">
      
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[current].id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute w-full h-full"
        >
          {/* Background Image */}
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${slides[current].bg})`,
            }}
          >
            {/* Overlay */}
            <div className="w-full h-full bg-black/50 flex items-center justify-center px-4">
              
              {/* Content */}
              <div className="text-center text-white max-w-2xl">
                
                <div className="flex justify-center mb-4">
                  {slides[current].icon}
                </div>

                <h1 className="text-3xl sm:text-5xl font-bold mb-4">
                  {slides[current].title}
                </h1>

                <p className="text-sm sm:text-lg mb-6">
                  {slides[current].subtitle}
                </p>

                <button className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-full font-semibold">
                  {slides[current].btnText}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 🔘 Dots Navigation */}
      <div className="absolute bottom-5 w-full flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full ${
              current === index ? "bg-green-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}