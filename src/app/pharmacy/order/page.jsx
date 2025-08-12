"use client";
import Image from "next/image";
import Link from "next/link";
import PharmaNavbar from "@/components/pharmacyNav";
import PharmaFooter from "@/components/pharmacyFooter";
import { useUser } from "@/context/userContext";

export default function OrdersPage() {
    const { user } = useUser();
    const orders = [
        {
            id: "24a5fc",
            date: "7/9/2025",
            total: 8.8,
            shipTo: "Aditya kumar singh",
            items: [
                {
                    name: "JUGULAR Boys Cotton Hooded Neck Jacket",
                    price: 8.2,
                    qty: 1,
                    image: "/medis.jpg",
                    status: "placed",
                },
            ],
        },
        {
            id: "24a234",
            date: "7/9/2025",
            total: 12.13,
            shipTo: "Aditya kumar singh",
            items: [
                {
                    name: "FARM BIONICS Vitamin D3 400 IU Spray Supplement, 30ml - Pack of 1 | Vitamin D3 Booster Oral Spray",
                    price: 11.53,
                    qty: 1,
                    image: "/medis.jpg",
                    status: "placed",
                },
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-blue-50">
            <PharmaNavbar user={user} />

            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="flex gap-4 mb-6">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Your Orders
                    </button>
                </div>

                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="bg-white rounded-lg shadow-sm border mb-6 p-4"
                    >
                        <div className="flex justify-between items-start flex-wrap">
                            <div>
                                <p className="text-sm font-bold">
                                    ORDER PLACED:{" "}
                                    <span className="font-normal">{order.date}</span>
                                </p>
                                <p className="text-sm font-bold">
                                    TOTAL: ₹<span className="font-normal">{order.total}</span>
                                </p>
                                <p className="text-sm font-bold">
                                    SHIP TO:{" "}
                                    <span className="font-normal text-blue-600">
                                        {order.shipTo}
                                    </span>
                                </p>
                            </div>
                            <div className="text-right text-sm text-blue-600 flex flex-col gap-1">
                                <span className="font-bold">ORDER #{order.id}</span>
                                <Link href="#" className="hover:underline">
                                    View order details
                                </Link>
                                <Link href="#" className="hover:underline">
                                    Invoice
                                </Link>
                            </div>
                        </div>

                        <hr className="my-3" />

                        {order.items.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col md:flex-row items-start md:items-center gap-4"
                            >
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={80}
                                    height={80}
                                    className="rounded border"
                                />
                                <div className="flex-1">
                                    <Link
                                        href="#"
                                        className="text-blue-600 hover:underline text-sm font-medium"
                                    >
                                        {item.name}
                                    </Link>
                                    <p className="text-sm">
                                        ₹{item.price} x {item.qty}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Status: {item.status}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
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
                        ))}
                    </div>
                ))}
            </div>

            <PharmaFooter />
        </div>
    );
}
