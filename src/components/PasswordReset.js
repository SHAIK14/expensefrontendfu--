import React, { useState } from "react";
import axios from "axios";
import "./PasswordReset.css";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleResetPassword = async () => {
    try {
      await axios.post("http://localhost:4000/api/password/forgotpassword", {
        email,
      });

      setMessage("Password reset email sent successfully!");
      setEmail("");
    } catch (error) {
      console.error("Error sending password reset email:", error);
    }
  };

  return (
    <div className="App">
      <div className="resetpswd">
        <div className="header">
          <h1>Reset Password</h1>
        </div>
        {message && <div className="success-message">{message}</div>}

        <div className="items">
          <input
            type="email"
            placeholder="Email"
            className="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button className="reset-btn" onClick={handleResetPassword}>
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default PasswordReset;
