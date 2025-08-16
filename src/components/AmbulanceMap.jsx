"use client";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useUser } from "@/context/userContext";

// Recenter button inside map
function RecenterButton({ setUserLocation }) {
    const map = useMap();
    const handleClick = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation([latitude, longitude]);
                map.setView([latitude, longitude], 16);
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };
    return (
        <button
            onClick={handleClick}
            className="absolute top-4 right-4 z-[1000] p-3 bg-blue-500 text-white rounded-full shadow-lg text-lg"
        >
            📍 My Location
        </button>
    );
}

export default function AmbulanceMap() {
    const { user, loading } = useUser();
    const router = useRouter();
    const [userLocation, setUserLocation] = useState([22.77196389255201, 86.14730032698566]);
    const [confirmedAmbulance, setConfirmedAmbulance] = useState(null);
    const [ambulancePos, setAmbulancePos] = useState([0, 0]);
    const [route, setRoute] = useState([]);
    const [remainingRoute, setRemainingRoute] = useState([]);
    const [popupData, setPopupData] = useState(null);

    // Do not render page until we have user._id

    const driverNames = [
        "Amit", "Rahul", "Rohit", "Vikas", "Suresh", "Rajesh", "Anil", "Sunil", "Deepak", "Manish",
        "Prakash", "Arjun", "Karan", "Rakesh", "Sanjay", "Mohit", "Vijay", "Ajay", "Ashok", "Naveen",
        "Ravi", "Harsh", "Ankit", "Vinay", "Siddharth", "Abhishek", "Shivam", "Aditya", "Kapil", "Gaurav",
        "Rohan", "Mayank", "Anand", "Pankaj", "Raj", "Dev", "Suraj", "Tejas", "Akash", "Nikhil",
        "Lokesh", "Pradeep", "Ritvik", "Varun", "Kunal", "Jatin", "Vishal", "Sachin", "Shyam", "Tanmay"
    ];


    const getDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const randomPhone = () => {
        const prefixes = ["93", "62", "87"];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const rest = Math.floor(10000000 + Math.random() * 90000000); // 8 random digits
        return prefix + rest.toString();
    };
    const randomAmbNumber = () => "AMB-" + Math.floor(1000 + Math.random() * 9000);

    const ambulances = Array.from({ length: 40 }, () => {
        const minRadius = 0.09;
        const maxRadius = 0.2;
        const radius = minRadius + Math.random() * (maxRadius - minRadius);
        const angle = Math.random() * 2 * Math.PI;
        const lat = userLocation[0] + radius * Math.cos(angle);
        const lng = userLocation[1] + radius * Math.sin(angle);
        const driverName = driverNames[Math.floor(Math.random() * driverNames.length)];
        const driverNumber = randomPhone();
        const ambulanceNumber = randomAmbNumber();
        const distance = getDistance(userLocation[0], userLocation[1], lat, lng);
        const rate = 50;
        const speed = 40;
        const totalAmount = Math.round(distance * rate);
        const timeReq = Math.round((distance / speed) * 60);
        return { pos: [lat, lng], driverName, driverNumber, ambulanceNumber, distance, totalAmount, timeReq };
    });

    const handleSOS = () => {
        const randomAmb = ambulances[Math.floor(Math.random() * ambulances.length)];
        setPopupData(randomAmb);
    };
    const startAmbulanceMovement = (route, startIndex = 0) => {
        let i = startIndex;
        const interval = setInterval(() => {
            if (i < route.length) {
                setAmbulancePos(route[i]);
                setRemainingRoute(route.slice(i));
                localStorage.setItem("ambulanceIndex", i.toString());
                i++;
            } else {
                clearInterval(interval);
                localStorage.removeItem("confirmedAmbulance");
                localStorage.removeItem("ambulanceIndex");
                localStorage.removeItem("route");
                router.push("/user/home");
            }
        }, 100);

        return interval;
    };

    useEffect(() => {
        const savedAmb = JSON.parse(localStorage.getItem("confirmedAmbulance"));
        const savedIndex = parseInt(localStorage.getItem("ambulanceIndex") || "0");
        const savedRoute = JSON.parse(localStorage.getItem("route") || "[]");

        if (savedAmb && savedRoute.length > 0) {
            setConfirmedAmbulance(savedAmb);
            setRoute(savedRoute);
            setRemainingRoute(savedRoute.slice(savedIndex));
            setAmbulancePos(savedRoute[savedIndex] || savedAmb.pos);

            const interval = startAmbulanceMovement(savedRoute, savedIndex);
            return () => clearInterval(interval);
        }
    }, [router]);
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (confirmedAmbulance) {
                e.preventDefault();
                e.returnValue = "Leaving this page will stop live ambulance tracking. Are you sure?";
                return e.returnValue;
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [confirmedAmbulance]);
    const bookAmbulance = async () => {
        if (!popupData) return;
        if (loading) {
            return <div className="flex justify-center items-center h-[700px]">Loading user...</div>;
        }

        if (!user?._id) {
            return <div className="flex justify-center items-center h-[700px]">User not found</div>;
        }

        const selectedAmb = popupData;
        setPopupData(null);
        setConfirmedAmbulance(selectedAmb);
        toast.success("Booking confirmed! Ambulance is on the way 🚑");
        // Save in localStorage
        try {

            const res = await fetch(
                `/api/getRoute?start=${selectedAmb.pos[1]},${selectedAmb.pos[0]}&end=${userLocation[1]},${userLocation[0]}`
            );
            const data = await res.json();

            let routeCoords = [];
            if (data.features && data.features.length > 0) {
                routeCoords = data.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
            } else {
                const steps = 20;
                for (let i = 0; i <= steps; i++) {
                    const t = i / steps;
                    const lat = selectedAmb.pos[0] + (userLocation[0] - selectedAmb.pos[0]) * t + (Math.random() - 0.5) * 0.01;
                    const lng = selectedAmb.pos[1] + (userLocation[1] - selectedAmb.pos[1]) * t + (Math.random() - 0.5) * 0.01;
                    routeCoords.push([lat, lng]);
                }
            }

            const interpolateRoute = (route, steps = 5) => {
                const points = [];
                for (let i = 0; i < route.length - 1; i++) {
                    const [lat1, lng1] = route[i];
                    const [lat2, lng2] = route[i + 1];
                    for (let s = 0; s < steps; s++) {
                        const t = s / steps;
                        points.push([lat1 + (lat2 - lat1) * t, lng1 + (lng2 - lng1) * t]);
                    }
                }
                points.push(route[route.length - 1]);
                return points;
            };

            const fullRoute = interpolateRoute(routeCoords, 5);
            setRoute(fullRoute);
            setRemainingRoute(fullRoute);
            setAmbulancePos(selectedAmb.pos);
            localStorage.setItem("confirmedAmbulance", JSON.stringify(selectedAmb));
            localStorage.setItem("ambulanceIndex", "0");
            localStorage.setItem("route", JSON.stringify(fullRoute));
            startAmbulanceMovement(fullRoute);
            // Send patientId to backend
            await fetch("/api/ambulanceBooking", {
                method: "POST",
                body: JSON.stringify({ ...selectedAmb, patientId: user._id }),
            });

        } catch (err) {
            console.error(err);
        }
    };


    const ambulanceIcon = new L.Icon({
        iconUrl: "/ambulance1.png",
        iconSize: [30, 30],
        iconAnchor: [20, 20],
    });

    const userEmojiIcon = new L.DivIcon({
        html: `<div style="font-size: 60px; line-height: 60px;">🧍</div>`,
        className: "",
        iconSize: [60, 60],
        iconAnchor: [30, 30],
    });

    return (
        <div className="relative">
            <MapContainer center={userLocation} zoom={14} style={{ height: "700px", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={userLocation} icon={userEmojiIcon} />
                {!confirmedAmbulance && ambulances.map((amb, idx) => (
                    <Marker key={idx} position={amb.pos} icon={ambulanceIcon} />
                ))}
                {confirmedAmbulance && <Marker position={ambulancePos} icon={ambulanceIcon} />}
                {confirmedAmbulance && remainingRoute.length > 0 && (
                    <Polyline positions={remainingRoute} color="blue" />
                )}
                <RecenterButton setUserLocation={setUserLocation} />
            </MapContainer>

            {!confirmedAmbulance && (
                <button
                    className="mt-4 p-3 bg-red-500 text-white rounded-full text-lg fixed bottom-4 right-4 z-[1000] shadow-lg"
                    onClick={handleSOS}
                >
                    🚨 Send SOS
                </button>
            )}

            {popupData && (
                <div className="fixed inset-0 flex items-center justify-center z-[2000] bg-black/40">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                        <h2 className="text-xl font-bold mb-2">Ambulance Details</h2>
                        <p><strong>Ambulance:</strong> {popupData.ambulanceNumber}</p>
                        <p><strong>Driver:</strong> {popupData.driverName}</p>
                        <p><strong>Driver Number:</strong> {popupData.driverNumber}</p>
                        <p><strong>Distance:</strong> {popupData.distance.toFixed(2)} km</p>
                        <p><strong>Amount:</strong> ₹{popupData.totalAmount}</p>
                        <p><strong>Estimated Time:</strong> {popupData.timeReq} mins</p>
                        <div className="flex justify-end gap-4 mt-4">
                            <button
                                onClick={() => { setPopupData(null); toast.success("Click SOS to book a new ambulance."); }}
                                className="px-4 py-2 bg-gray-300 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={bookAmbulance}
                                className="px-4 py-2 bg-green-500 text-white rounded"
                            >
                                Book
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
