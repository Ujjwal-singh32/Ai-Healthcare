"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const PathlabContext = createContext();

const PathlabProvider = ({ children }) => {
  const [pathlab, setPathlab] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPathlab = async () => {
      const pttoken = localStorage.getItem("pttoken");
      console.log("token in context", pttoken);

      if (!pttoken) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("/api/pathlab/details", {
          headers: {
            Authorization: `Bearer ${pttoken}`,
          },
        });

        if (res.data.success) {
          setPathlab(res.data.pathlab); 
        } else {
          setPathlab(null);
        }
      } catch (error) {
        console.error("Pathlab fetch error:", error);
        setPathlab(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPathlab();
  }, []);

  const pathlabId = pathlab?._id || pathlab?.id || null;

  return (
    <PathlabContext.Provider value={{ pathlab, setPathlab, loading, pathlabId}}>
      {children}
    </PathlabContext.Provider>
  );
};


export const usePathlab = () => useContext(PathlabContext);

export default PathlabProvider;