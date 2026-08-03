import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosConfig";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GameDetail() {
  const { id } = useParams();
  const [game, setGame] = useState(null);

  const { addToCart } = useCart();
const { token } = useAuth();
const navigate = useNavigate();

const handleAddToCart = async () => {
   if (!token) {
    navigate("/login", { state: { from: `/games/${game.gameId}` } });
    return;
  }
  await addToCart(game.gameId, 1);
  alert("Added to cart!");
};

  useEffect(() => {
    api.get(`/games/${id}`).then((res) => setGame(res.data));
  }, [id]);

  if (!game) return <p style={{ padding: "40px" }}>Loading...</p>;

  return (
    <div style={{ padding: "40px", display: "flex", gap: "40px", flexWrap: "wrap" }}>
      <img src={game.imageUrl} alt={game.title} style={{ width: "320px", borderRadius: "10px" }} />
      <div style={{ flex: "1", minWidth: "280px" }}>
        <h1 style={{ marginBottom: "8px" }}>{game.title}</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "16px" }}>
          {game.genre} · {game.platform} · {game.publisher} · Released {game.releaseDate}
        </p>
        <div style={{ marginBottom: "16px", fontSize: "24px" }}>
          {game.discountPrice ? (
            <>
              <span style={{ textDecoration: "line-through", color: "var(--text-muted)", marginRight: "10px", fontSize: "16px" }}>${game.price}</span>
              <span style={{ color: "var(--accent-green)", fontWeight: "bold" }}>${game.discountPrice}</span>
            </>
          ) : (
            <span style={{ color: "var(--accent-green)", fontWeight: "bold" }}>${game.price}</span>
          )}
        </div>
        <p style={{ marginBottom: "24px", lineHeight: "1.6", color: "var(--text-primary)" }}>{game.description}</p>
        <p style={{ marginBottom: "24px", color: "var(--accent-blue)" }}>★ {game.rating} rating · {game.stock} in stock</p>
        <button onClick={handleAddToCart} style={{
          backgroundColor: "var(--accent-green)",
          color: "#000",
          padding: "14px 32px",
          borderRadius: "8px",
          fontWeight: "bold",
          fontSize: "15px"
        }}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}