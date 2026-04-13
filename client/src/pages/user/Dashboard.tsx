import { useState } from "react";
import Calendar from "../../components/Calendar";

// ─── mini components ────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: string;
  label: string;
  value: string;
  sub: string;
  accent: string;
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e9ecf0",
        borderRadius: 16,
        padding: "20px 22px",
        display: "flex",
        gap: 16,
        alignItems: "center",
        flex: 1,
        minWidth: 0,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: accent + "18",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", lineHeight: 1.2 }}>
          {value}
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginTop: 2 }}>{label}</div>
        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>{sub}</div>
      </div>
    </div>
  );
}

function SkillRow({
  icon,
  label,
  score,
  band,
  color,
  tests,
}: {
  icon: string;
  label: string;
  score: number;
  band: string;
  color: string;
  tests: number;
}) {
  const pct = Math.min(100, (score / 9) * 100);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 0",
        borderBottom: "1px solid #f1f5f9",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: color + "18",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{label}</span>
          <span style={{ fontSize: 12, color: "#64748b" }}>
            {tests > 0 ? `${tests} bài · Band ${band}` : "Chưa có bài thi"}
          </span>
        </div>
        <div style={{ height: 5, background: "#f1f5f9", borderRadius: 99 }}>
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              background: color,
              borderRadius: 99,
              transition: "width 0.6s ease",
            }}
          />
        </div>
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 800,
          color: tests > 0 ? color : "#cbd5e1",
          width: 32,
          textAlign: "right",
          flexShrink: 0,
        }}
      >
        {tests > 0 ? band : "—"}
      </div>
    </div>
  );
}

