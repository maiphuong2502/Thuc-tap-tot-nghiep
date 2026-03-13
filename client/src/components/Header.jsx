import META from "../constants/meta";

export default function Header({ page }) {
  return (
    <header style={{
      padding: "18px 32px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      borderBottom: "1px solid rgba(226,232,240,1)",
      background: "rgba(255,255,255,.9)", backdropFilter: "blur(14px)",
      flexShrink: 0,
    }}>
      <h1 style={{
        margin: 0, fontSize: 20, fontWeight: 800,
        color: "#0f172a", letterSpacing: "-0.5px",
      }}>
        {META[page]}
      </h1>

      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        background: "linear-gradient(135deg,#3b82f6,#6366f1)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 800, fontSize: 14, cursor: "pointer", color: "#fff",
      }}>A</div>
    </header>
  );
}