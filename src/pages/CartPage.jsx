import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import api from "../api/axiosConfig";

export default function CartPage() {
  const { cart, fetchCart, removeItem, updateQuantity } = useCart();
  const [gameDetails, setGameDetails] = useState({});

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (cart?.items) {
      cart.items.forEach((item) => {
        if (!gameDetails[item.gameId]) {
          api.get(`/games/${item.gameId}`).then((res) => {
            setGameDetails((prev) => ({ ...prev, [item.gameId]: res.data }));
          });
        }
      });
    }
  }, [cart]);

  if (!cart || !cart.items || cart.items.length === 0) {
    return <p style={{ padding: "40px" }}>Your cart is empty.</p>;
  }

  const total = cart.items.reduce((sum, item) => {
    const game = gameDetails[item.gameId];
    const price = game ? (game.discountPrice || game.price) : 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ marginBottom: "24px" }}>Your Cart</h1>
      {cart.items.map((item) => {
        const game = gameDetails[item.gameId];
        if (!game) return null;
        return (
          <div key={item.cartItemId} style={{
            display: "flex", gap: "20px", alignItems: "center",
            backgroundColor: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: "10px", padding: "16px", marginBottom: "16px"
          }}>
            <img src={game.imageUrl} alt={game.title} style={{ width: "80px", height: "100px", objectFit: "cover", borderRadius: "6px" }} />
            <div style={{ flex: "1" }}>
              <h3>{game.title}</h3>
              <p style={{ color: "var(--text-muted)" }}>${game.discountPrice || game.price} each</p>
            </div>
            <input type="number" min="1" value={item.quantity}
              onChange={(e) => updateQuantity(item.cartItemId, parseInt(e.target.value))}
              style={{ width: "60px", padding: "6px", backgroundColor: "#0D0D0D", color: "var(--text-primary)", border: "1px solid var(--border)", borderRadius: "6px" }}
            />
            <button onClick={() => removeItem(item.cartItemId)} style={{
              backgroundColor: "transparent", color: "#ff5252", border: "1px solid #ff5252", padding: "8px 14px", borderRadius: "6px"
            }}>
              Remove
            </button>
          </div>
        );
      })}
      <h2 style={{ marginTop: "24px", color: "var(--accent-green)" }}>Total: ${total.toFixed(2)}</h2>
    </div>
  );
}