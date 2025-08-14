"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PharmaNavbar from "@/components/pharmacyNav";
import PharmaFooter from "@/components/pharmacyFooter";
import { useUser } from "@/context/userContext";

export default function OrdersPage() {
    const { user } = useUser();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?._id) return;
        async function fetchOrders() {
            try {
                const res = await fetch(`/api/orders/get?userId=${user._id}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to fetch orders");
                setOrders(data);
                console.log("Fetched orders:", data);
            } catch (err) {
                console.error("Error fetching orders:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchOrders();
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center text-lg text-blue-700">
                Loading your orders...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-blue-50">
            <PharmaNavbar user={user} />

            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="flex gap-4 mb-6">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Your Orders
                    </button>
                </div>

                {orders.length === 0 ? (
                    <p className="text-center text-gray-500">No orders found.</p>
                ) : (
                    orders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-white rounded-lg shadow-sm border mb-6 p-4 flex flex-col"
                        >
                            {/* Order info */}
                            <div className="flex justify-between flex-wrap mb-3">
                                <div>
                                    <p className="text-sm font-bold">
                                        ORDER PLACED:{" "}
                                        <span className="font-normal">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </span>
                                    </p>
                                    <p className="text-sm font-bold">
                                        TOTAL: ₹
                                        <span className="font-normal">{order.totalAmount}</span>
                                    </p>
                                    <p className="text-sm font-bold">
                                        SHIP TO:{" "}
                                        <span className="font-normal text-blue-600">
                                            {order.shippingAddress || "N/A"}
                                        </span>
                                    </p>
                                </div>
                                <div className="text-right text-sm text-blue-600 flex flex-col gap-1">
                                    <span className="font-bold">ORDER PLACED</span>
                                    <Link href="#" className="hover:underline">
                                        View order details
                                    </Link>
                                    <Link href="#" className="hover:underline">
                                        Invoice
                                    </Link>
                                </div>
                            </div>

                            <hr className="my-3" />

                            {/* Horizontal scrolling items */}
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {order.items.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex-shrink-0 w-40 bg-gray-50 border rounded-lg p-3 flex flex-col items-center hover:shadow"
                                    >
                                        <Image
                                            src={item.image || "/medis.jpg"}
                                            alt={item.name}
                                            width={80}
                                            height={80}
                                            className="rounded border"
                                        />
                                        <Link
                                            href="#"
                                            className="text-blue-600 hover:underline text-sm font-medium mt-2 text-center"
                                        >
                                            {item.name}
                                        </Link>
                                        <p className="text-sm text-gray-800 text-center">
                                            ₹{item.price} x {item.quantity}
                                        </p>
                                        <p className="text-xs text-gray-600 text-center">
                                            Status: {order.status || "Placed"}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2 mt-4">
                                <button className="px-3 py-2 border rounded hover:bg-blue-50 flex items-center gap-1">
                                    📦 Track Order
                                </button>
                                <Link
                                    href="/pharmacy/contact"
                                    className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                                >
                                    🛠 Get Medicine Support
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <PharmaFooter />
        </div>
    );
}
