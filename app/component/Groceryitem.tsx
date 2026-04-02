"use client";

import { ShoppingCart } from "lucide-react";

interface Iitems {
  name: string;
  price: number;
  image: string;
  unit: string;
  category?: string;
}

function Groceryitem({ item }: { item: Iitems }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

      <div className="h-40 flex items-center justify-center bg-gray-100">
        <img
          src={item.image}
          alt={item.name}
          className="h-28 object-contain"
        />
      </div>

      <div className="p-4">
        <p className="text-xs text-gray-500">{item.category}</p>

        <h3 className="font-semibold text-gray-800">{item.name}</h3>

        <div className="flex justify-between items-center mt-2">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
            {item.unit}
          </span>

          <span className="text-green-600 font-semibold">
            ₹{item.price}
          </span>
        </div>

        <button className="w-full mt-4 bg-green-600 text-white py-2 rounded-full flex items-center justify-center gap-2 hover:bg-green-700">
          <ShoppingCart size={18} />
          Add to Cart
        </button>
      </div>

    </div>
  );
}

export default Groceryitem;