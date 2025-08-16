"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const AmbulanceContext = createContext();

export function useAmbulance() {
    return useContext(AmbulanceContext);
}

export function AmbulanceProvider({ children }) {
    const [confirmedAmbulance, setConfirmedAmbulance] = useState(null);
    const [ambulancePos, setAmbulancePos] = useState([0, 0]);
    const [route, setRoute] = useState([]);
    const [remainingRoute, setRemainingRoute] = useState([]);
    const intervalRef = useRef(null);
    const router = useRouter();

    // Restore from localStorage on first load
    useEffect(() => {
        const savedAmb = JSON.parse(localStorage.getItem("confirmedAmbulance"));
        const savedIndex = parseInt(localStorage.getItem("ambulanceIndex") || "0");
        const savedRoute = JSON.parse(localStorage.getItem("route") || "[]");

        // Only restore if there is still a remaining route
        if (savedAmb && savedRoute.length > savedIndex) {
            setConfirmedAmbulance(savedAmb);
            setRoute(savedRoute);
            setRemainingRoute(savedRoute.slice(savedIndex));
            setAmbulancePos(savedRoute[savedIndex] || savedAmb.pos);
            startAmbulanceMovement(savedRoute, savedIndex);
        } else {
            // Route is done, clean everything
            localStorage.removeItem("confirmedAmbulance");
            localStorage.removeItem("ambulanceIndex");
            localStorage.removeItem("route");
            setConfirmedAmbulance(null);
            setRoute([]);
            setRemainingRoute([]);
            setAmbulancePos([0, 0]);
        }
    }, []);


    // Function to start ambulance movement
    const startAmbulanceMovement = (routeCoords, startIndex = 0) => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        let i = startIndex;

        intervalRef.current = setInterval(() => {
            if (i < routeCoords.length) {
                setAmbulancePos(routeCoords[i]);
                setRemainingRoute(routeCoords.slice(i));
                localStorage.setItem("ambulanceIndex", i.toString());
                i++;
            } else {
                clearInterval(intervalRef.current);
                localStorage.removeItem("confirmedAmbulance");
                localStorage.removeItem("ambulanceIndex");
                localStorage.removeItem("route");
                setConfirmedAmbulance(null);
                setRoute([]);
                setRemainingRoute([]);
                toast.info("Ambulance has reached the destination ✅");
            }
        }, 100);
    };

    // Function to book ambulance
    const bookAmbulance = async (selectedAmb, userLocation, patientId) => {
        if (!selectedAmb || !patientId) return;

        setConfirmedAmbulance(selectedAmb);
        setAmbulancePos(selectedAmb.pos);

        // Save in localStorage
        localStorage.setItem("confirmedAmbulance", JSON.stringify(selectedAmb));
        localStorage.setItem("ambulanceIndex", "0");

        try {
            // Fetch route from backend
            const res = await fetch(
                `/api/getRoute?start=${selectedAmb.pos[1]},${selectedAmb.pos[0]}&end=${userLocation[1]},${userLocation[0]}`
            );
            const data = await res.json();

            let routeCoords = [];
            if (data.features && data.features.length > 0) {
                routeCoords = data.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
            } else {
                // fallback: linear interpolation
                const steps = 20;
                for (let i = 0; i <= steps; i++) {
                    const t = i / steps;
                    const lat = selectedAmb.pos[0] + (userLocation[0] - selectedAmb.pos[0]) * t;
                    const lng = selectedAmb.pos[1] + (userLocation[1] - selectedAmb.pos[1]) * t;
                    routeCoords.push([lat, lng]);
                }
            }

            // Interpolate for smoother movement
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
            localStorage.setItem("route", JSON.stringify(fullRoute));

            startAmbulanceMovement(fullRoute);

            // Send patient booking to backend
            await fetch("/api/ambulanceBooking", {
                method: "POST",
                body: JSON.stringify({ ...selectedAmb, patientId }),
            });

            toast.success("Booking confirmed! Ambulance is on the way 🚑");
        } catch (err) {
            console.error(err);
        }
    };

    // Cleanup interval on unmount
    useEffect(() => {
        return () => clearInterval(intervalRef.current);
    }, []);

    return (
        <AmbulanceContext.Provider
            value={{
                confirmedAmbulance,
                ambulancePos,
                route,
                remainingRoute,
                startAmbulanceMovement,
                bookAmbulance,
                setConfirmedAmbulance,
                setAmbulancePos,
                setRoute,
                setRemainingRoute,
            }}
        >
            {children}
        </AmbulanceContext.Provider>
    );
}
