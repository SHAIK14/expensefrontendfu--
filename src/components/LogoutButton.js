import React from "react";
import { useNavigate } from "react-router-dom";
import "./Logout.css";
const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token from local storage or wherever you store it.
    localStorage.removeItem("token");

    // Redirect the user to the login page or any other page of your choice.
    navigate("/login");
  };

  return (
    <button className="logout-btn" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
