"use client";

import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter, } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-green-600 text-white mt-16">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-3 gap-10">

                    {/* Brand */}
                    <div>
                        <h2 className="text-4xl font-bold mb-4">
                            Quickbasket
                        </h2>

                        <p className="text-green-100 leading-relaxed">
                            Your one-stop online grocery store delivering
                            freshness to your doorstep. Shop smart, eat
                            fresh, and save more every day!
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-2xl font-semibold mb-5">
                            Quick Links
                        </h3>

                        <div className="flex flex-col gap-3">
                            <Link
                                href="/"
                                className="hover:text-green-200 transition"
                            >
                                Home
                            </Link>

                            <Link
                                href="/frontend/user/cart"
                                className="hover:text-green-200 transition"
                            >
                                Cart
                            </Link>

                            <Link
                                href="/frontend/user/my-order"
                                className="hover:text-green-200 transition"
                            >
                                My Orders
                            </Link>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-2xl font-semibold mb-5">
                            Contact Us
                        </h3>

                        <div className="space-y-4">

                            <div className="flex items-center gap-3">
                                <MapPin size={18} />
                                <span>Patna, India</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Phone size={18} />
                                <span>+91 1234567890</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Mail size={18} />
                                <span>quickbasket29@gmail.com</span>
                            </div>
                            <div className="flex gap-4 pt-2">
                                <FaFacebookF className="cursor-pointer hover:scale-110 transition text-xl" />
                                <FaInstagram className="cursor-pointer hover:scale-110 transition text-xl" />
                                <FaTwitter className="cursor-pointer hover:scale-110 transition text-xl" />
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-green-500">
                <div className="max-w-7xl mx-auto px-6 py-4 text-center text-green-100">
                    © {new Date().getFullYear()} Quickbasket. All rights reserved.
                </div>
            </div>
        </footer>
    );
}   