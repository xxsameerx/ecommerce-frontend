import { useState } from "react";
import api from "../api/axiosConfig";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/forgot-password", { emailOrMobile });
      setMessage(res.data);
    } catch (err) {
      setMessage(typeof err.response?.data === "string" ? err.response.data : "Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Forgot Password</h2>
        <p className="auth-subtitle">Enter your email or mobile to reset it</p>
        <form onSubmit={handleSubmit}>
          <input className="auth-input" placeholder="Email or Mobile"
            value={emailOrMobile} onChange={(e) => setEmailOrMobile(e.target.value)} required />
          <button className="auth-button" type="submit">Send Reset Token</button>
        </form>
        {message && <p className="auth-message">{message}</p>}
        <p className="auth-footer">
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}