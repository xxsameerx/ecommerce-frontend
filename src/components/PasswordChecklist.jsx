export default function PasswordChecklist({ password }) {
  const rules = [
    { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
    { label: "One uppercase letter (A-Z)", test: (pw) => /[A-Z]/.test(pw) },
    { label: "One lowercase letter (a-z)", test: (pw) => /[a-z]/.test(pw) },
    { label: "One number (0-9)", test: (pw) => /[0-9]/.test(pw) },
    { label: "One special character (!@#$%^&*)", test: (pw) => /[!@#$%^&*(),.?":{}|<>]/.test(pw) },
  ];

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: "8px 0 16px", fontSize: "13px" }}>
      {rules.map((rule, idx) => {
        const passed = rule.test(password);
        return (
          <li key={idx} style={{ color: passed ? "var(--accent-green)" : "#888", display: "flex", gap: "6px", marginBottom: "2px" }}>
            <span>{passed ? "✅" : "⭕"}</span>
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
}