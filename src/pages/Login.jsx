import { useState } from "react";
import api from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const [form, setForm] = useState({ emailOrMobile: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      login(res.data);
      toast.success("Login successful!");
      const redirectTo = location.state?.from || "/dashboard";
      navigate(redirectTo);
    } catch (err) {
      toast.error(typeof err.response?.data === "string" ? err.response.data : "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Login to continue your game journey</p>
        <form onSubmit={handleSubmit}>
          <input className="auth-input" name="emailOrMobile" placeholder="Email or Mobile"
            onChange={handleChange} required />
          <input className="auth-input" name="password" type="password" placeholder="Password"
            onChange={handleChange} required />
          <button className="auth-button" type="submit">Login</button>
        </form>
        <p className="auth-footer">
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
        <p className="auth-footer">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}