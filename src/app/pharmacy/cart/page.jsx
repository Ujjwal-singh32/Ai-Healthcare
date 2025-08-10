"use client";

import React, { useState } from "react";
import { Plus, Minus, ShoppingCart} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import PharmaFooter from "@/components/pharmacyFooter";
import PharmaNavbar from "@/components/pharmacyNav";

export default function PharmacyCartPage() {
    // Dummy data for now
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "Paracetamol",
            description: "Pain reliever & fever reducer",
            price: 20,
            quantity: 2,
            image: "/medis.jpg",
        },
        {
            id: 2,
            name: "Vitamin C",
            description: "Boost immunity",
            price: 100,
            quantity: 1,
            image: "/medis.jpg",
        },
    ]);

    const shipping = 40;
    const discount = 15;

    const increaseQuantity = (id) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const decreaseQuantity = (id) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };

    const removeFromCart = (id) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <div className="min-h-screen bg-blue-50">
            <PharmaNavbar />

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main Cart Section */}
                    <div className="flex-1 space-y-6">
                        {/* Cart Header */}
                        <div className="bg-white rounded-lg border p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-blue-800 mb-2">
                                        Medicine Cart
                                    </h1>
                                    <div className="flex items-center text-gray-600">
                                        <ShoppingCart className="w-5 h-5 mr-2" />
                                        <span className="text-lg">{cartItems.length} items</span>
                                    </div>
                                </div>
                                <div className="hidden sm:block bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="text-sm text-blue-600 font-medium">
                                        Subtotal ({cartItems.length} items)
                                    </div>
                                    <div className="text-2xl font-bold text-blue-700">
                                        ₹{getTotalPrice().toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Items List */}
                        <div className="bg-white rounded-lg border p-6 shadow-sm">
                            <h2 className="text-xl font-medium mb-6 text-blue-700">
                                Items in your cart
                            </h2>

                            {cartItems.length === 0 ? (
                                <p className="text-gray-500">Your cart is empty.</p>
                            ) : (
                                <div className="space-y-6">
                                    {cartItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex flex-col sm:flex-row gap-4 pb-6 border-b last:border-none"
                                        >
                                            {/* Image */}
                                            <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden relative">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    width={128}
                                                    height={128}
                                                    className="object-contain w-full h-full"
                                                />
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1">
                                                <h3 className="font-medium text-lg mb-2 text-blue-800">
                                                    {item.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                                                <div className="flex items-center gap-2 mb-4">
                                                    <span className="text-2xl font-bold text-blue-700">
                                                        ₹{(item.price * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center border rounded">
                                                        <button
                                                            className="p-2 hover:bg-gray-100"
                                                            onClick={() => decreaseQuantity(item.id)}
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="px-4 py-2 border-x">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            className="p-2 hover:bg-gray-100"
                                                            onClick={() => increaseQuantity(item.id)}
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <button
                                                        className="text-blue-600 hover:text-blue-800"
                                                        onClick={() => removeFromCart(item.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                    <button className="text-blue-600 hover:text-blue-800">
                                                        Save for later
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-80">
                        <div className="bg-white rounded-lg border sticky top-24 shadow-sm">
                            <div className="p-6 border-b">
                                <h2 className="text-xl font-medium text-blue-700">Order Summary</h2>
                            </div>

                            <div className="p-6">
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between">
                                        <span>Items ({cartItems.length}):</span>
                                        <span>₹{getTotalPrice().toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping & handling:</span>
                                        <span>₹{shipping}</span>
                                    </div>
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount:</span>
                                        <span>- ₹{discount}</span>
                                    </div>
                                    <hr />
                                    <div className="flex justify-between text-xl font-bold">
                                        <span>Order total:</span>
                                        <span>₹{(getTotalPrice() + shipping - discount).toFixed(2)}</span>
                                    </div>
                                </div>
                                <Link
                                    href="/pharmacy/checkout"
                                    className="block w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium text-center hover:bg-blue-700 mb-4"
                                >
                                    Proceed to Checkout
                                </Link>



                                <p className="text-xs text-gray-600 text-center">
                                    By placing your order, you agree to our terms and conditions
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PharmaFooter />
        </div>
    );
}
