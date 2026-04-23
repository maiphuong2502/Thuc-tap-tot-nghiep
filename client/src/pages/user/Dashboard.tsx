import React, { useState, useEffect } from "react";
import Calendar from "../../components/Calendar";
import dashboardService from "../../services/dashboardService";
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  Radar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

// ─── mini components ────────────────────────────────────────────────────────

function SkillRadarChart({ data, skills }: { data: any[], skills: any[] }) {
  // Map skills data to recharts format
  const chartData = skills.map(s => ({
    subject: s.label,
    A: s.score || 0,
    fullMark: 9,
  }));

  return (
    <div style={{ height: 320, width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis 
             dataKey="subject" 
             tick={{ fill: "#64748b", fontSize: 13, fontWeight: 600 }}
          />
          <Radar
            name="Band Score"
            dataKey="A"
            stroke="#8b5cf6"
            strokeWidth={3}
            fill="#8b5cf6"
            fillOpacity={0.15}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

function BandTrendChart({ trend }: { trend: any[] }) {
  if (!trend || trend.length === 0) {
    return (
        <div style={{ height: 320, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#94a3b8", gap: 12 }}>
            <div style={{ fontSize: 40 }}>📈</div>
            <div style={{ fontSize: 14 }}>Chưa có đủ dữ liệu để hiển thị xu hướng.</div>
        </div>
    );
  }

  return (
    <div style={{ height: 320, width: "100%", padding: "10px 0" }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={trend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="label" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            domain={[0, 9]}
            ticks={[0, 3, 6, 9]}
          />
          <Tooltip 
            contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", fontSize: 13 }}
            itemStyle={{ fontWeight: 800, color: "#4f46e5" }}
            labelStyle={{ color: "#94a3b8", marginBottom: 4 }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#6366f1" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorValue)" 
            dot={{ r: 6, fill: "#fff", stroke: "#6366f1", strokeWidth: 3 }}
            activeDot={{ r: 8, strokeWidth: 0, fill: "#6366f1" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
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

function AnalysisCard({
  icon,
  label,
  value,
  percentage,
  color,
  bgColor,
}: {
  icon: string;
  label: string;
  value: number;
  percentage: number;
  color: string;
  bgColor: string;
}) {
  return (
    <div
      style={{
        background: bgColor,
        border: `1px solid ${color}20`,
        borderRadius: 16,
        padding: "16px 20px",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div style={{ fontSize: 20, color: "#94a3b8" }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: color, lineHeight: 1 }}>{value}</div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#64748b" }}>{label}</div>
        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{percentage}%</div>
      </div>
    </div>
  );
}

function AnalysisProgressBar({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
      <div style={{ width: 80, fontSize: 14, fontWeight: 600, color: "#1e293b", textAlign: "right" }}>{label}</div>
      <div style={{ flex: 1, height: 28, background: "#f1f5f9", borderRadius: 8, position: "relative", overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            paddingLeft: 12,
            transition: "width 0.8s ease",
          }}
        >
          <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>{value} lượt</span>
        </div>
      </div>
    </div>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function UserDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("attempts");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const username = user.username || "Học viên";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashboardService.getStats();
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const hour = new Date().getHours();
  const greeting =
    hour < 5 ? "Đêm khuya rồi" : hour < 12 ? "Chào buổi sáng" : hour < 18 ? "Chào buổi chiều" : "Chào buổi tối";

  const skills = data?.skill_stats || [
    { icon: "🎧", label: "Listening", score: 0, band: "—", color: "#3b82f6", tests: 0, percentage: 0 },
    { icon: "📖", label: "Reading", score: 0, band: "—", color: "#10b981", tests: 0, percentage: 0 },
    { icon: "✍️", label: "Writing", score: 0, band: "—", color: "#f59e0b", tests: 0, percentage: 0 },
    { icon: "🎙️", label: "Speaking", score: 0, band: "—", color: "#8b5cf6", tests: 0, percentage: 0 },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: '#64748b', fontWeight: 600 }}>
        Đang tải dữ liệu học tập...
      </div>
    );
  }

  const hasBandScore = data && data.average_band > 0;

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
            {hasBandScore ? `Band Score hiện tại: ${data.average_band}` : "Bạn chưa có điểm band score."}
          </h2>
          <p style={{ margin: "0 0 20px", fontSize: 13.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, maxWidth: 460 }}>
            {hasBandScore 
              ? "Tuyệt vời! Tiếp tục rèn luyện để nâng cao trình độ và đạt mục tiêu đề ra nhé." 
              : "Hoàn thành ít nhất bài thi thử để hệ thống xác định trình độ và lên lộ trình luyện tập cá nhân hoá cho bạn."
            }
          </p>
          <button
            onClick={() => window.location.href = "/user/exams"}
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
        <StatCard icon="📄" label="Bài đã làm" value={data?.total_tests?.toString() || "0"} sub="Từ trước tới nay" accent="#3b82f6" />
        <StatCard icon="🎯" label="Tỷ lệ đúng" value={data?.accuracy ? `${data.accuracy}%` : "—"} sub="Trung bình" accent="#10b981" />
        <StatCard icon="⏱" label="Thời gian học" value="0.5 h" sub="Tuần này" accent="#f59e0b" />
        <StatCard icon="⭐" label="Band dự kiến" value={data?.average_band?.toString() || "—"} sub="Trên 9.0" accent="#8b5cf6" />
      </div>

      {/* ── grid: skills + calendar    analysis ───────────────────────── */}
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
            {skills.map((s: any) => (
              <SkillRow key={s.label} {...s} />
            ))}
            <div style={{ paddingTop: 4 }}></div>
          </div>

          {/* learning analysis replacement */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e9ecf0",
              borderRadius: 18,
              padding: "24px 28px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#1e293b", display: "flex", alignItems: "center", gap: 8 }}>
                  📊 Phân tích học tập
                </h3>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
                  Toàn bộ lịch sử · Cập nhật {data?.update_date || "—"}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ background: "#f0f7ff", color: "#2563eb", padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                  🔥 {data?.tests_this_week || 0} bài / tuần
                </div>
                <div style={{ background: "#f0fdf4", color: "#16a34a", padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                  ⬆️ Band {data?.average_band || "—"}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 12, background: "#f8fafc", padding: "6px", borderRadius: 12, marginBottom: 24, width: "fit-content" }}>
              {["attempts", "skills", "trend"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: "none",
                    background: activeTab === tab ? "#fff" : "transparent",
                    color: activeTab === tab ? "#1e293b" : "#64748b",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: activeTab === tab ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
                    transition: "all 0.2s",
                  }}
                >
                  {tab === "attempts" ? "Tổng lượt làm bài" : tab === "skills" ? "Kỹ năng" : "Xu hướng band"}
                </button>
              ))}
            </div>

            {/* Content for attempts tab */}
            {activeTab === "attempts" && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, marginBottom: 32 }}>
                  <AnalysisCard icon="🎧" label="Listening" value={skills[0].tests} percentage={skills[0].percentage} color="#3b82f6" bgColor="#f0f7ff" />
                  <AnalysisCard icon="📖" label="Reading" value={skills[1].tests} percentage={skills[1].percentage} color="#10b981" bgColor="#f0fdf4" />
                  <AnalysisCard icon="✍️" label="Writing" value={skills[2].tests} percentage={skills[2].percentage} color="#f59e0b" bgColor="#fffbeb" />
                  <AnalysisCard icon="🎙️" label="Speaking" value={skills[3].tests} percentage={skills[3].percentage} color="#8b5cf6" bgColor="#f5f3ff" />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <AnalysisProgressBar label="Listening" value={skills[0].tests} total={data?.total_attempts_all_skills} color="#3b82f6" />
                  <AnalysisProgressBar label="Reading" value={skills[1].tests} total={data?.total_attempts_all_skills} color="#10b981" />
                  <AnalysisProgressBar label="Writing" value={skills[2].tests} total={data?.total_attempts_all_skills} color="#f59e0b" />
                  <AnalysisProgressBar label="Speaking" value={skills[3].tests} total={data?.total_attempts_all_skills} color="#8b5cf6" />
                </div>

                <div style={{ textAlign: "right", color: "#94a3b8", fontSize: 13, fontWeight: 600, marginTop: 12 }}>
                  Tổng cộng: <span style={{ color: "#1e293b", fontSize: 15 }}>{data?.total_attempts_all_skills || 0} lượt</span>
                </div>
              </>
            )}

            {activeTab === "skills" && (
                <SkillRadarChart data={[]} skills={skills} />
            )}

            {activeTab === "trend" && (
                <BandTrendChart trend={data?.band_trend || []} />
            )}
          </div>
        </div>

        {/* right col: calendar + recent */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Calendar />

          {/* recent tests block */}
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
            {data?.recent_results?.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {data.recent_results.map((res: any) => (
                        <div key={res.result_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{res.test?.title || "IELTS Test"}</div>
                                <div style={{ fontSize: 11, color: "#94a3b8" }}>{new Date(res.created_at).toLocaleDateString("vi-VN")}</div>
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 800, color: "#2563eb" }}>{res.band_score}</div>
                        </div>
                    ))}
                </div>
            ) : (
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
                    <span onClick={() => window.location.href='/user/exams'} style={{ color: "#2563eb", fontWeight: 600, cursor: "pointer" }}>
                    Bắt đầu bài đầu tiên →
                    </span>
                </p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
