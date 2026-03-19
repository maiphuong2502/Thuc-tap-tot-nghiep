import { useEffect, useState } from "react";
import topicService from "../../services/topicService";
import { ITopic } from "../../types/topic";

export default function Topic() {
  const [topics, setTopics] = useState<ITopic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<ITopic | null>(null);
  const [formData, setFormData] = useState({ topic_name: "", description: "" });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadTopics = async () => {
    setLoading(true);
    setError("");
    try {
      const res: any = await topicService.list();
      if (res?.success && Array.isArray(res.data)) {
        setTopics(res.data);
      } else {
        setError("Không tải được danh sách chủ đề.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Có lỗi xảy ra khi tải danh sách chủ đề.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTopics();
  }, []);

  const openAddModal = () => {
    setEditingTopic(null);
    setFormData({ topic_name: "", description: "" });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (topic: ITopic) => {
    setEditingTopic(topic);
    setFormData({ topic_name: topic.topic_name, description: topic.description || "" });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.topic_name.trim()) {
      setFormError("Vui lòng nhập tên chủ đề.");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      if (editingTopic) {
        await topicService.update(editingTopic.topic_id, formData);
      } else {
        await topicService.create(formData);
      }
      setIsModalOpen(false);
      loadTopics();
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Có lỗi xảy ra.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (topic: ITopic) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa chủ đề "${topic.topic_name}"?`)) {
      try {
        await topicService.delete(topic.topic_id);
        loadTopics();
      } catch (err: any) {
        alert(err.response?.data?.message || "Lỗi khi xóa chủ đề.");
      }
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');

        .topic-wrap * { box-sizing: border-box; font-family: 'Be Vietnam Pro', sans-serif; }

        .topic-row { transition: background 0.15s; }
        .topic-row:hover { background: #f0f7ff !important; }

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
          font-weight: 500; font-size: 13px; transition: all 0.2s;
        }
        .btn-primary { background: #3b82f6; color: white; }
        .btn-primary:hover { background: #2563eb; }
        .btn-secondary { background: #f1f5f9; color: #475569; }
        .btn-secondary:hover { background: #e2e8f0; }
        
        .modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(2px);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: white; border-radius: 16px; width: 100%; max-width: 400px;
          padding: 24px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      <div className="topic-wrap" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: "#3b82f6", textTransform: "uppercase", marginBottom: 6 }}>
              Hệ thống thi
            </p>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#0f172a", lineHeight: 1.2 }}>
              Quản lý chủ đề
            </h2>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#94a3b8" }}>
              Danh mục chủ đề được sử dụng trong bộ đề thi
            </p>
          </div>

          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 16px", borderRadius: 12,
              background: "#eff6ff", border: "1px solid #bfdbfe",
            }}>
              <span style={{ fontSize: 12, color: "#3b82f6", fontWeight: 500 }}>Tổng</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#1d4ed8" }}>{topics.length}</span>
              <span style={{ fontSize: 12, color: "#3b82f6", fontWeight: 500 }}>chủ đề</span>
            </div>
            <button className="btn btn-primary" onClick={openAddModal}>
              + Thêm chủ đề mới
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
              Danh sách chủ đề
            </span>
            {loading && <span className="spinner" />}
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["#", "Tên chủ đề", "Mô tả", "Thao tác"].map((h, i) => (
                    <th key={i} style={{
                      padding: "10px 20px", textAlign: i === 3 ? "right" : "left",
                      color: "#64748b", fontWeight: 600, fontSize: 12,
                      letterSpacing: "0.05em", textTransform: "uppercase",
                      borderBottom: "1px solid #e2e8f0",
                      width: i === 0 ? 60 : i === 3 ? 150 : "auto",
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
                ) : topics.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: "48px 20px", textAlign: "center", color: "#94a3b8" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 32 }}>📭</span>
                        <span style={{ fontWeight: 500 }}>Chưa có chủ đề nào</span>
                        <span style={{ fontSize: 12 }}>Dữ liệu sẽ hiển thị khi được thêm vào hệ thống</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  topics.map((topic, index) => (
                    <tr
                      key={topic.topic_id}
                      className="topic-row fade-up"
                      style={{
                        borderTop: "1px solid #f1f5f9", background: "#fff",
                        animationDelay: `${index * 40}ms`,
                      }}
                    >
                      <td style={{ padding: "13px 20px", color: "#cbd5e1", fontWeight: 600, fontSize: 12 }}>
                        {String(index + 1).padStart(2, "0")}
                      </td>
                      <td style={{ padding: "13px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{
                            fontSize: 18, width: 36, height: 36,
                            borderRadius: 10, background: "#eff6ff",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0,
                          }}>
                            🏷️
                          </span>
                          <span style={{ fontWeight: 600, color: "#0f172a" }}>
                            {topic.topic_name}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "13px 20px", color: "#64748b" }}>
                        {topic.description || <span style={{ fontStyle: "italic", color: "#cbd5e1" }}>Không có</span>}
                      </td>
                      <td style={{ padding: "13px 20px", textAlign: "right", whiteSpace: "nowrap" }}>
                        <button onClick={() => openEditModal(topic)} style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", marginRight: 10 }}>✏️ Sửa</button>
                        <button onClick={() => handleDelete(topic)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}>🗑️ Xóa</button>
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
                {editingTopic ? "Chỉnh sửa chủ đề" : "Thêm chủ đề mới"}
              </h3>

              {formError && (
                <div style={{ marginBottom: 16, padding: 10, borderRadius: 8, background: "#fff1f2", color: "#be123c", fontSize: 13 }}>
                  {formError}
                </div>
              )}

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#475569" }}>
                  Tên chủ đề <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.topic_name}
                  onChange={(e) => setFormData({ ...formData, topic_name: e.target.value })}
                  placeholder="Nhập tên chủ đề..."
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 8,
                    border: "1px solid #cbd5e1", fontSize: 14, outline: "none",
                    transition: "border 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                  onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#475569" }}>
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Nhập mô tả..."
                  rows={4}
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
                  {saving ? "Đang lưu..." : "Lưu chủ đề"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
