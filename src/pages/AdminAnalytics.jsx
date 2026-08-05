import { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { toast } from "react-toastify";

export default function AdminAnalytics() {
  const [overall, setOverall] = useState(null);
  const [daily, setDaily] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [yearly, setYearly] = useState(null);

  const [dateInput, setDateInput] = useState("");
  const [monthInput, setMonthInput] = useState("");
  const [yearInputMonthly, setYearInputMonthly] = useState("");
  const [yearInput, setYearInput] = useState("");

  useEffect(() => {
    api.get("/admin/analytics/overall").then((res) => setOverall(res.data)).catch(() => {});
  }, []);

  const fetchDaily = async () => {
    if (!dateInput) return toast.error("Select a date first");
    try {
      const res = await api.get(`/admin/analytics/daily?date=${dateInput}`);
      setDaily(res.data);
    } catch (err) {
      toast.error("Failed to fetch daily revenue");
    }
  };

  const fetchMonthly = async () => {
    if (!monthInput || !yearInputMonthly) return toast.error("Select month and year");
    try {
      const res = await api.get(`/admin/analytics/monthly?month=${monthInput}&year=${yearInputMonthly}`);
      setMonthly(res.data);
    } catch (err) {
      toast.error("Failed to fetch monthly revenue");
    }
  };

  const fetchYearly = async () => {
    if (!yearInput) return toast.error("Select a year");
    try {
      const res = await api.get(`/admin/analytics/yearly?year=${yearInput}`);
      setYearly(res.data);
    } catch (err) {
      toast.error("Failed to fetch yearly revenue");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "#fff", marginBottom: "20px" }}>Business Analytics</h2>

      {overall && (
        <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
          <StatCard label="Total Revenue (All Time)" value={`₹${overall.totalRevenue}`} />
          <StatCard label="Total Orders (All Time)" value={overall.totalOrders} />
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
        <AnalyticsBlock title="Daily Revenue">
          <input type="date" value={dateInput} onChange={(e) => setDateInput(e.target.value)} style={inputStyle} />
          <button onClick={fetchDaily} style={btnStyle}>Get Revenue</button>
          {daily && <Result data={daily} />}
        </AnalyticsBlock>

        <AnalyticsBlock title="Monthly Revenue">
          <input type="number" placeholder="Month (1-12)" value={monthInput} onChange={(e) => setMonthInput(e.target.value)} style={inputStyle} />
          <input type="number" placeholder="Year" value={yearInputMonthly} onChange={(e) => setYearInputMonthly(e.target.value)} style={inputStyle} />
          <button onClick={fetchMonthly} style={btnStyle}>Get Revenue</button>
          {monthly && <Result data={monthly} />}
        </AnalyticsBlock>

        <AnalyticsBlock title="Yearly Revenue">
          <input type="number" placeholder="Year" value={yearInput} onChange={(e) => setYearInput(e.target.value)} style={inputStyle} />
          <button onClick={fetchYearly} style={btnStyle}>Get Revenue</button>
          {yearly && <Result data={yearly} />}
        </AnalyticsBlock>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={{ backgroundColor: "var(--surface)", padding: "20px", borderRadius: "10px", flex: 1 }}>
      <p style={{ color: "var(--text-muted)", marginBottom: "8px" }}>{label}</p>
      <h2 style={{ color: "var(--accent-green)" }}>{value}</h2>
    </div>
  );
}

function AnalyticsBlock({ title, children }) {
  return (
    <div style={{ backgroundColor: "var(--surface)", padding: "20px", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "10px" }}>
      <h4 style={{ color: "#fff" }}>{title}</h4>
      {children}
    </div>
  );
}

function Result({ data }) {
  return (
    <div style={{ marginTop: "10px", color: "#fff" }}>
      <p>Revenue: <strong style={{ color: "var(--accent-green)" }}>₹{data.totalRevenue}</strong></p>
      <p>Orders: <strong>{data.totalOrders}</strong></p>
    </div>
  );
}

const inputStyle = { padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", backgroundColor: "#1a1a1a", color: "#fff" };
const btnStyle = { padding: "10px", backgroundColor: "var(--accent-green)", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" };