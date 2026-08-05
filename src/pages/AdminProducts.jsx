import { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { toast } from "react-toastify";

export default function AdminProducts() {
  const [games, setGames] = useState([]);
  const [form, setForm] = useState({
    title: "", genre: "", platform: "", price: "", discountPrice: "",
    imageUrl: "", description: "", rating: "", publisher: "", releaseDate: "", stock: ""
  });

  const fetchGames = () => {
    api.get("/admin/games").then((res) => setGames(res.data)).catch(() => setGames([]));
  };

  useEffect(() => { fetchGames(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : null,
        rating: form.rating ? parseFloat(form.rating) : null,
        stock: form.stock ? parseInt(form.stock) : null,
      };
      await api.post("/admin/games", payload);
      toast.success("Game added successfully!");
      setForm({ title: "", genre: "", platform: "", price: "", discountPrice: "", imageUrl: "", description: "", rating: "", publisher: "", releaseDate: "", stock: "" });
      fetchGames();
    } catch (err) {
      toast.error(err.response?.data || "Failed to add game");
    }
  };

  const performDelete = async (id) => {
    try {
      await api.delete(`/admin/games/${id}`);
      toast.success("Game deleted");
      fetchGames();
    } catch (err) {
      toast.error(err.response?.data || "Failed to delete game");
    }
  };

 const confirmDelete = (id) => {
  toast(
    ({ closeToast }) => (
      <div>
        <p style={{ marginBottom: "10px", color: "#fff" }}>Delete this game permanently?</p>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => { performDelete(id); closeToast(); }}
            style={{
              backgroundColor: "#ef4444", color: "#fff", border: "none",
              padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold"
            }}
          >
            Yes, Delete
          </button>
          <button
            onClick={closeToast}
            style={{
              backgroundColor: "#333", color: "#fff", border: "none",
              padding: "6px 14px", borderRadius: "6px", cursor: "pointer"
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    ),
    {
      autoClose: false,
      closeOnClick: false,
      closeButton: true,
      style: {
        backgroundColor: "var(--surface, #1a1a1a)",
        border: "1px solid var(--border, #2a2a2a)",
        borderRadius: "10px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)"
      }
    }
  );
};

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "#fff", marginBottom: "20px" }}>Product Management</h2>

      <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "30px", backgroundColor: "var(--surface)", padding: "20px", borderRadius: "10px" }}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required style={inputStyle} />
        <input name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} required style={inputStyle} />
        <input name="platform" placeholder="Platform" value={form.platform} onChange={handleChange} style={inputStyle} />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required style={inputStyle} />
        <input name="discountPrice" type="number" placeholder="Discount Price" value={form.discountPrice} onChange={handleChange} style={inputStyle} />
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} style={inputStyle} />
        <input name="imageUrl" placeholder="Image URL" value={form.imageUrl} onChange={handleChange} style={inputStyle} />
        <input name="publisher" placeholder="Publisher" value={form.publisher} onChange={handleChange} style={inputStyle} />
        <input name="releaseDate" placeholder="Release Date" value={form.releaseDate} onChange={handleChange} style={inputStyle} />
        <input name="rating" type="number" step="0.1" placeholder="Rating" value={form.rating} onChange={handleChange} style={inputStyle} />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} style={{ ...inputStyle, gridColumn: "span 3" }} />
        <button type="submit" style={{ gridColumn: "span 3", padding: "12px", backgroundColor: "var(--accent-green)", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
          Add Game
        </button>
      </form>

      <table style={{ width: "100%", color: "#fff", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Genre</th>
            <th style={thStyle}>Price</th>
            <th style={thStyle}>Stock</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {games.map((g) => (
            <tr key={g.gameId} style={{ borderBottom: "1px solid var(--border)" }}>
              <td style={tdStyle}>{g.title}</td>
              <td style={tdStyle}>{g.genre}</td>
              <td style={tdStyle}>₹{g.price}</td>
              <td style={tdStyle}>{g.stock ?? "-"}</td>
              <td style={tdStyle}>
                <button onClick={() => confirmDelete(g.gameId)} style={{ backgroundColor: "#ef4444", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const inputStyle = { padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", backgroundColor: "#1a1a1a", color: "#fff" };
const thStyle = { textAlign: "left", padding: "10px", color: "var(--text-muted)" };
const tdStyle = { padding: "10px" };