import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig";

function TiltCard({ game }) {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({});

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -14;
    const rotateY = ((x / rect.width) - 0.5) * 14;
    setStyle({
      transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04,1.04,1.04)`,
      transition: "transform 0.05s linear"
    });
  };

  const resetStyle = () => {
    setStyle({ transform: "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)", transition: "transform 0.4s ease" });
  };

  return (
    <Link to={`/games/${game.gameId}`} style={{ textDecoration: "none" }}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetStyle}
        className="game-card"
        style={{
          ...style,
          width: "220px",
        }}
      >
        <img src={game.imageUrl} alt={game.title} className="game-card-img" style={{ height: "280px" }} />
        <div className="game-card-body">
          <h4 className="game-card-title" style={{ fontSize: "15px" }}>{game.title}</h4>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "var(--accent-green)", fontWeight: "bold" }}>
              ₹{game.discountPrice || game.price}
            </span>
            <span style={{ color: "#facc15", fontSize: "13px" }}>★ {game.rating}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    api.get("/games").then((res) => setGames(res.data.slice(0, 12))).catch(() => setGames([]));
  }, []);

  return (
    <div style={{ backgroundColor: "#0D0D0D", minHeight: "100vh" }}>

      <section style={{
        position: "relative",
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        overflow: "hidden",
        background: "radial-gradient(circle at 50% 30%, rgba(34,197,94,0.15), transparent 60%), linear-gradient(180deg, #0D0D0D, #000)"
      }}>
        <h1 style={{
          fontSize: "64px", fontWeight: "900", color: "#fff",
          marginBottom: "16px", letterSpacing: "-1px",
          textShadow: "0 0 40px rgba(34,197,94,0.4)"
        }}>
          Play Beyond Limits
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "18px", maxWidth: "600px", marginBottom: "32px" }}>
          Thousands of games. Instant digital delivery. Unbeatable prices.
          Your next adventure starts here.
        </p>
        <Link to="/store" style={{
          backgroundColor: "var(--accent-green)", color: "#000",
          padding: "16px 40px", borderRadius: "10px", fontWeight: "800",
          fontSize: "16px", textDecoration: "none",
          boxShadow: "0 0 30px rgba(34,197,94,0.5)"
        }}>
          Explore the Store
        </Link>
      </section>

      <section style={{ padding: "60px 40px" }}>
        <h2 style={{ color: "#fff", fontSize: "28px", marginBottom: "24px" }}>🔥 Trending Now</h2>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {games.map((g) => <TiltCard key={g.gameId} game={g} />)}
        </div>
      </section>

      <section style={{
        padding: "80px 40px", textAlign: "center",
        background: "linear-gradient(180deg, #0D0D0D, #111)"
      }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "60px", flexWrap: "wrap" }}>
          {[
            { label: "Games Available", value: "1,000+" },
            { label: "Happy Gamers", value: "50K+" },
            { label: "Instant Delivery", value: "100%" },
            { label: "Support", value: "24/7" },
          ].map((stat) => (
            <div key={stat.label}>
              <h3 style={{ color: "var(--accent-green)", fontSize: "36px", fontWeight: "900" }}>{stat.value}</h3>
              <p style={{ color: "var(--text-muted)" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}