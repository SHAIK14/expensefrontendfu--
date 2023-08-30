import React, { useState } from "react";

import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import { BACKEND_URL } from "../constants";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/users/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        console.log("Login successful");
        localStorage.setItem("token", response.data.token);
        navigate("/addExpenses");
      } else {
        console.log("Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="App">
      <div className="login">
        <div className="header">
          <h1>Login</h1>
        </div>
        <div className="items">
          <input
            type="email"
            placeholder="Email"
            value={email}
            className="item"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            className="item"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>
        <p className="exists">
          Dont have an account?
          <Link className="existslink" to="/">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
