export default function Placeholder({ title }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      height: 320, gap: 12,
    }}>
      <div style={{ fontSize: 48 }}>🚧</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: "#64748b" }}>{title}</div>
      <div style={{ fontSize: 13, color: "#475569" }}>Trang này đang được phát triển</div>
    </div>
  );
}