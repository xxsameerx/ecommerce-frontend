import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axiosConfig";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(searchParams.get("token") || "");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/reset-password", { token, newPassword });
      toast.success(res.data || "Password reset successful!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(typeof err.response?.data === "string" ? err.response.data : "Reset failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Reset Password</h2>
        <p className="auth-subtitle">Paste your token and set a new password</p>
        <form onSubmit={handleSubmit}>
          <input className="auth-input" placeholder="Reset Token" value={token}
            onChange={(e) => setToken(e.target.value)} required />
          <input className="auth-input" type="password" placeholder="New Password" value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)} required />
          <button className="auth-button" type="submit">Reset Password</button>
        </form>
        <p className="auth-footer">
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}