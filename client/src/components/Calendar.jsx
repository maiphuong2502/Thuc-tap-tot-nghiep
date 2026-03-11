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
      background: "rgba(255,255,255,.03)",
      border: "1px solid rgba(255,255,255,.07)",
      borderRadius: 18, padding: 28,
    }}>
      {/* Header tháng */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <button
          onClick={() => setCurrent(new Date(year, month - 1, 1))}
          style={{
            width: 34, height: 34, borderRadius: 9,
            border: "1px solid rgba(255,255,255,.1)",
            background: "rgba(255,255,255,.05)",
            color: "#94a3b8", cursor: "pointer", fontSize: 18, lineHeight: 1,
          }}>‹</button>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9" }}>
          Tháng {month + 1} năm {year}
        </div>
        <button
          onClick={() => setCurrent(new Date(year, month + 1, 1))}
          style={{
            width: 34, height: 34, borderRadius: 9,
            border: "1px solid rgba(255,255,255,.1)",
            background: "rgba(255,255,255,.05)",
            color: "#94a3b8", cursor: "pointer", fontSize: 18, lineHeight: 1,
          }}>›</button>
      </div>

      {/* Tên ngày trong tuần */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 10 }}>
        {DAYS.map(d => (
          <div key={d} style={{
            textAlign: "center", fontSize: 12, fontWeight: 600,
            color: d === "CN" || d === "T7" ? "#f87171" : "#475569",
            padding: "4px 0",
          }}>{d}</div>
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
            <div key={i} style={{
              height: 44, borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: isToday ? 700 : 400,
              cursor: "default",
              border:      isToday ? "2px solid #38bdf8" : "1px solid transparent",
              background:  isToday ? "rgba(56,189,248,.15)" : "transparent",
              color:       isToday ? "#38bdf8" : isWeekend ? "#f87171" : "#94a3b8",
              transition: "background .15s",
            }}
              onMouseEnter={e => { if (!isToday) e.currentTarget.style.background = "rgba(255,255,255,.05)"; }}
              onMouseLeave={e => { if (!isToday) e.currentTarget.style.background = "transparent"; }}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}