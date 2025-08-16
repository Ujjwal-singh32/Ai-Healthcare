"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/context/userContext";
import axios from "axios";
import { toast } from "react-toastify";
import UserNavbar from "@/components/UserNavbar";
import UserFooter from "@/components/UserFooter";

export default function MyBookings() {
  const { user, loading } = useUser();
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    if (!user?._id) return;

    const fetchBookings = async () => {
      try {
        const res = await axios.post("/api/getAmbulanceBooking", { patientId: user._id });
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load bookings");
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, [user]);

  if (loading || loadingBookings) {
    return (
      <>
        <UserNavbar />
        <div className="flex justify-center items-center h-[700px] text-lg font-medium">
          Loading your bookings...
        </div>
        <UserFooter />
      </>
    );
  }

  if (!bookings.length) {
    return (
      <>
        <UserNavbar />
        <div className="flex justify-center items-center h-[700px] text-lg font-medium">
          No bookings found.
        </div>
        <UserFooter />
      </>
    );
  }

  return (
    <>
      <UserNavbar />
      <div className="bg-purple-50 dark:bg-purple-950 min-h-screen mt-15">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-purple-800 dark:text-purple-200">
            My Ambulance Bookings
          </h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((b, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-purple-900 p-6 rounded-2xl shadow-lg border border-purple-200 dark:border-purple-700 hover:scale-105 transform transition-all duration-300"
              >
                <h2 className="text-2xl font-semibold mb-3 text-purple-700 dark:text-purple-200">
                  {b.ambulanceNumber}
                </h2>
                <p><strong>Driver:</strong> {b.driverName}</p>
                <p><strong>Driver Number:</strong> {b.driverNumber}</p>
                <p><strong>Distance:</strong> {b.distance.toFixed(2)} km</p>
                <p><strong>Amount:</strong> ₹{b.totalAmount}</p>
                <p><strong>Estimated Time:</strong> {b.timeReq} mins</p>
                <p className="mt-2">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-bold ${
                      b.status === "completed"
                        ? "text-green-500"
                        : b.status === "on the way"
                        ? "text-blue-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {b.status}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <UserFooter />
    </>
  );
}
