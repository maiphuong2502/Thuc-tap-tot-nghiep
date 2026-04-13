import { useState } from "react";
import authService from "../../services/authService";
import { useNavigate } from "react-router-dom";

// ─── helpers ─────────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {label}
      </span>
      <span style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>
        {value || "—"}
      </span>
    </div>
  );
}

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column", gap: 4,
      alignItems: "center", padding: "16px 8px",
      background: "#f8fafc", borderRadius: 14, border: "1px solid #e9ecf0",
    }}>
      <span style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{value}</span>
      <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, textAlign: "center" }}>{label}</span>
    </div>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function UserProfile() {
  const navigate = useNavigate();

  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); }
    catch { return null; }
  })();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    username: storedUser?.username || "",
    email: storedUser?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saveMsg, setSaveMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const avatarLetter = (storedUser?.username || "H").charAt(0).toUpperCase();
  const joinedDate = storedUser?.created_at
    ? new Date(storedUser.created_at).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
    : "—";

  const handleChange = (field: string, val: string) => {
    setForm(p => ({ ...p, [field]: val }));
    setSaveMsg(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setSaveMsg({ type: "err", text: "Mật khẩu xác nhận không khớp." });
      return;
    }
    setSaving(true);
    setSaveMsg(null);
    try {
      // TODO: gọi API cập nhật khi backend sẵn sàng
      // await userService.update(storedUser.user_id, { username: form.username, email: form.email, ... });
      const updated = { ...storedUser, username: form.username, email: form.email };
      localStorage.setItem("user", JSON.stringify(updated));
      setSaveMsg({ type: "ok", text: "Đã cập nhật hồ sơ thành công." });
      setEditing(false);
    } catch {
      setSaveMsg({ type: "err", text: "Không thể lưu thay đổi. Vui lòng thử lại." });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try { await authService.logout(); } catch { /* ignore */ }
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 860, margin: "0 auto" }}>

      {/* ── Header card ─────────────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(120deg,#1e40af 0%,#2563eb 60%,#3b82f6 100%)",
        borderRadius: 20,
        padding: "32px 36px",
        display: "flex",
        alignItems: "center",
        gap: 28,
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(37,99,235,.2)",
      }}>
        {/* decor */}
        <div style={{ position: "absolute", right: -50, top: -50, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,.05)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 160, bottom: -70, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,.04)", pointerEvents: "none" }} />

        {/* avatar */}
        <div style={{
          width: 80, height: 80, borderRadius: 22, flexShrink: 0,
          background: "rgba(255,255,255,.15)",
          border: "3px solid rgba(255,255,255,.35)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 34, fontWeight: 800, color: "#fff",
          backdropFilter: "blur(4px)",
        }}>
          {avatarLetter}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.65)", fontWeight: 600, letterSpacing: "0.5px", marginBottom: 4 }}>
            HỌC VIÊN
          </div>
          <h2 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.3px" }}>
            {storedUser?.username || "Học viên"}
          </h2>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.75)" }}>
            {storedUser?.email || "—"} · Tham gia {joinedDate}
          </div>
        </div>

        <button
          onClick={() => { setEditing(true); setSaveMsg(null); }}
          style={{
            padding: "10px 20px", borderRadius: 10, border: "1.5px solid rgba(255,255,255,.35)",
            background: "rgba(255,255,255,.12)", color: "#fff",
            fontWeight: 700, fontSize: 13, cursor: "pointer", backdropFilter: "blur(4px)",
            transition: "background .18s", flexShrink: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.22)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.12)"}
        >
          ✏️ Chỉnh sửa
        </button>
      </div>

      {/* ── body grid ────────────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20, alignItems: "start" }}>

        {/* left – info / edit form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* account info */}
          <div style={{ background: "#fff", border: "1px solid #e9ecf0", borderRadius: 18, padding: "28px 32px" }}>
            <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
              Thông tin tài khoản
            </h3>
            {editing ? (
              <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {saveMsg && (
                  <div style={{
                    padding: "10px 14px", borderRadius: 10, fontSize: 13,
                    background: saveMsg.type === "ok" ? "#f0fdf4" : "#fef2f2",
                    border: `1px solid ${saveMsg.type === "ok" ? "#bbf7d0" : "#fecaca"}`,
                    color: saveMsg.type === "ok" ? "#15803d" : "#b91c1c",
                    fontWeight: 600,
                  }}>
                    {saveMsg.text}
                  </div>
                )}

                {[
                  { label: "Tên đăng nhập", field: "username", type: "text" },
                  { label: "Email", field: "email", type: "email" },
                ].map(({ label, field, type }) => (
                  <label key={field} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {label}
                    </span>
                    <input
                      type={type}
                      value={form[field]}
                      onChange={e => handleChange(field, e.target.value)}
                      style={{
                        padding: "10px 14px", borderRadius: 10, fontSize: 14,
                        border: "1.5px solid #e2e8f0", background: "#f8fafc",
                        color: "#0f172a", outline: "none", transition: "border-color .18s",
                      }}
                      onFocus={e => e.currentTarget.style.borderColor = "#3b82f6"}
                      onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"}
                    />
                  </label>
                ))}

                <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#64748b", marginBottom: 12 }}>
                    Đổi mật khẩu (để trống nếu không muốn đổi)
                  </div>
                  {[
                    { label: "Mật khẩu mới", field: "newPassword" },
                    { label: "Xác nhận mật khẩu mới", field: "confirmPassword" },
                  ].map(({ label, field }) => (
                    <label key={field} style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        {label}
                      </span>
                      <input
                        type="password"
                        value={form[field]}
                        onChange={e => handleChange(field, e.target.value)}
                        placeholder="••••••••"
                        style={{
                          padding: "10px 14px", borderRadius: 10, fontSize: 14,
                          border: "1.5px solid #e2e8f0", background: "#f8fafc",
                          color: "#0f172a", outline: "none",
                        }}
                        onFocus={e => e.currentTarget.style.borderColor = "#3b82f6"}
                        onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"}
                      />
                    </label>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={() => { setEditing(false); setSaveMsg(null); }}
                    style={{
                      padding: "10px 20px", borderRadius: 10, border: "1.5px solid #e2e8f0",
                      background: "#fff", color: "#475569", fontWeight: 600, fontSize: 13, cursor: "pointer",
                    }}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      padding: "10px 24px", borderRadius: 10, border: "none",
                      background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: 13,
                      cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1,
                    }}
                  >
                    {saving ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <InfoRow label="Tên đăng nhập" value={storedUser?.username} />
                <InfoRow label="Email" value={storedUser?.email} />
                <InfoRow label="Vai trò" value="Học viên" />
                <InfoRow label="Trạng thái" value="Đang hoạt động" />
                <InfoRow label="Ngày tham gia" value={joinedDate} />
                <InfoRow label="Mã học viên" value={storedUser?.user_id || "—"} />
              </div>
            )}
          </div>
        </div>

        {/* right col */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* quick stats */}
          <div style={{ background: "#fff", border: "1px solid #e9ecf0", borderRadius: 18, padding: "22px" }}>
            <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Tổng kết học tập</h3>
            <div style={{ display: "flex", gap: 10 }}>
              <StatBadge value="0" label="Bài đã làm" />
              <StatBadge value="—" label="Band score" />
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <StatBadge value="0h" label="Giờ học" />
              <StatBadge value="—" label="Tỷ lệ đúng" />
            </div>
          </div>

          {/* band per skill */}
          <div style={{ background: "#fff", border: "1px solid #e9ecf0", borderRadius: 18, padding: "22px" }}>
            <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Band theo kỹ năng</h3>
            {[
              { icon: "🎧", label: "Listening", color: "#3b82f6" },
              { icon: "📖", label: "Reading",   color: "#10b981" },
              { icon: "✍️", label: "Writing",   color: "#f59e0b" },
              { icon: "🎙️", label: "Speaking",  color: "#8b5cf6" },
            ].map(s => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: "1px solid #f8fafc" }}>
                <span style={{ fontSize: 18, width: 26, textAlign: "center" }}>{s.icon}</span>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#334155" }}>{s.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#cbd5e1" }}>—</span>
              </div>
            ))}
          </div>

          {/* danger zone */}
          <div style={{ background: "#fff", border: "1px solid #fee2e2", borderRadius: 18, padding: "22px" }}>
            <h3 style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 700, color: "#dc2626" }}>Khác</h3>
            <button
              onClick={handleLogout}
              style={{
                width: "100%", padding: "10px", borderRadius: 10,
                border: "1.5px solid #fecaca", background: "#fff9f9",
                color: "#ef4444", fontWeight: 700, fontSize: 13, cursor: "pointer",
                transition: "all .18s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.borderColor = "#f87171"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff9f9"; e.currentTarget.style.borderColor = "#fecaca"; }}
            >
              Đăng xuất khỏi hệ thống
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
