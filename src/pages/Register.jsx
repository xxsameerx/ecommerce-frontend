import { useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import PasswordInput from "../components/PasswordInput";
import PasswordChecklist from "../components/PasswordChecklist";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "", email: "", mobileNumber: "", password: "", confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const isPasswordValid =
    form.password.length >= 8 &&
    /[A-Z]/.test(form.password) &&
    /[a-z]/.test(form.password) &&
    /[0-9]/.test(form.password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordValid) {
      toast.error("Password does not meet requirements");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
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

          <PasswordInput name="password" value={form.password} onChange={handleChange} placeholder="Create Password" />
          <PasswordChecklist password={form.password} />

          <PasswordInput name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm Password" />

          <button className="auth-button" type="submit" disabled={!isPasswordValid}>Register</button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}