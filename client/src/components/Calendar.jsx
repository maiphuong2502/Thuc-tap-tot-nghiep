import { useState } from "react";

const DAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export default function Calendar() {
  const realToday = new Date();
  const [current, setCurrent] = useState(
    new Date(realToday.getFullYear(), realToday.getMonth(), 1)
  );

  const year        = current.getFullYear();
  const month       = current.getMonth();
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid rgba(209,213,219,1)",
      borderRadius: 18,
      padding: 24,
      boxShadow: "0 10px 25px rgba(15,23,42,.04)",
    }}>
      {/* Header tháng */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <button
          onClick={() => setCurrent(new Date(year, month - 1, 1))}
          style={{
            width: 32,
            height: 32,
            borderRadius: 999,
            border: "1px solid rgba(209,213,219,1)",
            background: "#f9fafb",
            color: "#4b5563",
            cursor: "pointer",
            fontSize: 18,
            lineHeight: 1,
          }}>‹</button>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>
          Tháng {month + 1} năm {year}
        </div>
        <button
          onClick={() => setCurrent(new Date(year, month + 1, 1))}
          style={{
            width: 32,
            height: 32,
            borderRadius: 999,
            border: "1px solid rgba(209,213,219,1)",
            background: "#f9fafb",
            color: "#4b5563",
            cursor: "pointer",
            fontSize: 18,
            lineHeight: 1,
          }}>›</button>
      </div>

      {/* Tên ngày trong tuần */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 10 }}>
        {DAYS.map(d => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontSize: 12,
              fontWeight: 600,
              color: d === "CN" || d === "T7" ? "#dc2626" : "#6b7280",
              padding: "4px 0",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Ô ngày */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const dow       = (firstDay + day - 1) % 7;
          const isWeekend = dow === 0 || dow === 6;
          const isToday   =
            day === realToday.getDate() &&
            month === realToday.getMonth() &&
            year  === realToday.getFullYear();

          return (
            <div
              key={i}
              style={{
                height: 40,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: isToday ? 700 : 400,
                cursor: "default",
                border: isToday
                  ? "2px solid #2563eb"
                  : "1px solid rgba(229,231,235,1)",
                background: isToday ? "#dbeafe" : "#ffffff",
                color: isToday
                  ? "#1d4ed8"
                  : isWeekend
                  ? "#dc2626"
                  : "#374151",
                transition: "background .15s, color .15s, border-color .15s",
              }}
              onMouseEnter={(e) => {
                if (!isToday) {
                  e.currentTarget.style.background = "#f3f4f6";
                }
              }}
              onMouseLeave={(e) => {
                if (!isToday) {
                  e.currentTarget.style.background = "#ffffff";
                }
              }}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}