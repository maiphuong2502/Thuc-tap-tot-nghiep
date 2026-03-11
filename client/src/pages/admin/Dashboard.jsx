import { useState, useEffect, useRef } from "react";
import Calendar from "../../components/Calendar";

/* ── WMO weather code map ───────────────────────────────────────── */
const WMO_MAP = {
  0:  { desc: "Trời quang",           icon: "☀️" },
  1:  { desc: "Chủ yếu quang",        icon: "🌤" },
  2:  { desc: "Có mây rải rác",       icon: "⛅" },
  3:  { desc: "Trời nhiều mây",       icon: "☁️" },
  45: { desc: "Sương mù",             icon: "🌫" },
  48: { desc: "Sương mù đóng băng",   icon: "🌫" },
  51: { desc: "Mưa phùn nhẹ",         icon: "🌦" },
  53: { desc: "Mưa phùn vừa",         icon: "🌦" },
  55: { desc: "Mưa phùn dày",         icon: "🌧" },
  61: { desc: "Mưa nhẹ",             icon: "🌧" },
  63: { desc: "Mưa vừa",             icon: "🌧" },
  65: { desc: "Mưa to",              icon: "🌧" },
  80: { desc: "Mưa rào nhẹ",         icon: "🌦" },
  81: { desc: "Mưa rào vừa",         icon: "🌧" },
  82: { desc: "Mưa rào mạnh",        icon: "⛈" },
  95: { desc: "Giông bão",           icon: "⛈" },
  99: { desc: "Giông kèm mưa đá",    icon: "⛈" },
};
const wmo = (code) => WMO_MAP[code] ?? { desc: "Không rõ", icon: "🌡" };

const DAY_NAMES = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const getNextDayLabels = (n) =>
  Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + 1 + i);
    return DAY_NAMES[d.getDay()];
  });

/* ── pure async fetcher (no React) ─────────────────────────────── */
async function fetchWeatherData(lat, lon) {
  const [geoRes, wxRes] = await Promise.all([
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=vi`),
    fetch(
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,apparent_temperature,weathercode,windspeed_10m,relativehumidity_2m,precipitation_probability,visibility` +
      `&daily=weathercode,temperature_2m_max,temperature_2m_min` +
      `&timezone=auto&forecast_days=6`
    ),
  ]);
  const geoData = await geoRes.json();
  const wxData  = await wxRes.json();

  const addr = geoData.address ?? {};
  const city = [
    addr.quarter || addr.suburb || addr.village || addr.town || addr.city_district,
    addr.city    || addr.county || addr.state,
    addr.country,
  ].filter(Boolean).join(", ");

  const c    = wxData.current;
  const d    = wxData.daily;
  const days = getNextDayLabels(5);

  return {
    city,
    temp:  Math.round(c.temperature_2m),
    feels: Math.round(c.apparent_temperature),
    code:  c.weathercode,
    wind:  Math.round(c.windspeed_10m),
    humid: c.relativehumidity_2m,
    rain:  c.precipitation_probability ?? 0,
    vis:   c.visibility != null ? (c.visibility / 1000).toFixed(0) : "—",
    forecast: days.map((day, i) => ({
      day,
      code: d.weathercode[i + 1],
      hi:   Math.round(d.temperature_2m_max[i + 1]),
      lo:   Math.round(d.temperature_2m_min[i + 1]),
    })),
    updAt: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
  };
}

/* ── WeatherWidget ──────────────────────────────────────────────── */
const cardStyle = {
  background: "linear-gradient(135deg,#162440 0%,#0e1c35 60%,#131428 100%)",
  border: "1px solid rgba(148,193,255,.1)",
  borderRadius: 16, padding: 22,
  position: "relative", overflow: "hidden",
};

