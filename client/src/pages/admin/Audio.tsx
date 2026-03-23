import { useEffect, useState, useRef } from "react";
import audioService from "../../services/audioService";
import { IAudio } from "../../types/audio";

export default function Audio() {
  const [audios, setAudios] = useState<IAudio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAudio, setEditingAudio] = useState<IAudio | null>(null);
  const [formData, setFormData] = useState({ transcript: "" });
  const [file, setFile] = useState<File | null>(null);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadAudios = async (keyword = "") => {
    setLoading(true);
    setError("");
    try {
      const res: any = await audioService.list(keyword);
      if (res?.success && Array.isArray(res.data)) {
        setAudios(res.data);
      } else {
        setError("Không tải được danh sách audio.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Có lỗi xảy ra khi tải danh sách audio.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAudios();
  }, []);

  const handleSearch = () => {
    loadAudios(search);
  };

  const resetFilters = () => {
      setSearch("");
      loadAudios("");
  };

  const openAddModal = () => {
    setEditingAudio(null);
    setFormData({ transcript: "" });
    setFile(null);
    setFormError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsModalOpen(true);
  };

  const openEditModal = (audio: IAudio) => {
    setEditingAudio(audio);
    setFormData({ transcript: audio.transcript || "" });
    setFile(null);
    setFormError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingAudio && !file) {
      setFormError("Vui lòng chọn file audio.");
      return;
    }

    if (file) {
      // Cảnh báo nếu trùng tên file (kiểm tra tên gốc hoặc tên đã được gắn timestamp)
      const isDuplicate = audios.some(a => {
        const existingName = a.audio_file.split('/').pop() || "";
        // So sánh chính xác hoặc so sánh chuỗi kết thúc bằng _filename (vì backend có gắn thêm time()_)
        return existingName === file.name || existingName.endsWith('_' + file.name.replace(/[^a-zA-Z0-9_.-]/g, '_'));
      });

      if (isDuplicate) {
        if (!window.confirm(`⚠️ Cảnh báo: File "${file.name}" dường như đã tồn tại trong hệ thống. Bạn có chắc chắn muốn tiếp tục upload tạo bản sao mới không?`)) {
          return;
        }
      }
    }

    setSaving(true);
    setFormError("");
    try {
      const payload = new FormData();
      if (file) {
        payload.append('audio_file', file);
      }
      if (formData.transcript) {
        payload.append('transcript', formData.transcript);
      }

      if (editingAudio) {
        await audioService.update(editingAudio.audio_id, payload);
      } else {
        await audioService.create(payload);
      }
      setIsModalOpen(false);
      loadAudios(search);
    } catch (err: any) {
      setFormError(err.response?.data?.message || err.response?.data?.error || "Có lỗi xảy ra.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (audio: IAudio) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa audio này?`)) {
      try {
        await audioService.delete(audio.audio_id);
        loadAudios(search);
      } catch (err: any) {
        alert(err.response?.data?.message || "Lỗi khi xóa audio.");
      }
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');

        .audio-wrap * { box-sizing: border-box; font-family: 'Be Vietnam Pro', sans-serif; }

        .audio-row { transition: background 0.15s; }
        .audio-row:hover { background: #f0f7ff !important; }

        @keyframes spin { to { transform: rotate(360deg); } }
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
        .fade-up { animation: fadeUp 0.35s ease both; }
        
        .btn {
          padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer;
          font-weight: 500; font-size: 13px; transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center; gap: 8px;
        }
        .btn-primary { background: #3b82f6; color: white; }
        .btn-primary:hover { background: #2563eb; }
        .btn-secondary { background: #f1f5f9; color: #475569; }
        .btn-secondary:hover { background: #e2e8f0; }
        .btn-danger { background: #fee2e2; color: #ef4444; }
        .btn-danger:hover { background: #fca5a5; }

        .modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(2px);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: white; border-radius: 16px; width: 100%; max-width: 550px;
          padding: 24px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        .search-input {
          padding: 10px 14px; border-radius: 8px; border: 1px solid #cbd5e1; outline: none; transition: border 0.2s; width: 300px;
        }
        .search-input:focus { border-color: #3b82f6; }
      `}</style>

      <div className="audio-wrap" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: "#3b82f6", textTransform: "uppercase", marginBottom: 6 }}>
              Hệ thống thi
            </p>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#0f172a", lineHeight: 1.2 }}>
              Quản lý Audio
            </h2>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#94a3b8" }}>
              Kho file nghe (Listening) dùng để tạo câu hỏi
            </p>
          </div>

          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 8 }}>
                <input 
                    type="text" 
                    placeholder="Tìm kiếm theo file hoặc transcript..." 
                    className="search-input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button className="btn btn-primary" onClick={handleSearch}>🔍 Tìm</button>
                <button className="btn btn-secondary" onClick={resetFilters}>Xóa lọc</button>
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 16px", borderRadius: 12,
              background: "#eff6ff", border: "1px solid #bfdbfe",
            }}>
              <span style={{ fontSize: 12, color: "#3b82f6", fontWeight: 500 }}>Tổng</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#1d4ed8" }}>{audios.length}</span>
              <span style={{ fontSize: 12, color: "#3b82f6", fontWeight: 500 }}>audio</span>
            </div>
            <button className="btn btn-primary" onClick={openAddModal}>
              + Upload Audio
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            padding: "12px 16px", borderRadius: 10,
            background: "#fff1f2", border: "1px solid #fecdd3",
            color: "#be123c", fontSize: 13, display: "flex", alignItems: "center", gap: 8,
          }}>
            <span>⚠️</span> {error}
          </div>
        )}

        <div style={{
          borderRadius: 16, border: "1px solid #e2e8f0",
          background: "#fff", boxShadow: "0 4px 24px rgba(15,23,42,0.05)",
          overflow: "hidden",
        }}>
          <div style={{
            padding: "14px 20px", borderBottom: "1px solid #f1f5f9",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            background: "#fafcff",
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
              Danh sách file nghe
            </span>
            {loading && <span className="spinner" />}
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["ID", "File Audio", "Transcript", "Thao tác"].map((h, i) => (
                    <th key={i} style={{
                      padding: "10px 20px", textAlign: i === 3 ? "right" : "left",
                      color: "#64748b", fontWeight: 600, fontSize: 12,
                      letterSpacing: "0.05em", textTransform: "uppercase",
                      borderBottom: "1px solid #e2e8f0",
                      width: i === 0 ? 60 : i === 1 ? 300 : i === 3 ? 150 : "auto",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} style={{ padding: "40px 20px", textAlign: "center", color: "#94a3b8" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                        <span className="spinner" style={{ width: 24, height: 24 }} />
                        <span>Đang tải dữ liệu...</span>
                      </div>
                    </td>
                  </tr>
                ) : audios.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: "48px 20px", textAlign: "center", color: "#94a3b8" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 32 }}>🎧</span>
                        <span style={{ fontWeight: 500 }}>Chưa có file nghe nào</span>
                        <span style={{ fontSize: 12 }}>Dữ liệu sẽ hiển thị khi bạn upload file mới</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  audios.map((audio, index) => (
                    <tr
                      key={audio.audio_id}
                      className="audio-row fade-up"
                      style={{
                        borderTop: "1px solid #f1f5f9", background: "#fff",
                        animationDelay: `${index * 40}ms`,
                      }}
                    >
                      <td style={{ padding: "16px 20px", color: "#cbd5e1", fontWeight: 600, fontSize: 12, verticalAlign: "top" }}>
                        {audio.audio_id}
                      </td>
                      <td style={{ padding: "16px 20px", verticalAlign: "top" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          <span style={{ fontWeight: 500, color: "#0f172a", wordBreak: "break-all" }}>
                            {audio.audio_file.split('/').pop()}
                          </span>
                          {/* Dùng host backend trực tiếp nếu config proxy không hỗ trợ file tĩnh của storage */}
                          <audio controls src={`http://localhost:8000${audio.audio_file}`} style={{ height: 40, width: "100%", maxWidth: 260 }} />
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px", color: "#64748b", lineHeight: 1.5, verticalAlign: "top" }}>
                        {!audio.transcript ? (
                          <span style={{ fontStyle: "italic", color: "#cbd5e1" }}>Không có transcript</span>
                        ) : (
                          truncateText(audio.transcript, 150)
                        )}
                      </td>
                      <td style={{ padding: "16px 20px", textAlign: "right", whiteSpace: "nowrap", verticalAlign: "top" }}>
                        <button onClick={() => openEditModal(audio)} style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", marginRight: 10 }}>✏️ Sửa</button>
                        <button onClick={() => handleDelete(audio)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}>🗑️ Xóa</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content fade-up">
              <h3 style={{ margin: "0 0 16px", fontSize: 18, color: "#0f172a" }}>
                {editingAudio ? "Chỉnh sửa Audio" : "Upload Audio mới"}
              </h3>

              {formError && (
                <div style={{ marginBottom: 16, padding: 10, borderRadius: 8, background: "#fff1f2", color: "#be123c", fontSize: 13 }}>
                  {formError}
                </div>
              )}

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#475569" }}>
                  File Audio (.mp3, .wav, .m4a) {!editingAudio && <span style={{ color: "red" }}>*</span>}
                </label>
                <div style={{
                  padding: "16px", borderRadius: 8, border: "1px dashed #cbd5e1",
                  background: "#f8fafc", textAlign: "center"
                }}>
                  <input
                    type="file"
                    accept=".mp3,.wav,.m4a,audio/*"
                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                    ref={fileInputRef}
                    style={{ fontSize: 14 }}
                  />
                  {editingAudio && (
                    <p style={{ marginTop: 8, fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>
                      * Chọn file mới nếu muốn thay đổi file hiện tại ({editingAudio.audio_file.split('/').pop()})
                    </p>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#475569" }}>
                  Transcript (Tùy chọn)
                </label>
                <textarea
                  value={formData.transcript}
                  onChange={(e) => setFormData({ ...formData, transcript: e.target.value })}
                  placeholder="Nhập transcript của audio..."
                  rows={6}
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 8,
                    border: "1px solid #cbd5e1", fontSize: 14, outline: "none",
                    transition: "border 0.2s", resize: "vertical"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                  onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Hủy
                </button>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? "Đang lưu..." : (editingAudio ? "Cập nhật Audio" : "Upload Audio")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
