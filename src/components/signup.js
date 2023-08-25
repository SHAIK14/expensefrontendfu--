import React, { useState } from "react";
import "./signup.css";
import axios from "axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const response = await axios.post("http://localhost:4000/signup", {
        name,
        email,
        password,
      });

      if (response.status === 200) {
        console.log("Signup successful");
        // You can redirect to the login page or perform any other actions here
      } else {
        console.log("Signup failed");
      }
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <div className="App">
      <div className="signup">
        <div className="header">
          <h1>Signup</h1>
        </div>
        <div className="items">
          <input
            type="text"
            placeholder="Name"
            value={name}
            className="item"
            onChange={(e) => setName(e.target.value)}
          />
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
        <button className="signup-btn" onClick={handleSignup}>
          Signup
        </button>
      </div>
    </div>
  );
};

export default Signup;
