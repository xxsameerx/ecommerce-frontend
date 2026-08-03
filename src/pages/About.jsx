export default function About() {
  return (
    <div style={{ backgroundColor: "#0D0D0D", minHeight: "100vh", padding: "80px 40px", color: "#fff" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "48px", fontWeight: "900", marginBottom: "20px" }}>
          About <span style={{ color: "var(--accent-green)" }}>GameVault</span>
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "18px", lineHeight: "1.8", marginBottom: "24px" }}>
          Founded by gamers, for gamers, GameVault was built on a simple idea: buying games should
          be instant, secure, and genuinely enjoyable. No waiting rooms, no hidden fees — just games,
          delivered the moment you pay.
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: "18px", lineHeight: "1.8", marginBottom: "24px" }}>
          We partner directly with top publishers to bring you legitimate keys and downloads at the
          best prices, backed by secure payment processing and round-the-clock support.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "48px" }}>
          {[
            { title: "🔒 Secure Payments", desc: "Every transaction is encrypted and verified end-to-end." },
            { title: "⚡ Instant Access", desc: "Your library unlocks the second your payment clears." },
            { title: "🎮 Curated Catalog", desc: "Over 1,000 titles across every genre and platform." },
            { title: "💬 Real Support", desc: "A human team, always ready to help." },
          ].map((item) => (
            <div key={item.title} style={{
              backgroundColor: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: "12px", padding: "24px"
            }}>
              <h3 style={{ marginBottom: "8px" }}>{item.title}</h3>
              <p style={{ color: "var(--text-muted)" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}