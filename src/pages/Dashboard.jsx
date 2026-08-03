import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [gameDetails, setGameDetails] = useState({});
  const [loading, setLoading] = useState(true);

  const email = user?.sub || "";
  const username = email.split("@")[0];
  const initial = username.charAt(0).toUpperCase();

  useEffect(() => {
    Promise.all([
      api.get("/payment/stats"),
      api.get("/payment/orders"),
    ]).then(([statsRes, ordersRes]) => {
      setStats(statsRes.data);
      setRecentOrders(ordersRes.data.slice(0, 5));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    recentOrders.forEach((order) => {
      if (order.gameId && !gameDetails[order.gameId]) {
        api.get(`/games/${order.gameId}`).then((res) => {
          setGameDetails((prev) => ({ ...prev, [order.gameId]: res.data }));
        }).catch(() => {});
      }
    });
  }, [recentOrders, gameDetails]);

  if (loading) return <p style={{ padding: "40px", color: "#fff" }}>Loading your dashboard...</p>;

  const memberSince = stats?.memberSince
    ? new Date(stats.memberSince).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "New member";

  return (
    <div style={{ backgroundColor: "#0D0D0D", minHeight: "100vh", padding: "48px 40px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>

        {/* Profile header */}
        <div style={{
          display: "flex", alignItems: "center", gap: "24px",
          padding: "32px", borderRadius: "16px",
          background: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(0,0,0,0))",
          border: "1px solid var(--border)", marginBottom: "32px"
        }}>
          <div style={{
            width: "84px", height: "84px", borderRadius: "50%",
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "36px", fontWeight: "900", color: "#000",
            boxShadow: "0 0 30px rgba(34,197,94,0.4)"
          }}>
            {initial}
          </div>
          <div>
            <h1 style={{ color: "#fff", fontSize: "28px", marginBottom: "4px", textTransform: "capitalize" }}>
              {username}
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>{email}</p>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "4px" }}>
              Member since {memberSince}
            </p>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px", marginBottom: "40px"
        }}>
          <StatCard label="Total Spent" value={`₹${(stats?.totalSpent || 0).toFixed(2)}`} icon="💰" />
          <StatCard label="Games Owned" value={stats?.gamesOwned || 0} icon="🎮" />
          <StatCard label="Orders Placed" value={stats?.totalOrders || 0} icon="📦" />
          <StatCard label="Avg. Order Value" value={
            stats?.totalOrders ? `₹${(stats.totalSpent / stats.totalOrders).toFixed(2)}` : "₹0.00"
          } icon="📊" />
        </div>

        {/* Recent activity */}
        <div style={{
          backgroundColor: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "14px", padding: "24px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ color: "#fff", fontSize: "20px" }}>Recent Activity</h2>
            <Link to="/my-orders" style={{ color: "var(--accent-green)", fontSize: "14px", textDecoration: "none" }}>
              View all →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>No purchases yet. Start exploring the store!</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {recentOrders.map((order) => {
                const game = gameDetails[order.gameId];
                return (
                  <div key={order.orderId} style={{
                    display: "flex", alignItems: "center", gap: "14px",
                    padding: "10px", borderRadius: "8px",
                    backgroundColor: "rgba(255,255,255,0.02)"
                  }}>
                    {game && (
                      <img src={game.imageUrl} alt={game.title} style={{
                        width: "40px", height: "52px", objectFit: "cover", borderRadius: "6px"
                      }} />
                    )}
                    <div style={{ flex: 1 }}>
                      <p style={{ color: "#fff", fontSize: "14px" }}>{game?.title || `Game #${order.gameId}`}</p>
                      <p style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span style={{
                      fontSize: "12px", fontWeight: "bold", padding: "4px 10px", borderRadius: "12px",
                      color: order.status === "PAID" ? "#22c55e" : order.status === "FAILED" ? "#ef4444" : "#eab308",
                      backgroundColor: order.status === "PAID" ? "rgba(34,197,94,0.12)" :
                        order.status === "FAILED" ? "rgba(239,68,68,0.12)" : "rgba(234,179,8,0.12)"
                    }}>
                      {order.status}
                    </span>
                    <span style={{ color: "var(--accent-green)", fontWeight: "bold", fontSize: "14px" }}>
                      ${order.amount}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div style={{
      backgroundColor: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: "12px", padding: "20px", transition: "transform 0.2s",
      cursor: "default"
    }}
      onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
      onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
    >
      <div style={{ fontSize: "24px", marginBottom: "8px" }}>{icon}</div>
      <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "4px" }}>{label}</p>
      <p style={{ color: "#fff", fontSize: "24px", fontWeight: "900" }}>{value}</p>
    </div>
  );
}