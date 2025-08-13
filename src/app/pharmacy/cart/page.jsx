"use client";

import React, { useEffect, useState } from "react";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import PharmaFooter from "@/components/pharmacyFooter";
import PharmaNavbar from "@/components/pharmacyNav";
import { useUser } from "@/context/userContext";

export default function PharmacyCartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);

  const shipping = 40;
  const discount = 15;
  const {user}=useUser();
  


  // Fetch cart from backend
  
  useEffect(() => {
  if (!user || !user._id) return; // wait until user is available

  fetch(`/api/cart?userId=${user._id}`)
    .then(res => res.json())
    .then(data => {
      setCartItems(data.items || []);
      setTotalPrice(data.totalPrice || 0);
      setTotalQuantity(data.totalQuantity || 0);
    })
    .catch(err => console.error("Error fetching cart:", err));
}, [user]);

    
    const updateQuantity = async (id, type) => {
        await fetch(`/api/cart/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: user._id,
                medicineId: id,
                quantity: type === "increase" ? 1 : -1
            })
        });
        
        // Refresh cart after update
        fetch(`/api/cart?userId=${user._id}`)
        .then(res => res.json())
        .then(data => {
            setCartItems(data.items || []);
            setTotalPrice(data.totalPrice || 0);
            setTotalQuantity(data.totalQuantity || 0);
        });
    };
    
    const removeFromCart = async (id) => {
        await fetch(`/api/cart/remove`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user._id, medicineId: id })
        });
        
        // Refresh cart
        fetch(`/api/cart?userId=${user._id}`)
        .then(res => res.json())
      .then(data => {
          setCartItems(data.items || []);
          setTotalPrice(data.totalPrice || 0);
          setTotalQuantity(data.totalQuantity || 0);
        });
    };

    if(!user) return null;
  return (
    <div className="min-h-screen bg-blue-50">
      {/* Pass totalQuantity to navbar */}
      <PharmaNavbar user={user} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Section */}
          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-lg border p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-blue-800 mb-2">
                    Medicine Cart
                  </h1>
                  <div className="flex items-center text-gray-600">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    <span className="text-lg">{totalQuantity} items</span>
                  </div>
                </div>
                <div className="hidden sm:block bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-sm text-blue-600 font-medium">
                    Subtotal ({totalQuantity} items)
                  </div>
                  <div className="text-2xl font-bold text-blue-700">
                    ₹{totalPrice.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-lg border p-6 shadow-sm">
              {cartItems.length === 0 ? (
                <p className="text-gray-500">Your cart is empty.</p>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} className="flex flex-col mt-5 sm:flex-row gap-4 pb-6 border-b last:border-none">
                    <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden relative">
                      <Image src={item.image[0] || "/fallback.jpg"} alt={item.name} width={128} height={128} className="object-contain" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-lg mb-2 text-blue-800">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <div className="text-2xl font-bold text-blue-700 mb-4">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center border rounded">
                          <button className="p-2 hover:bg-gray-100" onClick={() => updateQuantity(item.id, "decrease")}>
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 border-x">{item.quantity}</span>
                          <button className="p-2 hover:bg-gray-100" onClick={() => updateQuantity(item.id, "increase")}>
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800" onClick={() => removeFromCart(item.id)}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))
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
                    <span>Items ({totalQuantity}):</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
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
                    <span>₹{(totalPrice + shipping - discount).toFixed(2)}</span>
                  </div>
                </div>
                <Link href="/pharmacy/checkout" className="block w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium text-center hover:bg-blue-700 mb-4">
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PharmaFooter />
    </div>
  );
}
