import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 40px",
      backgroundColor: "var(--surface)",
      borderBottom: "1px solid var(--border)"
    }}>
      <Link to="/" style={{ fontSize: "22px", fontWeight: "bold", color: "var(--accent-green)" }}>
        GAMEVAULT
      </Link>
      <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
        <Link to="/store" style={{ color: "var(--text-primary)" }}>Store</Link>
        <Link to="/cart" style={{ color: "var(--text-primary)" }}>Cart</Link>
        {token ? (
          <button onClick={handleLogout} style={{
            backgroundColor: "var(--accent-green)",
            color: "#000",
            padding: "8px 16px"
          }}>
            Logout
          </button>
        ) : (
          <Link to="/login" style={{
            backgroundColor: "var(--accent-green)",
            color: "#000",
            padding: "8px 16px",
            borderRadius: "6px"
          }}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}