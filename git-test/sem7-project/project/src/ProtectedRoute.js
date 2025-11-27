import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();

  const location = useLocation();
  if (loading) return null; // or a spinner
  if (!isLoggedIn) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}
