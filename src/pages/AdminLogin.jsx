import { useState } from "react";
import api from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminLogin() {
  const [form, setForm] = useState({ emailOrMobile: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/admin-login", form);
      login(res.data);
      toast.success("Admin login successful!");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(typeof err.response?.data === "string" ? err.response.data : "Admin login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Admin Login</h2>
        <p className="auth-subtitle">Restricted access — authorized personnel only</p>
        <form onSubmit={handleSubmit}>
          <input className="auth-input" name="emailOrMobile" placeholder="Admin Email"
            onChange={handleChange} required />
          <input className="auth-input" name="password" type="password" placeholder="Password"
            onChange={handleChange} required />
          <button className="auth-button" type="submit">Login as Admin</button>
        </form>
        <p className="auth-footer">
          <Link to="/login">Back to User Login</Link>
        </p>
      </div>
    </div>
  );
}