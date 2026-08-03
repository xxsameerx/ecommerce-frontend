import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { token, user, logout } = useAuth();
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (token) fetchCart();
  }, [token, fetchCart]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const cartCount = cart?.items?.reduce((s, i) => s + i.quantity, 0) || 0;
  const displayName = user?.sub ? user.sub.split("@")[0] : "";

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 1000,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: scrolled ? "10px 40px" : "18px 40px",
      backgroundColor: scrolled ? "rgba(13,13,13,0.85)" : "rgba(13,13,13,0.4)",
      backdropFilter: "blur(14px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      transition: "all 0.3s ease"
    }}>
      <Link to="/" style={{
        fontSize: "24px", fontWeight: "900", letterSpacing: "1px",
        color: "var(--accent-green)", textDecoration: "none",
        display: "flex", alignItems: "center", gap: "8px"
      }}>
        <span style={{
          background: "linear-gradient(135deg, #22c55e, #16a34a)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
        }}>GAMEVAULT</span>
      </Link>

      <div style={{ display: "flex", gap: "28px", alignItems: "center" }}>
        <Link to="/store" style={navLink}>Store</Link>
        <Link to="/about" style={navLink}>About</Link>

        <Link to="/cart" style={{ ...navLink, position: "relative" }}>
          🛒 Cart
          {cartCount > 0 && (
            <span style={{
              position: "absolute", top: "-10px", right: "-14px",
              backgroundColor: "var(--accent-green)", color: "#000",
              borderRadius: "50%", fontSize: "11px", fontWeight: "bold",
              padding: "2px 6px", minWidth: "18px", textAlign: "center"
            }}>{cartCount}</span>
          )}
        </Link>

        {token && <Link to="/my-orders" style={navLink}>Orders</Link>}

        {token ? (
          <>
            <Link to="/dashboard" style={{
              color: "var(--text-muted)", fontSize: "14px", textDecoration: "none",
              display: "flex", alignItems: "center", gap: "6px"
            }}>
              👤 {displayName}
            </Link>
            <button onClick={handleLogout} style={ctaBtn}>Logout</button>
          </>
        ) : (
          <Link to="/login" style={{ ...ctaBtn, textDecoration: "none", display: "inline-block" }}>Login</Link>
        )}
      </div>
    </nav>
  );
}

const navLink = { color: "var(--text-primary)", textDecoration: "none", fontSize: "15px", fontWeight: "500" };
const ctaBtn = {
  backgroundColor: "var(--accent-green)", color: "#000", padding: "9px 20px",
  borderRadius: "8px", border: "none", fontWeight: "700", cursor: "pointer", fontSize: "14px"
};