function WeatherWidget() {
  const [status, setStatus] = useState("loading");
  const [data,   setData]   = useState(null);
  const [error,  setError]  = useState(null);
  const didFetch = useRef(false);

  // useRef flag prevents double-fetch (React StrictMode) and satisfies
  // the ESLint rule — setState is only called inside async callbacks,
  // never synchronously in the effect body.
  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    // if (!navigator.geolocation) {
    //   setError("Trình duyệt không hỗ trợ định vị.");
    //   setStatus("error");
    //   return;
    // }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeatherData(pos.coords.latitude, pos.coords.longitude)
          .then((result) => {
            setData(result);
            setStatus("done");
          })
          .catch(() => {
            setError("Không thể tải dữ liệu thời tiết.");
            setStatus("error");
          });
      },
      () => {
        setError("Vui lòng cho phép truy cập vị trí trong trình duyệt.");
        setStatus("error");
      }
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRetry = () => {
    didFetch.current = false;
    setStatus("loading");
    setData(null);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeatherData(pos.coords.latitude, pos.coords.longitude)
          .then((result) => { setData(result); setStatus("done"); })
          .catch(() => { setError("Không thể tải dữ liệu thời tiết."); setStatus("error"); });
      },
      () => { setError("Vui lòng cho phép truy cập vị trí trong trình duyệt."); setStatus("error"); }
    );
  };

  /* loading */
  if (status === "loading") return (
    <div style={cardStyle}>
      <div style={{ textAlign: "center", color: "#7a90b0", padding: "32px 0" }}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>🌐</div>
        <div style={{ fontSize: 13 }}>Đang lấy vị trí &amp; thời tiết...</div>
      </div>
    </div>
  );

  /* error */
  if (status === "error") return (
    <div style={cardStyle}>
      <div style={{ textAlign: "center", color: "#7a90b0", padding: "28px 0" }}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>📍</div>
        <div style={{ fontSize: 13, marginBottom: 14 }}>{error}</div>
        <button
          onClick={handleRetry}
          style={{
            padding: "7px 18px", borderRadius: 20, fontSize: 12, fontWeight: 600,
            background: "rgba(56,189,248,.12)", color: "#38bdf8",
            border: "1px solid rgba(56,189,248,.22)", cursor: "pointer",
          }}
        >Thử lại</button>
      </div>
    </div>
  );

  /* done */
  const { desc, icon } = wmo(data.code);

  return (
    <div style={cardStyle}>
      <div style={{
        position: "absolute", top: -40, right: -40,
        width: 180, height: 180, borderRadius: "50%",
        background: "radial-gradient(circle,rgba(251,191,36,.07) 0%,transparent 65%)",
        pointerEvents: "none",
      }} />
      <div style={{ position: "relative" }}>

        {/* city + icon */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: "#7a90b0", marginBottom: 3 }}>📍 Vị trí hiện tại</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#f1f5f9", maxWidth: 180 }}>{data.city}</div>
          </div>
          <div style={{ fontSize: 46, lineHeight: 1 }}>{icon}</div>
        </div>

        {/* temp */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 6 }}>
          <div style={{
            fontSize: 52, fontWeight: 800, lineHeight: 1,
            background: "linear-gradient(135deg,#fbbf24,#f97316)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            {data.temp}<sup style={{ fontSize: 20 }}>°C</sup>
          </div>
          <div style={{ paddingBottom: 8 }}>
            <div style={{ fontSize: 10.5, color: "#7a90b0" }}>Cảm giác như</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#cbd5e1" }}>{data.feels}°C</div>
          </div>
        </div>

        <div style={{ fontSize: 13.5, color: "#cbd5e1", fontWeight: 500, marginBottom: 16 }}>{desc}</div>

        {/* stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
          {[
            { label: "💧 Độ ẩm",        val: `${data.humid}%`    },
            { label: "💨 Gió",           val: `${data.wind} km/h` },
            { label: "🌧 Xác suất mưa", val: `${data.rain}%`     },
            { label: "👁 Tầm nhìn",      val: `${data.vis} km`    },
          ].map((s) => (
            <div key={s.label} style={{
              background: "rgba(255,255,255,.04)",
              border: "1px solid rgba(148,193,255,.1)",
              borderRadius: 10, padding: "9px 11px",
            }}>
              <div style={{ fontSize: 10, color: "#7a90b0", marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "#f1f5f9" }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* 5-day forecast */}
        <div style={{ display: "flex", gap: 7 }}>
          {data.forecast.map((f) => {
            const fw = wmo(f.code);
            return (
              <div key={f.day} style={{
                flex: 1, background: "rgba(255,255,255,.04)",
                border: "1px solid rgba(148,193,255,.1)",
                borderRadius: 10, padding: "8px 4px", textAlign: "center",
              }}>
                <div style={{ fontSize: 10, color: "#7a90b0", marginBottom: 3 }}>{f.day}</div>
                <div style={{ fontSize: 17, marginBottom: 3 }}>{fw.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#f1f5f9" }}>{f.hi}°</div>
                <div style={{ fontSize: 10.5, color: "#7a90b0" }}>{f.lo}°</div>
              </div>
            );
          })}
        </div>

        <div style={{ fontSize: 10, color: "#7a90b0", marginTop: 10, textAlign: "right" }}>
          Cập nhật: {data.updAt} · {new Date().toLocaleDateString("vi-VN")}
        </div>
      </div>
    </div>
  );
}

/* ── Dashboard ──────────────────────────────────────────────────── */
export default function Dashboard() {
  const hour     = new Date().getHours();
  const greeting = hour < 12 ? "Chào buổi sáng" : hour < 18 ? "Chào buổi chiều" : "Chào buổi tối";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

      {/* Welcome banner */}
      <div style={{
        background: "linear-gradient(135deg,rgba(56,189,248,.15) 0%,rgba(99,102,241,.1) 100%)",
        border: "1px solid rgba(56,189,248,.22)",
        borderRadius: 18, padding: "28px 32px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -50, right: -50,
          width: 200, height: 200, borderRadius: "50%",
          background: "rgba(56,189,248,.07)", pointerEvents: "none",
        }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 13, color: "#38bdf8", fontWeight: 600, marginBottom: 6 }}>
            {greeting} 👋
          </div>
          <h2 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.5px" }}>
            Chào mừng trở lại, <span style={{ color: "#38bdf8" }}>Admin</span>!
          </h2>
          <p style={{ margin: "0 0 18px", fontSize: 14, color: "#94a3b8", lineHeight: 1.7, maxWidth: 500 }}>
            Đây là trang quản trị hệ thống{" "}
            <strong style={{ color: "#cbd5e1" }}>Quản lý Thi Tiếng Anh</strong>.
            Sử dụng menu bên trái để quản lý bộ đề, câu hỏi, đáp án và kết quả thi.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div style={{
              padding: "6px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600,
              background: "rgba(56,189,248,.12)", color: "#38bdf8",
              border: "1px solid rgba(56,189,248,.22)",
            }}>
              📅 {new Date().toLocaleDateString("vi-VN", {
                weekday: "long", day: "2-digit", month: "2-digit", year: "numeric",
              })}
            </div>
            <div style={{
              padding: "6px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600,
              background: "rgba(52,211,153,.1)", color: "#34d399",
              border: "1px solid rgba(52,211,153,.2)",
            }}>
              🟢 Hệ thống hoạt động bình thường
            </div>
          </div>
        </div>
      </div>

      {/* Calendar + Weather */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 300px",
        gap: 20,
        alignItems: "start",
      }}>
        <Calendar />
        <WeatherWidget />
      </div>

    </div>
  );
}