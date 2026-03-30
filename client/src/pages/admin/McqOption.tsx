import { useEffect, useState } from "react";
import mcqOptionService from "../../services/mcqOptionService";
import mcqQuestionService from "../../services/mcqQuestionService";
import { McqOption } from "../../types/mcq-option";
import { McqQuestion } from "../../types/mcq-question";

export default function McqOptionPage() {
  const [mcqOptions, setMcqOptions] = useState<McqOption[]>([]);
  const [mcqQuestions, setMcqQuestions] = useState<McqQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<McqOption | null>(null);
  const [formData, setFormData] = useState({ option_id: "", question_id: "", content: "", is_correct: false });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadMcqOptions = async () => {
    setLoading(true);
    setError("");
    try {
      const res: any = await mcqOptionService.list();
      if (res?.success && Array.isArray(res.data)) {
        setMcqOptions(res.data);
      } else {
        setError("Không tải được danh sách đáp án.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Có lỗi xảy ra khi tải danh sách.");
    } finally {
      setLoading(false);
    }
  };

  const loadQuestionsForDropdown = async () => {
    try {
      const res: any = await mcqQuestionService.list();
      if (res?.success && Array.isArray(res.data)) {
        setMcqQuestions(res.data);
      }
    } catch (err) {
      console.error("Failed to load questions dropdown", err);
    }
  };

  useEffect(() => {
    loadMcqOptions();
    loadQuestionsForDropdown();
  }, []);

  const openAddModal = () => {
    setEditingOption(null);
    setFormData({ option_id: "", question_id: "", content: "", is_correct: false });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (mo: McqOption) => {
    setEditingOption(mo);
    setFormData({ option_id: mo.option_id, question_id: mo.question_id, content: mo.content || "", is_correct: mo.is_correct || false });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.option_id && !editingOption) {
      setFormError("Vui lòng nhập ID đáp án.");
      return;
    }
    if (!formData.question_id) {
      setFormError("Vui lòng chọn ID câu hỏi.");
      return;
    }
    if (!formData.content.trim()) {
      setFormError("Vui lòng nhập nội dung đáp án.");
      return;
    }
    
    setSaving(true);
    setFormError("");
    try {
      if (editingOption) {
        await mcqOptionService.update(editingOption.option_id, formData);
      } else {
        await mcqOptionService.create(formData);
      }
      setIsModalOpen(false);
      loadMcqOptions();
    } catch (err: any) {
      setFormError(err.response?.data?.message || err.message || "Có lỗi xảy ra.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (mo: McqOption) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa đáp án "${mo.option_id}"?`)) {
      try {
        await mcqOptionService.delete(mo.option_id);
        loadMcqOptions();
      } catch (err: any) {
        alert(err.response?.data?.message || "Lỗi khi xóa đáp án.");
      }
    }
  };

  const filteredOptions = mcqOptions.filter(o => 
    o.option_id.toLowerCase().includes(search.toLowerCase()) || 
    o.question_id.toLowerCase().includes(search.toLowerCase()) || 
    o.content.toLowerCase().includes(search.toLowerCase())
  );

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
          background: white; border-radius: 16px; width: 100%; max-width: 500px;
          padding: 24px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        .search-input {
            width: 300px;
            padding: 8px 14px;
            border-radius: 8px;
            border: 1px solid #cbd5e1;
            font-size: 13px;
        }
        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        .status-true {
          background: #dcfce7;
          color: #166534;
        }
        .status-false {
          background: #f1f5f9;
          color: #64748b;
        }
      `}</style>

      <div className="topic-wrap" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: "#3b82f6", textTransform: "uppercase", marginBottom: 6 }}>
              Hệ thống thi
            </p>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#0f172a", lineHeight: 1.2 }}>
              Quản lý Đáp Án MCQ
            </h2>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#94a3b8" }}>
              Danh sách chi tiết các lựa chọn đáp án cho câu hỏi trắc nghiệm
            </p>
          </div>

          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <input 
              type="text" 
              className="search-input" 
              placeholder="🔍 Tìm theo ID, câu hỏi hoặc nội dung..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 16px", borderRadius: 12,
              background: "#eff6ff", border: "1px solid #bfdbfe",
            }}>
              <span style={{ fontSize: 12, color: "#3b82f6", fontWeight: 500 }}>Tổng</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#1d4ed8" }}>{filteredOptions.length}</span>
              <span style={{ fontSize: 12, color: "#3b82f6", fontWeight: 500 }}>đáp án</span>
            </div>
            <button className="btn btn-primary" onClick={openAddModal}>
              + Thêm Đáp Án
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
              Danh sách đáp án trắc nghiệm
            </span>
            {loading && <span className="spinner" />}
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Option ID", "Question ID", "Nội dung", "Đúng/Sai", "Thao tác"].map((h, i) => (
                    <th key={i} style={{
                      padding: "10px 20px", textAlign: i === 4 ? "right" : "left",
                      color: "#64748b", fontWeight: 600, fontSize: 12,
                      letterSpacing: "0.05em", textTransform: "uppercase",
                      borderBottom: "1px solid #e2e8f0",
                      width: i === 0 || i === 1 ? 120 : i === 4 ? 150 : "auto",
                      whiteSpace: i === 0 || i === 1 ? "nowrap" : "normal",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} style={{ padding: "40px 20px", textAlign: "center", color: "#94a3b8" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                        <span className="spinner" style={{ width: 24, height: 24 }} />
                        <span>Đang tải dữ liệu...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredOptions.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: "48px 20px", textAlign: "center", color: "#94a3b8" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 32 }}>📭</span>
                        <span style={{ fontWeight: 500 }}>Không tìm thấy đáp án</span>
                        <span style={{ fontSize: 12 }}>Dữ liệu sẽ hiển thị khi được thêm vào hệ thống</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOptions.map((o, index) => (
                    <tr
                      key={o.option_id}
                      className="topic-row fade-up"
                      style={{
                        borderTop: "1px solid #f1f5f9", background: "#fff",
                        animationDelay: `${index * 40}ms`,
                      }}
                    >
                      <td style={{ padding: "13px 20px", color: "#64748b", fontWeight: 600, fontSize: 13, whiteSpace: "nowrap" }}>
                        {o.option_id}
                      </td>
                      <td style={{ padding: "13px 20px", color: "#64748b", fontSize: 13, whiteSpace: "nowrap" }}>
                        {o.question_id}
                      </td>
                      <td style={{ padding: "13px 20px" }}>
                        <span style={{ color: "#0f172a" }}>
                          {o.content}
                        </span>
                      </td>
                      <td style={{ padding: "13px 20px" }}>
                        <span className={`status-badge ${o.is_correct ? 'status-true' : 'status-false'}`}>
                          {o.is_correct ? 'Đúng' : 'Sai'}
                        </span>
                      </td>
                      <td style={{ padding: "13px 20px", textAlign: "right", whiteSpace: "nowrap" }}>
                        <button onClick={() => openEditModal(o)} style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", marginRight: 10 }}>✏️ Chỉnh sửa</button>
                        <button onClick={() => handleDelete(o)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}>❌ Xóa</button>
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
                {editingOption ? "Chỉnh sửa Đáp Án" : "Thêm Đáp Án"}
              </h3>

              {formError && (
                <div style={{ marginBottom: 16, padding: 10, borderRadius: 8, background: "#fff1f2", color: "#be123c", fontSize: 13 }}>
                  {formError}
                </div>
              )}

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#475569" }}>
                  Option ID <span style={{ color: "red" }}>*</span>
                </label>
                {editingOption ? (
                  <input
                    type="text"
                    value={formData.option_id}
                    disabled
                    style={{
                      width: "100%", padding: "10px 14px", borderRadius: 8,
                      border: "1px solid #cbd5e1", fontSize: 14, outline: "none",
                      background: "#f1f5f9", color: "#94a3b8"
                    }}
                  />
                ) : (
                  <input
                    type="text"
                    value={formData.option_id}
                    onChange={(e) => setFormData({ ...formData, option_id: e.target.value })}
                    placeholder="VD: MCQ01"
                    style={{
                      width: "100%", padding: "10px 14px", borderRadius: 8,
                      border: "1px solid #cbd5e1", fontSize: 14, outline: "none",
                      transition: "border 0.2s"
                    }}
                  />
                )}
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#475569" }}>
                  Question ID <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  value={formData.question_id}
                  onChange={(e) => setFormData({ ...formData, question_id: e.target.value })}
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 8,
                    border: "1px solid #cbd5e1", fontSize: 14, outline: "none",
                    transition: "border 0.2s"
                  }}
                >
                  <option value="">-- Chọn Câu Hỏi Gốc (Question) --</option>
                  {mcqQuestions.map(q => (
                    <option key={q.question_id} value={q.question_id}>
                      {q.question_id} - {q.content.substring(0, 50)}...
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#475569" }}>
                  Nội dung <span style={{ color: "red" }}>*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Nhập nội dung đáp án..."
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

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, fontWeight: 500, color: "#0f172a" }}>
                  <input
                    type="checkbox"
                    checked={formData.is_correct}
                    onChange={(e) => setFormData({ ...formData, is_correct: e.target.checked })}
                    style={{ width: 18, height: 18, cursor: "pointer" }}
                  />
                  Đây là đáp án đúng
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Hủy
                </button>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? "Đang lưu..." : "Lưu Thay Đổi"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
