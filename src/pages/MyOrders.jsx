import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig";

const statusConfig = {
  PAID: { label: "Delivered", color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  CREATED: { label: "Payment Pending", color: "#eab308", bg: "rgba(234,179,8,0.12)" },
  FAILED: { label: "Payment Failed", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [gameDetails, setGameDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/payment/orders")
      .then((res) => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    orders.forEach((order) => {
      if (order.gameId && !gameDetails[order.gameId]) {
        api.get(`/games/${order.gameId}`).then((res) => {
          setGameDetails((prev) => ({ ...prev, [order.gameId]: res.data }));
        }).catch(() => {});
      }
    });
  }, [orders, gameDetails]);

  if (loading) return <p style={{ padding: "40px" }}>Loading orders...</p>;

  if (orders.length === 0) {
    return (
      <div style={{ padding: "60px", textAlign: "center" }}>
        <h2 style={{ color: "var(--text-muted)" }}>No orders yet</h2>
        <p style={{ color: "var(--text-muted)", marginTop: "8px" }}>
          Your purchased games will show up here.
        </p>
        <Link to="/store" style={{
          display: "inline-block", marginTop: "20px", backgroundColor: "var(--accent-green)",
          color: "#000", padding: "10px 24px", borderRadius: "8px", fontWeight: "bold"
        }}>
          Browse Store
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "8px" }}>My Orders</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "32px" }}>
        {orders.length} order{orders.length > 1 ? "s" : ""} placed
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {orders.map((order) => {
          const game = gameDetails[order.gameId];
          const status = statusConfig[order.status] || statusConfig.CREATED;

          return (
            <div key={order.orderId} style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              gap: "20px",
              alignItems: "center",
              flexWrap: "wrap"
            }}>
              <Link to={game ? `/games/${order.gameId}` : "#"} style={{ flexShrink: 0 }}>
                {game ? (
                  <img src={game.imageUrl} alt={game.title} style={{
                    width: "70px", height: "90px", objectFit: "cover", borderRadius: "8px"
                  }} />
                ) : (
                  <div style={{ width: "70px", height: "90px", backgroundColor: "#1a1a1a", borderRadius: "8px" }} />
                )}
              </Link>

              <div style={{ flex: "1", minWidth: "200px" }}>
                <Link to={game ? `/games/${order.gameId}` : "#"} style={{
                  color: "var(--text-primary)", fontWeight: "bold", fontSize: "17px", textDecoration: "none"
                }}>
                  {game ? game.title : `Game #${order.gameId}`}
                </Link>
                <p style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "6px" }}>
                  Order ID: {order.razorpayOrderId}
                </p>
                <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                  Payment ID: {order.razorpayPaymentId || "—"}
                </p>
                <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                  Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric"
                  })}
                </p>
              </div>

              <div style={{ textAlign: "right", minWidth: "140px" }}>
                <p style={{
                  display: "inline-block",
                  backgroundColor: status.bg,
                  color: status.color,
                  fontWeight: "bold",
                  fontSize: "13px",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  marginBottom: "10px"
                }}>
                  {status.label}
                </p>
                <p style={{ fontSize: "18px", fontWeight: "bold", color: "var(--accent-green)" }}>
                  ₹{order.amount}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}