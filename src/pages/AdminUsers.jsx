import { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { toast } from "react-toastify";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ fullName: "", email: "", role: "" });

  const fetchUsers = () => {
    api.get("/admin/users").then((res) => setUsers(res.data)).catch(() => setUsers([]));
  };

  useEffect(() => { fetchUsers(); }, []);

  const openEdit = (user) => {
    setEditingUser(user.userId);
    setForm({ fullName: user.fullName, email: user.email, role: user.role });
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    try {
      await api.put(`/admin/users/${editingUser}`, form);
      toast.success("User updated successfully");
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data || "Failed to update user");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "#fff", marginBottom: "20px" }}>User Management</h2>

      <table style={{ width: "100%", color: "#fff", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Mobile</th>
            <th style={thStyle}>Role</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.userId} style={{ borderBottom: "1px solid var(--border)" }}>
              <td style={tdStyle}>{u.fullName}</td>
              <td style={tdStyle}>{u.email}</td>
              <td style={tdStyle}>{u.mobileNumber}</td>
              <td style={tdStyle}>
                <span style={{ color: u.role === "ADMIN" ? "var(--accent-green)" : "#fff" }}>{u.role}</span>
              </td>
              <td style={tdStyle}>
                <button onClick={() => openEdit(u)} style={{ backgroundColor: "#3b82f6", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingUser && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ backgroundColor: "var(--surface)", padding: "30px", borderRadius: "12px", width: "400px" }}>
            <h3 style={{ color: "#fff", marginBottom: "16px" }}>Edit User</h3>
            <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" style={{ ...inputStyle, width: "100%", marginBottom: "10px" }} />
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" style={{ ...inputStyle, width: "100%", marginBottom: "10px" }} />
            <select name="role" value={form.role} onChange={handleChange} style={{ ...inputStyle, width: "100%", marginBottom: "16px" }}>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={handleUpdate} style={{ flex: 1, padding: "10px", backgroundColor: "var(--accent-green)", border: "none", borderRadius: "6px", cursor: "pointer" }}>Save</button>
              <button onClick={() => setEditingUser(null)} style={{ flex: 1, padding: "10px", backgroundColor: "#333", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = { padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", backgroundColor: "#1a1a1a", color: "#fff" };
const thStyle = { textAlign: "left", padding: "10px", color: "var(--text-muted)" };
const tdStyle = { padding: "10px" };