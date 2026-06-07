"use client";

import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Search,
  Pencil,
  X,
} from "lucide-react";

interface Grocery {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  unit: string;
  description?: string;
}

export default function ViewGroceryPage() {
  const router = useRouter();

  const [groceries, setGroceries] = useState<Grocery[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
const [deleteLoading, setDeleteLoading] = useState(false);

  const [selected, setSelected] =
    useState<Grocery | null>(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    unit: "",
    description: "",
  });

  useEffect(() => {
    fetchGroceries();
  }, []);

  const fetchGroceries = async () => {
    try {
      const res = await axios.get(
        "/api/admin/getgrocery"
      );

      setGroceries(res.data.groceries || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGroceries = useMemo(() => {
    return groceries.filter((item) =>
      `${item.name} ${item.category}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [groceries, search]);

  const openEditModal = (grocery: Grocery) => {
    setSelected(grocery);

    setForm({
      name: grocery.name,
      category: grocery.category,
      price: grocery.price.toString(),
      unit: grocery.unit,
      description:
        grocery.description || "",
    });
  };

  const handleUpdate = async () => {
  if (!selected) return;

  try {
    setEditLoading(true);

    await axios.put(
      `/api/admin/updategrocery/${selected._id}`,
      {
        name: form.name,
        category: form.category,
        price: Number(form.price),
        unit: form.unit,
        description: form.description,
      }
    );

    await fetchGroceries();

    setSelected(null);
  } catch (error) {
    console.log(error);
  } finally {
    setEditLoading(false);
  }
};

 const handleDelete = async () => {
  if (!selected) return;

  const confirmDelete = window.confirm(
    "Delete this grocery?"
  );

  if (!confirmDelete) return;

  try {
    setDeleteLoading(true);

    await axios.delete(
      `/api/admin/deletegrocery/${selected._id}`
    );

    setGroceries((prev) =>
      prev.filter(
        (g) => g._id !== selected._id
      )
    );

    setSelected(null);
  } catch (error) {
    console.log(error);
  } finally {
    setDeleteLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#eef8ef] p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-xl text-green-700 font-medium"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <h1 className="text-4xl font-bold text-green-700">
            📦 Manage Groceries
          </h1>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-10 relative">
          <Search
            className="absolute left-4 top-3 text-gray-400"
            size={20}
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search by name or category..."
            className="
            w-full
            bg-white
            rounded-full
            border
            px-12
            py-3
            shadow-sm
            outline-none
          "
          />
        </div>

        {/* List */}
        {loading ? (
          <div className="text-center">
            Loading...
          </div>
        ) : (
          <div className="space-y-5">
            {filteredGroceries.map(
              (grocery) => (
                <motion.div
                  key={grocery._id}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="
                  bg-white
                  rounded-3xl
                  p-6
                  shadow-sm
                  flex
                  items-center
                  justify-between
                "
                >
                  <div className="flex gap-6 items-center">
                    <div className="relative w-40 h-40 border rounded-2xl overflow-hidden">
                      <Image
                        src={grocery.image}
                        alt={grocery.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold">
                        {grocery.name}
                      </h2>

                      <p className="text-gray-500">
                        {grocery.category}
                      </p>

                      <p className="text-3xl text-green-700 font-bold mt-3">
                        ₹{grocery.price}
                        <span className="text-sm text-gray-500 ml-2">
                          /
                          {
                            grocery.unit
                          }
                        </span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      openEditModal(
                        grocery
                      )
                    }
                    className="
                    bg-green-600
                    hover:bg-green-700
                    text-white
                    px-5
                    py-3
                    rounded-xl
                    flex
                    items-center
                    gap-2
                  "
                  >
                    <Pencil size={18} />
                    Edit
                  </button>
                </motion.div>
              )
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="
            fixed inset-0
            bg-black/40
            flex items-center justify-center
            z-50
          "
          >
            <motion.div
              initial={{
                scale: 0.8,
              }}
              animate={{
                scale: 1,
              }}
              exit={{
                scale: 0.8,
              }}
              className="
              bg-white
              rounded-3xl
              p-6
              w-full
              max-w-md
              relative
            "
            >
              <button
                onClick={() =>
                  setSelected(null)
                }
                className="absolute right-4 top-4"
              >
                <X />
              </button>

              <h2 className="text-3xl font-bold text-green-700 mb-5">
                Edit Grocery
              </h2>

              <div className="relative w-full h-72 border rounded-xl overflow-hidden mb-5">
                <Image
                  src={selected.image}
                  alt={selected.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-4">
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name:
                        e.target.value,
                    })
                  }
                  className="w-full border rounded-lg p-3"
                />

                <select
  value={form.category}
  onChange={(e) =>
    setForm({
      ...form,
      category: e.target.value,
    })
  }
  className="w-full border rounded-lg p-3 bg-white"
>
  <option value="fruits">Fruits</option>
  <option value="vegetables">Vegetables</option>
  <option value="dairy">Dairy</option>
  <option value="bakery">Bakery</option>
  <option value="meat">Meat</option>
  <option value="beverages">Beverages</option>
  <option value="snacks">Snacks</option>
  <option value="household">Household</option>
  <option value="personal care">Personal Care</option>
  <option value="Baby products">Baby Products</option>
  <option value="pet supplies">Pet Supplies</option>
  <option value="drinks">Drinks</option>
  <option value="frozen foods">Frozen Foods</option>
  <option value="canned goods">Canned Goods</option>
  <option value="condiments">Condiments</option>
  <option value="grains">Grains</option>
  <option value="international foods">International Foods</option>
  <option value="organic products">Organic Products</option>
  <option value="health foods">Health Foods</option>
  <option value="cleaning supplies">Cleaning Supplies</option>
  <option value="paper products">Paper Products</option>
  <option value="other">Other</option>
</select>

                <input
                  value={form.price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      price:
                        e.target.value,
                    })
                  }
                  className="w-full border rounded-lg p-3"
                />

                <input
                  value={form.unit}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      unit:
                        e.target.value,
                    })
                  }
                  className="w-full border rounded-lg p-3"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                 
                  onClick={
                    handleUpdate
                  }
                disabled={editLoading || deleteLoading}
                  className="
                  flex-1
                  bg-green-600
                  text-white
                  py-3
                  rounded-xl
                "
                >
                 {editLoading ? "Updating..." : "Edit Grocery"}
                </button>

                <button
                  onClick={
                    handleDelete
                  }
                    disabled={editLoading || deleteLoading}
                  className="
                  flex-1
                  bg-red-600
                  text-white
                  py-3
                  rounded-xl
                "
                >
                {deleteLoading ? "Deleting..." : "Delete Grocery"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}