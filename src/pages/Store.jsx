import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { Link } from "react-router-dom";

const GENRES = ["All", "Action", "Action RPG", "RPG", "Action Adventure", "Sports"];

export default function Store() {
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (genre !== "All") params.genre = genre;
    api.get("/games", { params }).then((res) => setGames(res.data)).catch(() => setGames([]));
  }, [search, genre]);

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ marginBottom: "24px" }}>Browse Games</h1>

      <div style={{ display: "flex", gap: "16px", marginBottom: "32px", flexWrap: "wrap" }}>
        <input
          placeholder="Search games..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "12px 16px",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            color: "var(--text-primary)",
            flex: "1",
            minWidth: "220px"
          }}
        />
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          style={{
            padding: "12px 16px",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            color: "var(--text-primary)"
          }}
        >
          {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "24px"
      }}>
{games.map((game) => (
  <Link to={`/games/${game.gameId}`} key={game.gameId} className="game-card">
    <img src={game.imageUrl} alt={game.title} className="game-card-img" />
    <div className="game-card-body">
      <h3 className="game-card-title">{game.title}</h3>
      <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "12px" }}>{game.genre} · {game.platform}</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>
          {game.discountPrice ? (
            <>
              <span style={{ color: "var(--text-muted)", textDecoration: "line-through", marginRight: "6px", fontSize: "13px" }}>₹{game.price}</span>
              <span style={{ color: "var(--accent-green)", fontWeight: "bold" }}>₹{game.discountPrice}</span>
            </>
          ) : (
            <span style={{ color: "var(--accent-green)", fontWeight: "bold" }}>₹{game.price}</span>
          )}
        </span>
        <span style={{ color: "var(--accent-blue)" }}>★ {game.rating}</span>
      </div>
    </div>
  </Link>
))}
      </div>
    </div>
  );
}