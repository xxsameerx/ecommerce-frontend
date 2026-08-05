import { useState } from "react";
import AdminProducts from "./AdminProducts";
import AdminUsers from "./AdminUsers";
import AdminAnalytics from "./AdminAnalytics";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products");
  const { fullName, logout } = useAuth();

  return (
    <div style={{ backgroundColor: "#0D0D0D", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: "1px solid var(--border)" }}>
        <h1 style={{ color: "#fff" }}>Admin Dashboard</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ color: "var(--text-muted)" }}>Welcome, {fullName}</span>
          <button onClick={logout} style={{ padding: "8px 16px", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", padding: "20px 40px" }}>
        <TabButton label="Products" active={activeTab === "products"} onClick={() => setActiveTab("products")} />
        <TabButton label="Users" active={activeTab === "users"} onClick={() => setActiveTab("users")} />
        <TabButton label="Analytics" active={activeTab === "analytics"} onClick={() => setActiveTab("analytics")} />
      </div>

      <div style={{ padding: "0 20px" }}>
        {activeTab === "products" && <AdminProducts />}
        {activeTab === "users" && <AdminUsers />}
        {activeTab === "analytics" && <AdminAnalytics />}
      </div>
    </div>
  );
}

function TabButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 24px",
        backgroundColor: active ? "var(--accent-green)" : "var(--surface)",
        color: active ? "#000" : "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold"
      }}
    >
      {label}
    </button>
  );
}