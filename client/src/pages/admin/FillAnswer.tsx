import { useState } from "react";
import fillAnswerService from "../../services/fillAnswerService";
import { FillAnswer } from "../../types/fill-answer";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { upsertFillAnswer, removeFillAnswer } from "../../app/cacheSlice";

export default function FillAnswerPage() {
  const { fillAnswers, fillQuestions, loading } = useAppSelector(state => state.cache);
  const dispatch = useAppDispatch();
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnswer, setEditingAnswer] = useState<FillAnswer | null>(null);
  const [formData, setFormData] = useState({ answer_id: "", question_id: "", correct_answer: "" });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const openAddModal = () => {
    setEditingAnswer(null);
    setFormData({ answer_id: "", question_id: "", correct_answer: "" });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (fa: FillAnswer) => {
    setEditingAnswer(fa);
    setFormData({ answer_id: fa.answer_id, question_id: fa.question_id, correct_answer: fa.correct_answer });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingAnswer && !formData.answer_id.trim()) {
      setFormError("Vui lòng nhập ID đáp án (VD: FA08).");
      return;
    }
    if (!formData.question_id) {
      setFormError("Vui lòng chọn Câu hỏi tương ứng.");
      return;
    }
    if (!formData.correct_answer.trim()) {
      setFormError("Vui lòng nhập đáp án đúng.");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      let savedItem;
      if (editingAnswer) {
        const res = await fillAnswerService.update(editingAnswer.answer_id, formData);
        savedItem = res.data;
      } else {
        const res = await fillAnswerService.create(formData);
        savedItem = res.data;
      }
      dispatch(upsertFillAnswer(savedItem));
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.response?.data?.message || err.message || "Có lỗi xảy ra.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (fa: FillAnswer) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa đáp án "${fa.answer_id}"?`)) {
      try {
        await fillAnswerService.delete(fa.answer_id);
        dispatch(removeFillAnswer(fa.answer_id));
      } catch (err: any) {
        alert(err.response?.data?.message || err.message || "Lỗi khi xóa đáp án.");
      }
    }
  };

  const filteredAnswers = fillAnswers.filter(a => 
    a.answer_id.toLowerCase().includes(search.toLowerCase()) || 
    a.question_id.toLowerCase().includes(search.toLowerCase()) || 
    a.correct_answer.toLowerCase().includes(search.toLowerCase())
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
      `}</style>

      <div className="topic-wrap" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: "#3b82f6", textTransform: "uppercase", marginBottom: 6 }}>
              Hệ thống thi
            </p>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#0f172a", lineHeight: 1.2 }}>
              Quản lý Đáp Án Điền Từ
            </h2>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#94a3b8" }}>
              Danh sách các đáp án đúng cho câu hỏi điền từ
            </p>
          </div>

          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <input 
              type="text" 
              className="search-input" 
              placeholder="🔍 Tìm theo ID hoặc nội dung..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 16px", borderRadius: 12,
              background: "#eff6ff", border: "1px solid #bfdbfe",
            }}>
              <span style={{ fontSize: 12, color: "#3b82f6", fontWeight: 500 }}>Tổng</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#1d4ed8" }}>{filteredAnswers.length}</span>
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
              Danh sách đáp án điền từ
            </span>
            {loading && <span className="spinner" />}
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Answer ID", "Question ID", "Nội dung câu hỏi", "Đáp án đúng", "Thao tác"].map((h, i) => (
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
                ) : filteredAnswers.length === 0 ? (
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
                  filteredAnswers.map((a, index) => {
                    const relatedQuestion = fillQuestions.find(q => q.question_id === a.question_id);
                    return (
                      <tr
                        key={a.answer_id}
                        className="topic-row fade-up"
                        style={{
                          borderTop: "1px solid #f1f5f9", background: "#fff",
                          animationDelay: `${index * 40}ms`,
                        }}
                      >
                        <td style={{ padding: "13px 20px", color: "#64748b", fontWeight: 600, fontSize: 13, whiteSpace: "nowrap" }}>
                          {a.answer_id}
                        </td>
                        <td style={{ padding: "13px 20px", color: "#3b82f6", fontWeight: 500, fontSize: 13, whiteSpace: "nowrap" }}>
                          {a.question_id}
                        </td>
                        <td style={{ padding: "13px 20px" }}>
                          <span style={{ color: "#475569", whiteSpace: "pre-wrap", fontStyle: "italic" }}>
                            {relatedQuestion ? relatedQuestion.content : "---"}
                          </span>
                        </td>
                        <td style={{ padding: "13px 20px", fontWeight: 600, color: "#10b981" }}>
                          ✓ {a.correct_answer}
                        </td>
                        <td style={{ padding: "13px 20px", textAlign: "right", whiteSpace: "nowrap" }}>
                          <button onClick={() => openEditModal(a)} style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", marginRight: 10 }}>✏️ Chỉnh sửa</button>
                          <button onClick={() => handleDelete(a)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}>❌ Xóa</button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content fade-up">
              <h3 style={{ margin: "0 0 16px", fontSize: 18, color: "#0f172a" }}>
                {editingAnswer ? "Chỉnh sửa Đáp Án" : "Thêm Đáp Án Điền Khuyết"}
              </h3>

              {formError && (
                <div style={{ marginBottom: 16, padding: 10, borderRadius: 8, background: "#fff1f2", color: "#be123c", fontSize: 13 }}>
                  {formError}
                </div>
              )}

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#475569" }}>
                  Answer ID <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.answer_id}
                  onChange={(e) => setFormData({ ...formData, answer_id: e.target.value })}
                  disabled={!!editingAnswer}
                  placeholder="Nhập mã đáp án (VD: FA08)"
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 8,
                    border: "1px solid #cbd5e1", fontSize: 14, outline: "none",
                    background: editingAnswer ? "#f1f5f9" : "#fff", 
                    color: editingAnswer ? "#94a3b8" : "#0f172a",
                    transition: "border 0.2s"
                  }}
                  onFocus={(e) => !editingAnswer && (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => !editingAnswer && (e.target.style.borderColor = "#cbd5e1")}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#475569" }}>
                  Câu Hỏi <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  value={formData.question_id}
                  onChange={(e) => setFormData({ ...formData, question_id: e.target.value })}
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 8,
                    border: "1px solid #cbd5e1", fontSize: 14, outline: "none",
                    transition: "border 0.2s",
                    background: "#fff"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                  onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
                >
                  <option value="">-- Chọn Question ID liên quan --</option>
                  {fillQuestions.map(q => (
                    <option key={q.question_id} value={q.question_id}>
                      {q.question_id} - {q.content ? (q.content.length > 50 ? q.content.substring(0, 50) + "..." : q.content) : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#475569" }}>
                  Đáp án đúng <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.correct_answer}
                  onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                  placeholder="Nhập một đáp án chính xác..."
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 8,
                    border: "1px solid #cbd5e1", fontSize: 14, outline: "none",
                    transition: "border 0.2s"
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
