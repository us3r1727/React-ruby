import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const PrivateRoute = ({ children, adminOnly = false }) => {
  const token = Cookies.get("token");
  const role = Cookies.get("role");
    console.log("DEBUG: Token lido:", token);
    console.log("DEBUG: Role lido:", `"${role}"`);


  if (!token) return <Navigate to="/login" replace />;

  if (adminOnly && role !== "admin") return <Navigate to="/profile" replace />;

  return children;
};

export default PrivateRoute;
