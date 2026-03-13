import { useEffect, useState } from "react";
import skillService from "../../services/skillService";

const iconMap = {
  0: "🎧",
  1: "📖",
  2: "✍️",
  3: "🗣️",
};

export default function Skill() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadSkills = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await skillService.list();
      if (res?.success && Array.isArray(res.data)) {
        setSkills(res.data);
      } else {
        setError("Không tải được danh sách kỹ năng.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra khi tải danh sách kỹ năng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');

        .skill-wrap * { box-sizing: border-box; font-family: 'Be Vietnam Pro', sans-serif; }

        .skill-row {
          transition: background 0.15s;
        }
        .skill-row:hover {
          background: #f0f7ff !important;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spinner {
          width: 18px; height: 18px;
          border: 2px solid #dbeafe;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up {
          animation: fadeUp 0.35s ease both;
        }
      `}</style>

      <div className="skill-wrap" style={{ display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Page header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: "#3b82f6", textTransform: "uppercase", marginBottom: 6 }}>
              Hệ thống thi
            </p>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#0f172a", lineHeight: 1.2 }}>
              Kỹ năng tiếng Anh
            </h2>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#94a3b8" }}>
              Danh mục kỹ năng được sử dụng trong bộ đề thi
            </p>
          </div>

          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "8px 16px", borderRadius: 12,
            background: "#eff6ff", border: "1px solid #bfdbfe",
          }}>
            <span style={{ fontSize: 12, color: "#3b82f6", fontWeight: 500 }}>Tổng</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#1d4ed8" }}>{skills.length}</span>
            <span style={{ fontSize: 12, color: "#3b82f6", fontWeight: 500 }}>kỹ năng</span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: "12px 16px", borderRadius: 10,
            background: "#fff1f2", border: "1px solid #fecdd3",
            color: "#be123c", fontSize: 13, display: "flex", alignItems: "center", gap: 8,
          }}>
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Table card */}
        <div style={{
          borderRadius: 16, border: "1px solid #e2e8f0",
          background: "#fff", boxShadow: "0 4px 24px rgba(15,23,42,0.05)",
          overflow: "hidden",
        }}>
          {/* Card top bar */}
          <div style={{
            padding: "14px 20px", borderBottom: "1px solid #f1f5f9",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            background: "#fafcff",
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
              Danh sách kỹ năng
            </span>
            {loading
              ? <span className="spinner" />
              : <span style={{
                  fontSize: 12, color: "#94a3b8", background: "#f1f5f9",
                  padding: "3px 10px", borderRadius: 20,
                }}>Chỉ xem</span>
            }
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["#", "Kỹ năng", "Mô tả"].map((h, i) => (
                    <th key={i} style={{
                      padding: "10px 20px", textAlign: "left",
                      color: "#64748b", fontWeight: 600, fontSize: 12,
                      letterSpacing: "0.05em", textTransform: "uppercase",
                      borderBottom: "1px solid #e2e8f0",
                      width: i === 0 ? 60 : i === 1 ? 200 : "auto",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} style={{ padding: "40px 20px", textAlign: "center", color: "#94a3b8" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                        <span className="spinner" style={{ width: 24, height: 24 }} />
                        <span>Đang tải dữ liệu...</span>
                      </div>
                    </td>
                  </tr>
                ) : skills.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ padding: "48px 20px", textAlign: "center", color: "#94a3b8" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 32 }}>📭</span>
                        <span style={{ fontWeight: 500 }}>Chưa có kỹ năng nào</span>
                        <span style={{ fontSize: 12 }}>Dữ liệu sẽ hiển thị khi được thêm vào hệ thống</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  skills.map((skill, index) => (
                    <tr
                      key={skill.id}
                      className="skill-row fade-up"
                      style={{
                        borderTop: "1px solid #f1f5f9",
                        background: "#fff",
                        animationDelay: `${index * 40}ms`,
                      }}
                    >
                      <td style={{ padding: "13px 20px", color: "#cbd5e1", fontWeight: 600, fontSize: 12 }}>
                        {String(index + 1).padStart(2, "0")}
                      </td>
                      <td style={{ padding: "13px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{
                            fontSize: 18,
                            width: 36, height: 36,
                            borderRadius: 10,
                            background: "#eff6ff",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0,
                          }}>
                            {iconMap[index % 4]}
                          </span>
                          <span style={{ fontWeight: 600, color: "#0f172a" }}>
                            {skill.skill_name}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "13px 20px", color: "#64748b", lineHeight: 1.6 }}>
                        {skill.description || <span style={{ color: "#cbd5e1", fontStyle: "italic" }}>Chưa có mô tả</span>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {!loading && skills.length > 0 && (
            <div style={{
              padding: "10px 20px", borderTop: "1px solid #f1f5f9",
              background: "#fafcff", fontSize: 12, color: "#94a3b8",
              display: "flex", justifyContent: "flex-end",
            }}>
              Hiển thị {skills.length} kỹ năng
            </div>
          )}
        </div>
      </div>
    </>
  );
}