"use client";

import { useState, useEffect } from "react";
import { Upload, PlusCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import axios from "axios";

const categories = [
  "fruits",
  "vegetables",
  "dairy",
  "bakery",
  "meat",
  "beverages",
  "snacks",
  "household",
  "personal care",
  "Baby products",
  "pet supplies",
  "drinks",
  "frozen foods",
  "canned goods",
  "condiments",
  "grains",
  "international foods",
  "organic products",
  "health foods",
  "cleaning supplies",
  "paper products",
  "other",
];

export default function AddGroceryPage() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    unit: "",
    price: "",
    image: null as File | null,
  });

  const [prev, setPrev] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Cleanup preview URL (important)
  useEffect(() => {
    return () => {
      if (prev) {
        URL.revokeObjectURL(prev);
      }
    };
  }, [prev]);

  useEffect(() => {
  const savedForm = localStorage.getItem("groceryForm");
  const savedPreview = localStorage.getItem("groceryPreview");

  if (savedForm) {
    setForm(JSON.parse(savedForm));
  }

  if (savedPreview) {
    setPrev(savedPreview);
  }
}, []);

  // Handle input change
  const handleChange = (e: any) => {
  const updatedForm = { ...form, [e.target.name]: e.target.value };
  setForm(updatedForm);

  localStorage.setItem("groceryForm", JSON.stringify(updatedForm)); 

};


  // Handle image change
  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0] || null;

    setForm({
      ...form,
      image: file,
    });

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPrev(imageUrl);
      localStorage.setItem("groceryPreview", imageUrl);
    }
  };

 
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("category", form.category);
      formData.append("unit", form.unit);
      formData.append("price", form.price);

      if (form.image) {
        formData.append("file", form.image);
      }

      const grocerydata=await axios.post("/api/admin/addgrocery", formData);
      console.log(grocerydata);

      setMessage("✅ Grocery added successfully");
      localStorage.removeItem("groceryForm");
       localStorage.removeItem("groceryPreview");

      // Reset form
      setForm({
        name: "",
        category: "",
        unit: "",
        price: "",
        image: null,
      });

      setPrev(null);

    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to add grocery");
    } finally {
      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">

      {/* BACK BUTTON */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow text-sm hover:bg-gray-100"
      >
        <ArrowLeft size={16} />
        Back to home
      </Link>

      {/* CARD */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">

        {/* HEADER */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <PlusCircle className="text-green-600" size={28} />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">
            Add Your Grocery
          </h2>
          <p className="text-sm text-gray-500">
            Fill out the details below to add a new grocery item.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* NAME */}
          <div>
            <label className="text-sm font-medium">
              Grocery Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="eg: Milk, Apple..."
              required
              className="w-full mt-1 px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* CATEGORY + UNIT */}
          <div className="flex gap-3">

            <div className="w-1/2">
              <label className="text-sm font-medium">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full mt-1 px-3 py-2 border rounded-lg"
              >
                <option value="">Select</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-1/2">
              <label className="text-sm font-medium">
                Unit <span className="text-red-500">*</span>
              </label>
              <select
                name="unit"
                value={form.unit}
                onChange={handleChange}
                required
                className="w-full mt-1 px-3 py-2 border rounded-lg"
              >
                <option value="">Select</option>
                <option value="Kg">Kg</option>
                <option value="Liter">Liter</option>
                <option value="Piece">Piece</option>
                <option value="Pack">Pack</option>
              </select>
            </div>

          </div>

          {/* PRICE */}
          <div>
            <label className="text-sm font-medium">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="eg: 120"
              required
              className="w-full mt-1 px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* IMAGE */}
        <div>

       <label className="text-sm font-medium">Upload Image</label>

          {/* FLEX CONTAINER */}
          <div className="mt-2 flex flex-col md:flex-row md:items-start md:gap-4 ">

            {/* LEFT SIDE (UPLOAD) */}
            <div>
              <label className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 w-fit">
                <Upload size={16} />
                Upload image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>

              {form.image && (
                <p className="text-xs mt-1 text-gray-500">
                  Selected: {form.image.name}
                </p>
              )}
            </div>

            {/* RIGHT SIDE (PREVIEW) */}
            {prev && (
              <div className="mt-3 md:mt-0 mx-3">
                <p className="text-xs text-gray-500 mb-1">Preview:</p>
                <img
                  src={prev}
                  alt="preview"
                  className="w-64 h-32 object-cover rounded-lg border"
                />
              </div>
            )}

          </div>
        </div>

          {/* MESSAGE */}
          {message && (
            <p className="text-sm text-center">{message}</p>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold 
                       hover:opacity-90 active:scale-95 transition disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Grocery"}
          </button>

        </form>
      </div>
    </div>
  );
}