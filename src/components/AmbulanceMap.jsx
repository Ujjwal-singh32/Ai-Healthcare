"use client";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useUser } from "@/context/userContext";
import { useAmbulance } from "@/context/AmbulanceContext";

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
      className="absolute top-4 right-4 z-[1000] p-3 bg-blue-500 text-white rounded-full shadow-lg text-lg cursor-pointer"
    >
      Locate Me
    </button>
  );
}

export default function AmbulanceMap() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [userLocation, setUserLocation] = useState([
    22.77196389255201, 86.14730032698566,
  ]);
  const [popupData, setPopupData] = useState(null);

  // Get ambulance context
  const {
    confirmedAmbulance,
    ambulancePos,
    route,
    remainingRoute,
    startAmbulanceMovement,
    setConfirmedAmbulance,
    setRoute,
    setRemainingRoute,
    setAmbulancePos,
  } = useAmbulance();

  const driverNames = [
    "Amit",
    "Rahul",
    "Rohit",
    "Vikas",
    "Suresh",
    "Rajesh",
    "Anil",
    "Sunil",
    "Deepak",
    "Manish",
    "Prakash",
    "Arjun",
    "Karan",
    "Rakesh",
    "Sanjay",
    "Mohit",
    "Vijay",
    "Ajay",
    "Ashok",
    "Naveen",
    "Ravi",
    "Harsh",
    "Ankit",
    "Vinay",
    "Siddharth",
    "Abhishek",
    "Shivam",
    "Aditya",
    "Kapil",
    "Gaurav",
    "Rohan",
    "Mayank",
    "Anand",
    "Pankaj",
    "Raj",
    "Dev",
    "Suraj",
    "Tejas",
    "Akash",
    "Nikhil",
    "Lokesh",
    "Pradeep",
    "Ritvik",
    "Varun",
    "Kunal",
    "Jatin",
    "Vishal",
    "Sachin",
    "Shyam",
    "Tanmay",
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
    const rest = Math.floor(10000000 + Math.random() * 90000000);
    return prefix + rest.toString();
  };
  const randomAmbNumber = () =>
    "AMB-" + Math.floor(1000 + Math.random() * 9000);

  const ambulances = Array.from({ length: 40 }, () => {
    const minRadius = 0.09;
    const maxRadius = 0.2;
    const radius = minRadius + Math.random() * (maxRadius - minRadius);
    const angle = Math.random() * 2 * Math.PI;
    const lat = userLocation[0] + radius * Math.cos(angle);
    const lng = userLocation[1] + radius * Math.sin(angle);
    const driverName =
      driverNames[Math.floor(Math.random() * driverNames.length)];
    const driverNumber = randomPhone();
    const ambulanceNumber = randomAmbNumber();
    const distance = getDistance(userLocation[0], userLocation[1], lat, lng);
    const rate = 50;
    const speed = 40;
    const totalAmount = Math.round(distance * rate);
    const timeReq = Math.round((distance / speed) * 60);
    return {
      pos: [lat, lng],
      driverName,
      driverNumber,
      ambulanceNumber,
      distance,
      totalAmount,
      timeReq,
    };
  });

  const handleSOS = () => {
    const randomAmb = ambulances[Math.floor(Math.random() * ambulances.length)];
    setPopupData(randomAmb);
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

  const bookThisAmbulance = async () => {
    if (!popupData || !user?._id) return;

    const selectedAmb = popupData;
    setPopupData(null);
    setConfirmedAmbulance(selectedAmb);
    toast.success("Booking confirmed! Ambulance is on the way 🚑");

    try {
      const res = await fetch(
        `/api/getRoute?start=${selectedAmb.pos[1]},${selectedAmb.pos[0]}&end=${userLocation[1]},${userLocation[0]}`
      );
      const data = await res.json();

      let routeCoords = [];
      if (data.features && data.features.length > 0) {
        routeCoords = data.features[0].geometry.coordinates.map(
          ([lng, lat]) => [lat, lng]
        );
      } else {
        const steps = 20;
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const lat =
            selectedAmb.pos[0] +
            (userLocation[0] - selectedAmb.pos[0]) * t +
            (Math.random() - 0.5) * 0.01;
          const lng =
            selectedAmb.pos[1] +
            (userLocation[1] - selectedAmb.pos[1]) * t +
            (Math.random() - 0.5) * 0.01;
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

      await fetch("/api/ambulanceBooking", {
        method: "POST",
        body: JSON.stringify({ ...selectedAmb, patientId: user._id }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#e0e7ef] via-[#f3f4f6] to-[#e0e7ef] dark:from-[#232946] dark:via-[#334155] dark:to-[#232946] text-[#1e1b4b] dark:text-[#f3e8ff] pt-7 pb-8 flex flex-col">
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg width="100%" height="100%" className="opacity-10 dark:opacity-5">
          <defs>
            <radialGradient id="bg-grad-map" cx="50%" cy="50%" r="80%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#bg-grad-map)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl w-full mx-auto flex-1 flex flex-col items-center justify-start pt-2 md:pt-4">
        <div className="w-full rounded-3xl shadow-2xl border border-[#2563eb] dark:border-[#60a5fa] bg-white/80 dark:bg-[#232946]/80 backdrop-blur-xl p-1 md:p-3 animate-fade-in">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-[#2563eb] dark:text-[#60a5fa] drop-shadow-lg text-center">
            Live Location Tracking
          </h2>
          <div className="w-full h-[420px] md:h-[600px] rounded-2xl overflow-hidden border-2 border-[#2563eb]/30 dark:border-[#60a5fa]/30 shadow-xl relative">
            <MapContainer
              center={userLocation}
              zoom={14}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              <Marker position={userLocation} icon={userEmojiIcon} />
              {!confirmedAmbulance &&
                ambulances.map((amb, idx) => (
                  <Marker key={idx} position={amb.pos} icon={ambulanceIcon} />
                ))}
              {confirmedAmbulance && (
                <Marker position={ambulancePos} icon={ambulanceIcon} />
              )}
              {confirmedAmbulance && remainingRoute.length > 0 && (
                <Polyline positions={remainingRoute} color="#2563eb" />
              )}
              <RecenterButton setUserLocation={setUserLocation} />
            </MapContainer>
          </div>
        </div>

        {/* SOS Button */}
        {!confirmedAmbulance && (
          <button
            className="fixed z-100 bottom-5 right-5 px-6 py-2 rounded-xl shadow-2xl bg-[#2563eb] text-white text-base md:text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-300 pointer-events-auto select-none animate-fade-in transition-all duration-200 hover:bg-[#1d4ed8] cursor-pointer"
            style={{ boxShadow: "0 4px 16px 0 rgba(37,99,235,0.18)" }}
            onClick={handleSOS}
            aria-label="Book"
          >
            Book
          </button>
        )}

        {/* Ambulance Details Modal */}
        {popupData && (
          <div className="fixed inset-0 flex items-center justify-center z-[2000] bg-black/40 animate-fade-in">
            <div className="bg-white/90 dark:bg-[#232946]/95 backdrop-blur-2xl rounded-3xl shadow-2xl border-2 border-[#2563eb] dark:border-[#60a5fa] w-[90vw] max-w-md p-8 relative">
              <button
                onClick={() => setPopupData(null)}
                className="absolute top-3 right-3 text-[#2563eb] dark:text-[#60a5fa] hover:text-[#1d4ed8] dark:hover:text-[#3b82f6] text-2xl font-bold focus:outline-none"
                aria-label="Close"
              >
                ×
              </button>
              <h2 className="text-2xl font-bold mb-4 text-[#2563eb] dark:text-[#60a5fa] text-center">
                Ambulance Details
              </h2>
              <div className="space-y-2 text-[#1e1b4b] dark:text-[#f3e8ff]">
                <div className="flex justify-between items-center border-b border-[#2563eb]/30 dark:border-[#60a5fa]/30 pb-2 mb-2">
                  <span className="font-semibold">Ambulance:</span>
                  <span className="font-mono text-lg">
                    {popupData.ambulanceNumber}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Driver:</span>
                  <span>{popupData.driverName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Driver Number:</span>
                  <span className="font-mono">{popupData.driverNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Distance:</span>
                  <span>{popupData.distance.toFixed(2)} km</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Estimated Fare:</span>
                  <span className="text-[#2563eb] dark:text-[#60a5fa] font-bold">
                    ₹{popupData.totalAmount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">ETA:</span>
                  <span>{popupData.timeReq} min</span>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setPopupData(null)}
                  className="px-5 py-2 rounded-lg bg-gray-200 dark:bg-[#334155] text-[#2563eb] dark:text-[#60a5fa] font-semibold hover:bg-gray-300 dark:hover:bg-[#232946] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={bookThisAmbulance}
                  className="px-5 py-2 rounded-lg bg-[#2563eb] dark:bg-[#60a5fa] text-white font-bold shadow hover:bg-[#1d4ed8] dark:hover:bg-[#3b82f6] transition-all"
                >
                  Book
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
