import META from "../constants/meta";

export default function Header({ page }) {
  return (
    <header style={{
      padding: "18px 32px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      borderBottom: "1px solid rgba(255,255,255,.06)",
      background: "rgba(11,17,32,.9)", backdropFilter: "blur(14px)",
      flexShrink: 0,
    }}>
      <h1 style={{
        margin: 0, fontSize: 20, fontWeight: 800,
        color: "#f1f5f9", letterSpacing: "-0.5px",
      }}>
        {META[page]}
      </h1>

      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        background: "linear-gradient(135deg,#38bdf8,#6366f1)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 800, fontSize: 14, cursor: "pointer", color: "#fff",
      }}>A</div>
    </header>
  );
}