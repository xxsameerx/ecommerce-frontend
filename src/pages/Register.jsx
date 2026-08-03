import { useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "", email: "", mobileNumber: "", password: "", confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", form);
      toast.success(res.data || "Registration successful!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(typeof err.response?.data === "string" ? err.response.data : "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join the store and start collecting games</p>
        <form onSubmit={handleSubmit}>
          <input className="auth-input" name="fullName" placeholder="Full Name" onChange={handleChange} required />
          <input className="auth-input" name="email" placeholder="Email" onChange={handleChange} required />
          <input className="auth-input" name="mobileNumber" placeholder="Mobile Number" onChange={handleChange} required />
          <input className="auth-input" name="password" type="password" placeholder="Password" onChange={handleChange} required />
          <input className="auth-input" name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} required />
          <button className="auth-button" type="submit">Register</button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}