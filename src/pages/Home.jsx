import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { Link } from "react-router-dom";

export default function Home() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    api.get("/games").then((res) => setGames(res.data)).catch(() => setGames([]));
  }, []);

  return (
    <div>
      <section style={{
        textAlign: "center",
        padding: "80px 20px",
        background: "linear-gradient(135deg, #0D0D0D, #1A1A1A)",
        borderBottom: "1px solid var(--border)"
      }}>
        <h1 style={{ fontSize: "48px", marginBottom: "16px" }}>
          Level Up Your <span style={{ color: "var(--accent-green)" }}>Game Library</span>
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "18px", marginBottom: "24px" }}>
          Instant digital keys. Unbeatable prices. Zero waiting.
        </p>
        <Link to="/store" style={{
          backgroundColor: "var(--accent-green)",
          color: "#000",
          padding: "14px 32px",
          borderRadius: "6px",
          fontWeight: "bold",
          display: "inline-block"
        }}>
          Browse Store
        </Link>
      </section>

      <section style={{ padding: "60px 40px" }}>
        <h2 style={{ marginBottom: "24px" }}>Featured Games</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "24px"
        }}>
          {games.map((game) => (
            <Link to={`/games/${game.gameId}`} key={game.gameId} style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              overflow: "hidden",
              display: "block"
            }}>
              <img src={game.imageUrl} alt={game.title} style={{ width: "100%", height: "260px", objectFit: "cover" }} />
              <div style={{ padding: "16px" }}>
                <h3 style={{ fontSize: "16px", marginBottom: "8px", color: "var(--text-primary)" }}>{game.title}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "12px" }}>{game.genre} · {game.platform}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--accent-green)", fontWeight: "bold" }}>${game.discountPrice || game.price}</span>
                  <span style={{ color: "var(--accent-blue)" }}>★ {game.rating}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}