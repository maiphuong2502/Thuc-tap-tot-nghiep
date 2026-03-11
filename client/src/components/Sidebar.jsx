const NAV = [
  { id: "dashboard", icon: "⊞",  label: "Tổng quan" },
  { id: "users",     icon: "👥", label: "Quản lý tài khoản" },
  { id: "skill",     icon: "🎯", label: "Quản lý kỹ năng" },
  { id: "examtype",  icon: "📋", label: "Quản lý loại đề thi" },
  { id: "examset",   icon: "📚", label: "Quản lý bộ đề" },
  { id: "tag",       icon: "🏷️", label: "Quản lý tag chủ đề" },
  { id: "question",  icon: "❓", label: "Quản lý câu hỏi" },
  { id: "answer",    icon: "✅", label: "Quản lý đáp án" },
  { id: "result",    icon: "📊", label: "Quản lý kết quả" },
];

export default function Sidebar({ page, setPage, collapsed, setCollapsed }) {
  return (
    <aside style={{
      width: collapsed ? 68 : 238,
      minWidth: collapsed ? 68 : 238,
      background: "linear-gradient(180deg,#111827 0%,#0b1120 100%)",
      borderRight: "1px solid rgba(255,255,255,.06)",
      display: "flex",
      flexDirection: "column",
      transition: "all .3s ease",
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? "22px 15px" : "22px 20px",
        display: "flex", alignItems: "center", gap: 12,
        borderBottom: "1px solid rgba(255,255,255,.06)",
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 11, flexShrink: 0,
          background: "linear-gradient(135deg,#38bdf8,#6366f1)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
        }}>🎓</div>
        {!collapsed && (
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: "#f1f5f9", letterSpacing: "-0.4px" }}>QLThiTA</div>
            <div style={{ fontSize: 10, color: "#475569" }}>Admin Panel</div>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "14px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV.map(item => {
          const active = page === item.id;
          return (
            <button key={item.id} onClick={() => setPage(item.id)} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: collapsed ? "11px 0" : "10px 14px",
              justifyContent: collapsed ? "center" : "flex-start",
              borderRadius: 10, border: "none", cursor: "pointer",
              background: active ? "rgba(56,189,248,.12)" : "transparent",
              color: active ? "#38bdf8" : "#64748b",
              fontSize: 13, fontWeight: active ? 700 : 400,
              transition: "all .18s",
              boxShadow: active ? "inset 3px 0 0 #38bdf8" : "none",
            }}>
              <span style={{ fontSize: 17, flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Collapse button */}
      <div style={{ padding: "14px 10px", borderTop: "1px solid rgba(255,255,255,.06)" }}>
        <button onClick={() => setCollapsed(!collapsed)} style={{
          width: "100%", padding: "9px", borderRadius: 10,
          border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.04)",
          color: "#475569", cursor: "pointer", fontSize: 13,
        }}>
          {collapsed ? "→" : "← Thu gọn"}
        </button>
      </div>
    </aside>
  );
}