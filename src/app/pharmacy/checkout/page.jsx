"use client";

import React, { useState } from "react";
import Image from "next/image";
import PharmaNavbar from "@/components/pharmacyNav";
import PharmaFooter from "@/components/pharmacyFooter";
import Link from "next/link";
import { useUser } from "@/context/userContext";

export default function CheckoutPage() {
    const [address, setAddress] = useState("123, Sample Street, New Delhi, India");
    const [addresses, setAddresses] = useState([
        "123, Sample Street, New Delhi, India",
        "456, Park Avenue, Mumbai, India",
        "78, MG Road, Bangalore, India",
    ]);
    const [showAddressPanel, setShowAddressPanel] = useState(false);
    const [newAddress, setNewAddress] = useState("");
    const { user } = useUser();
    async function handleProceedToBuy() {
        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user._id, 
                    address: address,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to place order");

            alert("✅ Order placed successfully!");
            window.location.href = "/pharmacy/order";
        } catch (err) {
            console.error(err);
            alert("❌ " + err.message);
        }
    }


    const cartItems = [
        { id: 1, name: "Paracetamol", price: 20, qty: 2, image: "/medis.jpg" },
        { id: 2, name: "Vitamin C", price: 100, qty: 1, image: "/medis.jpg" },
    ];

    const shipping = 40;
    const discount = 15;

    const itemsTotal = cartItems.reduce(
        (total, item) => total + item.price * item.qty,
        0
    );
    const finalTotal = itemsTotal + shipping - discount;

    const handleAddAddress = () => {
        if (newAddress.trim()) {
            setAddresses([...addresses, newAddress.trim()]);
            setNewAddress("");
        }
    };

    return (
        <div className="relative min-h-screen bg-blue-50">
            <PharmaNavbar user={user} />

            {/* Main Page Content (Blur when panel open) */}
            <div
                className={`max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6 transition-all duration-300 ${showAddressPanel ? "blur-sm pointer-events-none" : ""
                    }`}
            >
                {/* Left Section */}
                <div className="flex-1 space-y-6">
                    <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold">CHECKOUT</h1>
                            <p className="text-sm opacity-90">
                                {cartItems.length} items ready for delivery
                            </p>
                        </div>
                        <div className="bg-white text-blue-700 px-4 py-2 rounded-lg font-bold">
                            Subtotal: ₹{itemsTotal.toFixed(2)}
                        </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="bg-white rounded-lg border p-6 shadow-sm">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold text-blue-700">
                                1. Delivery address
                            </h2>
                            <button
                                className="text-blue-600 hover:text-blue-800 text-sm"
                                onClick={() => setShowAddressPanel(true)}
                            >
                                Change
                            </button>
                        </div>
                        <p className="mt-4 text-gray-700">{address}</p>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:w-80">
                    <div className="bg-white rounded-lg border shadow-sm sticky top-24">
                        <div className="p-4 border-b">
                            <h2 className="text-lg font-bold text-blue-700">Order Summary</h2>
                        </div>
                        <div className="p-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex items-center gap-3 mb-4">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={50}
                                        height={50}
                                        className="rounded border"
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm">{item.name}</p>
                                        <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                                    </div>
                                    <p className="text-sm font-medium">
                                        ₹{(item.price * item.qty).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                            <hr className="my-4" />
                            <div className="flex justify-between text-sm mb-2">
                                <span>Items:</span>
                                <span>₹{itemsTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-2">
                                <span>Shipping:</span>
                                <span>₹{shipping}</span>
                            </div>
                            <div className="flex justify-between text-sm text-green-600 mb-2">
                                <span>Discount:</span>
                                <span>- ₹{discount}</span>
                            </div>
                            <hr className="my-4" />
                            <div className="flex justify-between font-bold text-lg text-blue-700 mb-4">
                                <span>Total:</span>
                                <span>₹{finalTotal.toFixed(2)}</span>
                            </div>
                            <button
                                onClick={handleProceedToBuy}
                                className="block w-full bg-blue-600 text-white py-3 rounded-lg font-medium text-center hover:bg-blue-700"
                            >
                                Proceed to Buy
                            </button>


                            <p className="text-xs text-gray-500 text-center mt-2">
                                By continuing, you agree to our Terms & Privacy.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Address Selection Panel with Blurred BG */}
            {showAddressPanel && (
                <div className="fixed inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 animate-slideUp">
                        <h2 className="text-lg font-bold mb-4 text-blue-700">
                            Select Delivery Address
                        </h2>

                        <div className="space-y-3">
                            {addresses.map((addr, idx) => (
                                <div
                                    key={idx}
                                    className={`p-3 border rounded cursor-pointer hover:bg-blue-50 ${addr === address ? "border-blue-600" : ""
                                        }`}
                                    onClick={() => {
                                        setAddress(addr);
                                        setShowAddressPanel(false);
                                    }}
                                >
                                    {addr}
                                </div>
                            ))}
                        </div>

                        <div className="mt-4">
                            <input
                                type="text"
                                placeholder="Add new address"
                                value={newAddress}
                                onChange={(e) => setNewAddress(e.target.value)}
                                className="w-full border rounded p-2 mb-2"
                            />
                            <button
                                onClick={handleAddAddress}
                                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                            >
                                Add Address
                            </button>
                        </div>

                        <button
                            onClick={() => setShowAddressPanel(false)}
                            className="mt-4 w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}


            <PharmaFooter />
        </div>
    );
}
