"use client";

import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4 text-center">
      
      {/* Icon */}
      <ShieldAlert className="w-14 h-14 text-red-500 mb-4" />

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold mb-2">
        Unauthorized Access
      </h1>

      {/* Message */}
      <p className="text-gray-400 max-w-md">
        You do not have permission to access this page.
      </p>

    </div>
  );
}