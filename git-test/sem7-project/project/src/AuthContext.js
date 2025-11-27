// src/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // <- expose this

  useEffect(() => {
    try {
       const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
       const raw   = localStorage.getItem("user")  || localStorage.getItem("adminUser");

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      if (raw && raw !== "undefined" && raw !== "null") {
        try {
          setUser(JSON.parse(raw));
        } catch {
          localStorage.removeItem("user"); // corrupt -> clean up
        }
      } else {
        localStorage.removeItem("user");
      }
    } finally {
      setLoading(false); // <- ALWAYS clear loading
    }
  }, []);

  const login = (token, userObj) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userObj));
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userObj);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, isLoggedIn: !!user, loading, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
};
