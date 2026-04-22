import React from "react";
import { useNavigate } from "react-router-dom";

const NAV = [
  { id: "dashboard", icon: "⊞",  label: "Tổng quan" },
  { id: "schedule",  icon: "📅", label: "Lịch thi" },
  { id: "exams",     icon: "📝", label: "Làm Bài Thi" },
  { id: "mock_test", icon: "📝", label: "Bài thi thử" },
  { id: "results",   icon: "📊", label: "Kết quả" },
];

export default function UserSidebar({ page, collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const user = React.useMemo(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); }
    catch { return null; }
  }, []);

  const avatarLetter = (user?.username || "H").charAt(0).toUpperCase();

  return (
    <aside style={{
      width: collapsed ? 68 : 238,
      minWidth: collapsed ? 68 : 238,
      background: "#ffffff",
      borderRight: "1px solid rgba(148,163,184,.4)",
      display: "flex",
      flexDirection: "column",
      transition: "all .3s ease",
      overflow: "hidden",
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? "22px 15px" : "22px 20px",
        display: "flex", alignItems: "center", gap: 12,
        borderBottom: "1px solid rgba(226,232,240,1)",
        flexShrink: 0,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 11, flexShrink: 0,
          background: "linear-gradient(135deg,#38bdf8,#6366f1)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
        }}>🎓</div>
        {!collapsed && (
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: "#0f172a", letterSpacing: "-0.4px" }}>QLThiTA</div>
            <div style={{ fontSize: 10, color: "#64748b" }}>Cổng học viên</div>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "14px 10px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto", overflowX: "hidden" }}>
        {NAV.map(item => {
          const active = page === item.id;
          return (
            <button key={item.id} onClick={() => navigate(`/user/${item.id}`)} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: collapsed ? "11px 0" : "10px 14px",
              justifyContent: collapsed ? "center" : "flex-start",
              borderRadius: 10, border: "none", cursor: "pointer",
              background: active ? "rgba(59,130,246,.12)" : "transparent",
              color: active ? "#2563eb" : "#4b5563",
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

      {/* Bottom: user profile card + collapse */}
      <div style={{ borderTop: "1px solid rgba(226,232,240,1)", padding: "12px 10px", flexShrink: 0 }}>

        {/* Profile mini-card (expanded) */}
        {!collapsed ? (
          <button
            onClick={() => navigate('/user/profile')}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 12, border: "none", cursor: "pointer",
              background: page === "profile" ? "rgba(59,130,246,.10)" : "#f8fafc",
              textAlign: "left", transition: "all .18s", marginBottom: 8,
              outline: page === "profile" ? "2px solid rgba(59,130,246,.4)" : "2px solid transparent",
            }}
            onMouseEnter={e => { if (page !== "profile") e.currentTarget.style.background = "#f1f5f9"; }}
            onMouseLeave={e => { if (page !== "profile") e.currentTarget.style.background = "#f8fafc"; }}
          >
            <div style={{
              width: 34, height: 34, borderRadius: 10, flexShrink: 0,
              background: "linear-gradient(135deg,#3b82f6,#6366f1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: 15, color: "#fff",
            }}>
              {avatarLetter}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.username || "Học viên"}
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>Hồ sơ cá nhân</div>
            </div>
            <svg width="14" height="14" fill="none" stroke="#c0cad5" strokeWidth="2" style={{ flexShrink: 0 }}>
              <path d="M5 3l4 4-4 4" />
            </svg>
          </button>
        ) : (
          /* Profile icon only (collapsed) */
          <button
            onClick={() => navigate('/user/profile')}
            style={{
              width: "100%", padding: "11px 0", borderRadius: 10, border: "none", cursor: "pointer",
              background: page === "profile" ? "rgba(59,130,246,.12)" : "transparent",
              display: "flex", justifyContent: "center", marginBottom: 6, transition: "all .18s",
            }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: "linear-gradient(135deg,#3b82f6,#6366f1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: 14, color: "#fff",
            }}>
              {avatarLetter}
            </div>
          </button>
        )}

        {/* Collapse button */}
        <button onClick={() => setCollapsed(!collapsed)} style={{
          width: "100%", padding: "9px", borderRadius: 10,
          border: "1px solid rgba(148,163,184,.6)", background: "#f9fafb",
          color: "#4b5563", cursor: "pointer", fontSize: 13,
        }}>
          {collapsed ? "→" : "← Thu gọn"}
        </button>
      </div>
    </aside>
  );
}
