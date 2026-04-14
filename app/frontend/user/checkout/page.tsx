"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Phone, User, Home, LocateFixed, Search, Loader, LoaderCircle } from "lucide-react";
import Link from "next/link";
import MotionWrapper from "../../../component/MotionWrapper";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { number } from "motion";
import dynamic from "next/dynamic";
import { useRef } from "react";
import axios from "axios";
import { useMap } from "react-leaflet";
import { useRouter } from "next/navigation";




const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);






export default function CheckoutPage() {
  const cartdata = useSelector((state: RootState) => state.cart.cartdata);
  const user = useSelector((state: RootState) => state.user.user);
  const markerRef = useRef<any>(null);
  const [payment, setPayment] = useState("cod");
  const [isMounted, setIsMounted] = useState(false);

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    city: "",
    state: "",
    pincode: "",
    fullAddress: "",
  });

  const [position, setposition] = useState<[number, number] | null>(null);

  const [searchquery, setsearchquery] = useState("");
  const [loader2, setloader2] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const router=useRouter();
  useEffect(() => {
    import("leaflet").then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      });
    });
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setMapReady(true);
  }, []);


  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setposition([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          console.error("Error getting location:", err);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }

  }, []);

  // console.log("User's current position:", position);


  // ✅ Sync Redux → State
  useEffect(() => {
    if (user) {
      setAddress((prev) => ({
        ...prev,
        name: user.name || "",
        phone: user.mobile || "",
      }));
    }
  }, [user]);


  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        const latlng = marker.getLatLng();
        setposition([latlng.lat, latlng.lng]);
      }
    },
  };


  useEffect(() => {
    const fetchaddress = async () => {
      if (!position) return;
      try {
        const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${position?.[0]}&lon=${position?.[1]}&format=json`)
        console.log("Reverse Geocoding Result:", res.data);
        setAddress((prev) => ({
          ...prev,
          city: res.data.address.state_district || " ",
          state: res.data.address.state || "",
          pincode: res.data.address.postcode || "",
          fullAddress: res.data.display_name || "",
        }));

      } catch (err) {
        console.error("Error fetching address:", err);
      }
    }
    fetchaddress();
  }, [position]);


  const handlesearch = async () => {
    if (!searchquery) return;

    setloader2(true);

    const { OpenStreetMapProvider } = await import("leaflet-geosearch");

    const provider = new OpenStreetMapProvider();
    const results = await provider.search({ query: searchquery });

    if (results.length > 0) {
      setposition([results[0].y, results[0].x]);
    } else {
      alert("Location not found");
    }

    setloader2(false);
  };


  const ChangeMapView = ({ center }: { center: [number, number] }) => {
    const map = useMap();

    useEffect(() => {
      map.setView(center, 13);
    }, [center]);

    return null;
  };


  // ✅ SAME LOGIC AS CART
  const subtotal = cartdata.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const delivery = subtotal > 500 ? 0 : 50;
  const total = subtotal + delivery;



  const handlecod = async () => {
    try {
      const res = await axios.post("/api/user/order", {
        userId: user?._id,
        item: cartdata.map((item) => ({
          groceryId: item._id,
          name: item.name,
          price: item.price,
          unit: item.unit,
          image: item.image,
          quantity: item.quantity,
        })),
        totalamount: total,
        paymentMethod: "cod",
        address: {
          fullName: address.name,
          city: address.city,
          state: address.state,
          postalCode: address.pincode,
          fulladdress: address.fullAddress,
          mobile: address.phone,
          latitude: position?.[0] || 0,
          longitude: position?.[1] || 0,
        },
      });

      console.log("Order Response:", res.data);

    }catch(err){
      console.error("Error placing order:", err);
    }finally {
      router.push("/frontend/user/order-sucess");
    }
  }


  const handleonline = async () => {
    try {
      const res = await axios.post("/api/user/payment", {
        userId: user?._id,
        item: cartdata.map((item) => ({
          groceryId: item._id,
          name: item.name,
          price: item.price,
          unit: item.unit,
          image: item.image,
          quantity: item.quantity,
        })),
        totalamount: total,
        paymentMethod: "online",
        address: {
          fullName: address.name,
          city: address.city,
          state: address.state,
          postalCode: address.pincode,
          fulladdress: address.fullAddress,
          mobile: address.phone,
          latitude: position?.[0] || 0,
          longitude: position?.[1] || 0,
        },
      });

      console.log("Payment Response:", res.data);

      window.location.href = res.data.url;

    } catch (err) {
      console.error("Error processing payment:", err);
    }
  };



  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* 🔙 Back */}
        <MotionWrapper>
          <Link
            href="/frontend/user/cart"
            className="flex items-center gap-2 text-green-600 mb-6"
          >
            <ArrowLeft size={20} />
            Back to Cart
          </Link>
        </MotionWrapper>

        {/* Title */}
        <MotionWrapper>
          <h1 className="text-3xl font-bold text-green-600 text-center mb-8">
            Checkout
          </h1>
        </MotionWrapper>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT - ADDRESS */}
          <MotionWrapper>
            <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">

              <h2 className="font-semibold text-lg flex items-center gap-2">
                <MapPin className="text-green-600" />
                Delivery Address
              </h2>

              {/* Name */}
              <div className="flex items-center gap-2 border p-3 rounded-lg">
                <User size={18} />
                <input
                  type="text"
                  value={address.name}
                  onChange={(e) =>
                    setAddress({ ...address, name: e.target.value })
                  }
                  className="w-full outline-none"
                  placeholder="Full Name"
                />
              </div>

              {/* Phone */}
              <div className="flex items-center gap-2 border p-3 rounded-lg">
                <Phone size={18} />
                <input
                  type="text"
                  value={address.phone}
                  onChange={(e) =>
                    setAddress({ ...address, phone: e.target.value })
                  }
                  className="w-full outline-none"
                  placeholder="Phone Number"
                />
              </div>

              {/* Full Address */}
              <div className="flex items-center gap-2 border p-3 rounded-lg">
                <Home size={18} />
                <input
                  type="text"
                  value={address.fullAddress}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      fullAddress: e.target.value,
                    })
                  }
                  className="w-full outline-none"
                  placeholder="Full Address"
                />
              </div>

              {/* City / State / Pincode */}
              <div className="grid grid-cols-3 gap-3">
                <input
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                  className="border p-3 rounded-lg"
                  placeholder="City"
                />

                <input
                  value={address.state}
                  onChange={(e) =>
                    setAddress({ ...address, state: e.target.value })
                  }
                  className="border p-3 rounded-lg"
                  placeholder="State"
                />

                <input
                  value={address.pincode}
                  onChange={(e) =>
                    setAddress({ ...address, pincode: e.target.value })
                  }
                  className="border p-3 rounded-lg"
                  placeholder="Pincode"
                />
              </div>

              {/* 🔍 Search */}
              <div className="flex gap-2">
                <input
                  value={searchquery}
                  onChange={(e) => setsearchquery(e.target.value)}
                  placeholder="Search city or area..."
                  className="flex-1 border p-3 rounded-lg"
                />
                <button
                  onClick={handlesearch}
                  className="bg-green-600 text-white px-4 rounded-lg flex items-center justify-center gap-2"
                >
                  {loader2 ? (
                    <>
                      <LoaderCircle className="animate-spin w-4 h-4" />
                      Searching...
                    </>
                  ) : (
                    "Search"
                  )}
                </button>
              </div>

              {/* 🗺 Map */}
              <div className="h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
                {!position || !isMounted || !mapReady ? (
                  <div className="h-64 flex items-center justify-center">
                    Loading map...
                  </div>
                ) : (
                  <div className="h-64 w-full rounded-xl overflow-hidden relative">

                    <MapContainer
                      center={position}
                      zoom={13}
                      scrollWheelZoom={true}
                      className="h-full w-full"
                    >
                      {/* ✅ KEEP CHILDREN SIMPLE (NO EXTRA CONDITION HERE) */}
                      <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />

                      <ChangeMapView center={position} />

                      <Marker
                        draggable
                        eventHandlers={eventHandlers}
                        position={position}
                        ref={markerRef}
                      >
                        <Popup>Drag me to select location 📍</Popup>
                      </Marker>
                    </MapContainer>

                    {/* ✅ BUTTON */}
                    <button
                      onClick={() => {
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(
                            (pos) => {
                              setposition([pos.coords.latitude, pos.coords.longitude]);
                            },
                            (err) => {
                              console.error(err);
                            }
                          );
                        }
                      }}
                      className="absolute bottom-4 right-1 z-1000 bg-blue-400 text-white p-3 rounded-full shadow-lg hover:bg-blue-500"
                    >
                      <LocateFixed size={18} />
                    </button>

                  </div>
                )}
              </div>
            </div>
          </MotionWrapper>

          {/* RIGHT - PAYMENT + SUMMARY */}
          <MotionWrapper>
            <div className="bg-white p-6 rounded-2xl shadow-md space-y-6">

              {/* Payment */}
              <div>
                <h2 className="font-semibold text-lg mb-4">
                  Payment Method
                </h2>

                <div
                  onClick={() => setPayment("online")}
                  className={`p-3 border rounded-lg mb-3 cursor-pointer ${payment === "online"
                    ? "border-green-500 bg-green-50"
                    : ""
                    }`}
                >
                  Pay Online
                </div>

                <div
                  onClick={() => setPayment("cod")}
                  className={`p-3 border rounded-lg cursor-pointer ${payment === "cod"
                    ? "border-green-500 bg-green-50"
                    : ""
                    }`}
                >
                  Cash on Delivery
                </div>
              </div>

              <hr />

              {/* 🧾 Summary */}
              <div className="space-y-3 text-gray-700">

                <div className="flex justify-between">
                  <span>Subtotal ({cartdata.length} items)</span>
                  <span>₹ {subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="text-green-600">
                    {delivery === 0 ? "Free" : `₹ ${delivery}`}
                  </span>
                </div>

                <hr />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-green-600 text-xl">
                    ₹ {total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Button */}

              <button 
              onClick={()=>{
                if(payment==="cod") {
                  handlecod();
                }else {
                  handleonline();
                }
              }}
              
              className="w-full bg-green-600 text-white py-4 rounded-full text-lg font-semibold hover:bg-green-700 transition">
                {payment === "cod" ? "Place Order" : "Pay and Place Order"}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Safe & Secure Payment • Free Delivery above ₹500
              </p>

            </div>
          </MotionWrapper>

        </div>
      </div>
    </div>
  );
}