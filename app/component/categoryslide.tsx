"use client";

import { useEffect, useRef, useState } from "react";
import {
  Apple,
  Milk,
  Wheat,
  Cookie,
  Flame,
  Coffee,
  Heart,
  Home,
  Box,
  Baby,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";
import { motion } from "framer-motion";

function Categoryslide() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState<"right" | "left">("right");

  const categories = [
  { id: 1, label: "Fruits & Vegetables", icon: Apple, bg: "bg-green-100" },
  { id: 2, label: "Dairy & Eggs", icon: Milk, bg: "bg-emerald-100" },
  { id: 3, label: "Rice & Grains", icon: Wheat, bg: "bg-lime-100" },
  { id: 4, label: "Snacks", icon: Cookie, bg: "bg-yellow-100" },
  { id: 5, label: "Spices", icon: Flame, bg: "bg-orange-100" },
  { id: 6, label: "Beverages", icon: Coffee, bg: "bg-teal-100" },
  { id: 7, label: "Personal Care", icon: Heart, bg: "bg-pink-100" },
  { id: 8, label: "Household", icon: Home, bg: "bg-blue-100" },
  { id: 9, label: "Instant Food", icon: Box, bg: "bg-indigo-100" },
  { id: 10, label: "Baby Care", icon: Baby, bg: "bg-rose-100" },
];

  // 👉 manual scroll
  const scroll = (dir: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    container.scrollBy({
      left: dir === "left" ? -200 : 200,
      behavior: "smooth",
    });
  };

  // 👉 AUTO SCROLL (YOUR LOGIC)
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      if (!container) return;

      if (direction === "right") {
        container.scrollBy({ left: 200, behavior: "smooth" });

        // if reached end → change direction
        if (
          container.scrollLeft + container.clientWidth >=
          container.scrollWidth - 10
        ) {
          setDirection("left");
        }
      } else {
        container.scrollBy({ left: -200, behavior: "smooth" });

        // if reached start → change direction
        if (container.scrollLeft <= 0) {
          setDirection("right");
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [direction]);

  return (
    <motion.div
      className="w-full bg-white py-8"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="w-[92%] md:w-[80%] mx-auto relative">

        {/* TITLE */}
              <motion.h2
  initial={{ opacity: 0, y: 80 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700 mb-6 text-center flex items-center justify-center gap-4"
>
  <ShoppingCart className="text-green-600" size={42} />
  Shop by Category
</motion.h2>

        {/* LEFT */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md"
        >
          <ChevronLeft />
        </button>

        {/* RIGHT */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md"
        >
          <ChevronRight />
        </button>

        {/* SLIDER */}
        <div
          ref={scrollRef}
          style={{
            overflowX: "scroll",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="flex gap-4 sm:gap-6 px-4 sm:px-8 md:px-10 pb-4 scroll-smooth"
        >
          {categories.map((cat, index) => {
            const Icon = cat.icon;

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className={`min-w-[120px] sm:min-w-[140px] md:min-w-[160px] p-4 sm:p-5 rounded-xl ${cat.bg} shadow-md hover:shadow-xl flex flex-col items-center justify-center cursor-pointer`}
              >
                <Icon size={24} className="mb-2 text-green-900" />
                <p className="text-xs sm:text-sm text-center font-semibold text-green-900">
                  {cat.label}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* REMOVE SCROLLBAR */}
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

      </div>
    </motion.div>
  );
}

export default Categoryslide;