function SuggestionRow({
  tag,
  tagColor,
  title,
  duration,
  level,
}: {
  tag: string;
  tagColor: string;
  title: string;
  duration: string;
  level: string;
}) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 14px",
        borderRadius: 12,
        background: hover ? "#f8faff" : "transparent",
        cursor: "pointer",
        transition: "background 0.15s",
        border: "1px solid " + (hover ? "#dbeafe" : "transparent"),
      }}
    >
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: 3,
          background: tagColor,
          flexShrink: 0,
          marginTop: 1,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", marginBottom: 2 }}>
          {title}
        </div>
        <div style={{ fontSize: 11, color: "#94a3b8" }}>
          {tag} · {duration} · {level}
        </div>
      </div>
      <svg width="14" height="14" fill="none" stroke="#c0cad5" strokeWidth="2">
        <path d="M5 3l4 4-4 4" />
      </svg>
    </div>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function UserDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const username = user.username || "Học viên";

  const hour = new Date().getHours();
  const greeting =
    hour < 5 ? "Đêm khuya rồi" : hour < 12 ? "Chào buổi sáng" : hour < 18 ? "Chào buổi chiều" : "Chào buổi tối";

  const skills = [
    { icon: "🎧", label: "Listening", score: 0, band: "—", color: "#3b82f6", tests: 0 },
    { icon: "📖", label: "Reading", score: 0, band: "—", color: "#10b981", tests: 0 },
    { icon: "✍️", label: "Writing", score: 0, band: "—", color: "#f59e0b", tests: 0 },
    { icon: "🎙️", label: "Speaking", score: 0, band: "—", color: "#8b5cf6", tests: 0 },
  ];

  const suggestions = [
    { tag: "Listening", tagColor: "#3b82f6", title: "Điền vào bảng — Section 2", duration: "25 phút", level: "Cơ bản" },
    { tag: "Reading", tagColor: "#10b981", title: "True / False / Not Given", duration: "20 phút", level: "Trung bình" },
    { tag: "Writing", tagColor: "#f59e0b", title: "Task 1 — Mô tả biểu đồ đường", duration: "40 phút", level: "Cơ bản" },
    { tag: "Speaking", tagColor: "#8b5cf6", title: "Part 1 — Chủ đề gia đình", duration: "10 phút", level: "Cơ bản" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* ── Banner ───────────────────────────────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(120deg, #1e40af 0%, #2563eb 55%, #3b82f6 100%)",
          borderRadius: 20,
          padding: "28px 36px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 24,
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 8px 24px rgba(37, 99, 235, 0.2)",
        }}
      >
        {/* background decor */}
        <div
          style={{
            position: "absolute", right: -60, top: -60,
            width: 240, height: 240, borderRadius: "50%",
            background: "rgba(255,255,255,0.05)", pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute", right: 180, bottom: -80,
            width: 180, height: 180, borderRadius: "50%",
            background: "rgba(255,255,255,0.04)", pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontWeight: 500, marginBottom: 6 }}>
            {greeting}, {username} 👋
          </div>
          <h2
            style={{
              margin: "0 0 10px",
              fontSize: 26,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.5px",
              lineHeight: 1.3,
            }}
          >
            Bạn chưa có điểm band score.
          </h2>
          <p style={{ margin: "0 0 20px", fontSize: 13.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, maxWidth: 460 }}>
            Hoàn thành ít nhất <strong style={{ color: "#fff" }}>1 bài thi thử</strong> để hệ thống xác định
            trình độ và lên lộ trình luyện tập cá nhân hoá cho bạn.
          </p>
          <button
            style={{
              padding: "10px 22px",
              borderRadius: 10,
              border: "none",
              background: "#fff",
              color: "#1d4ed8",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              letterSpacing: "0.1px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#eff6ff")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
          >
            Làm bài ngay →
          </button>
        </div>

        {/* right info block */}
        <div
          style={{
            flexShrink: 0,
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 16,
            padding: "18px 24px",
            textAlign: "center",
            minWidth: 160,
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginBottom: 6, fontWeight: 600, letterSpacing: "0.5px" }}>
            HÔM NAY
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>
            {new Date().toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit" })}
          </div>
          <div
            style={{
              marginTop: 12,
              padding: "5px 10px",
              borderRadius: 8,
              background: "rgba(255,255,255,0.15)",
              fontSize: 11,
              color: "rgba(255,255,255,0.9)",
              fontWeight: 600,
            }}
          >
            🟢 Hệ thống ổn định
          </div>
        </div>
      </div>

      {/* ── 4 stat cards ─────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 16 }}>
        <StatCard icon="📄" label="Bài đã làm" value="0" sub="Chưa có dữ liệu" accent="#3b82f6" />
        <StatCard icon="🎯" label="Tỷ lệ đúng" value="—" sub="Cần ít nhất 1 bài" accent="#10b981" />
        <StatCard icon="⏱" label="Thời gian học" value="0 h" sub="Tuần này" accent="#f59e0b" />
        <StatCard icon="⭐" label="Band dự kiến" value="—" sub="Làm bài để tính" accent="#8b5cf6" />
      </div>

      {/* ── grid: skills + calendar    suggestions ───────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>

        {/* left col */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* skill progress */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e9ecf0",
              borderRadius: 18,
              padding: "24px 28px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Tiến độ 4 kỹ năng</h3>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>Dựa trên bài thi gần nhất</span>
            </div>
            {skills.map((s) => (
              <SkillRow key={s.label} {...s} />
            ))}
            <div style={{ paddingTop: 4 }}></div>
          </div>

          {/* suggestions */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e9ecf0",
              borderRadius: 18,
              padding: "24px 28px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Đề xuất luyện tập hôm nay</h3>
              <button
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#2563eb",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Xem tất cả
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {suggestions.map((s) => (
                <SuggestionRow key={s.title} {...s} />
              ))}
            </div>
          </div>
        </div>

        {/* right col: calendar + recent */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Calendar />

          {/* recent tests empty state */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e9ecf0",
              borderRadius: 18,
              padding: "24px",
            }}
          >
            <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
              Bài thi gần đây
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "24px 0",
                gap: 10,
                color: "#94a3b8",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: "#f8fafc",
                  border: "1.5px dashed #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                }}
              >
                📋
              </div>
              <p style={{ margin: 0, fontSize: 13, textAlign: "center", lineHeight: 1.6 }}>
                Chưa có lịch sử bài thi.
                <br />
                <span style={{ color: "#2563eb", fontWeight: 600, cursor: "pointer" }}>
                  Bắt đầu bài đầu tiên →
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
