import React from "react";
// import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton"; // Import the LogoutButton component
import "./Nav.css";
const NavigationBar = () => {
  return (
    <div className="nav">
      <div className="log">
        <LogoutButton />
      </div>
    </div>
  );
};

export default NavigationBar;
