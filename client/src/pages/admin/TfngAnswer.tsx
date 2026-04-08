import { useState } from "react";
import tfngAnswerService from "../../services/tfngAnswerService";
import { TfngAnswer, TfngAnswerFormData } from "../../types/tfng-answer";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { upsertTfngAnswer, removeTfngAnswer } from "../../app/cacheSlice";

const CORRECT_ANSWER_OPTIONS = ["TRUE", "FALSE", "NOT GIVEN"];

const correctAnswerBadge = (val: string) => {
  const styles: Record<string, { bg: string; color: string }> = {
    TRUE:        { bg: "#dcfce7", color: "#166534" },
    FALSE:       { bg: "#fee2e2", color: "#991b1b" },
    "NOT GIVEN": { bg: "#fef9c3", color: "#854d0e" },
  };
  const s = styles[val] || { bg: "#f1f5f9", color: "#475569" };
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.04em",
        background: s.bg,
        color: s.color,
      }}
    >
      {val}
    </span>
  );
};

export default function TfngAnswerPage() {
  const { tfngAnswers: rows, tfngQuestions, loading } = useAppSelector(state => state.cache);
  const dispatch = useAppDispatch();
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<TfngAnswer | null>(null);
  const [formData, setFormData] = useState<TfngAnswerFormData>({
    answer_id: "",
    question_id: "",
    correct_answer: "",
  });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const openAddModal = () => {
    setEditing(null);
    setFormData({ answer_id: "", question_id: "", correct_answer: "" });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (row: TfngAnswer) => {
    setEditing(row);
    setFormData({
      answer_id:      row.answer_id,
      question_id:    row.question_id,
      correct_answer: row.correct_answer,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editing && !formData.answer_id.trim()) {
      setFormError("Vui lòng nhập ID đáp án (answer_id).");
      return;
    }
    if (!formData.question_id) {
      setFormError("Vui lòng chọn ID câu hỏi TFNG.");
      return;
    }
    if (!formData.correct_answer) {
      setFormError("Vui lòng chọn đáp án đúng.");
      return;
    }

    setSaving(true);
    setFormError("");
    try {
      let savedItem;
      if (editing) {
        const res = await tfngAnswerService.update(editing.answer_id, {
          question_id:    formData.question_id,
          correct_answer: formData.correct_answer,
        });
        savedItem = res.data;
      } else {
        const res = await tfngAnswerService.create({
          answer_id:      formData.answer_id,
          question_id:    formData.question_id,
          correct_answer: formData.correct_answer,
        });
        savedItem = res.data;
      }
      dispatch(upsertTfngAnswer(savedItem));
      setIsModalOpen(false);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        (typeof err.response?.data === "object" && err.response?.data?.errors
          ? JSON.stringify(err.response.data.errors)
          : null) ||
        err.message ||
        "Có lỗi xảy ra.";
      setFormError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row: TfngAnswer) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa đáp án TFNG "${row.answer_id}"?`)) {
      try {
        await tfngAnswerService.delete(row.answer_id);
        dispatch(removeTfngAnswer(row.answer_id));
      } catch (err: any) {
        alert(err.response?.data?.message || err.message || "Lỗi khi xóa đáp án TFNG.");
      }
    }
  };

  const filtered = rows.filter(
    (a) =>
      a.answer_id.toLowerCase().includes(search.toLowerCase()) ||
      a.question_id.toLowerCase().includes(search.toLowerCase()) ||
      (a.correct_answer || "").toLowerCase().includes(search.toLowerCase())
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
        .answer-option-btn {
          flex: 1;
          padding: 10px 8px;
          border-radius: 8px;
          border: 2px solid #e2e8f0;
          background: #f8fafc;
          color: #475569;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s;
          text-align: center;
        }
        .answer-option-btn.selected-true  { border-color: #22c55e; background: #dcfce7; color: #166534; }
        .answer-option-btn.selected-false { border-color: #ef4444; background: #fee2e2; color: #991b1b; }
        .answer-option-btn.selected-ng    { border-color: #eab308; background: #fef9c3; color: #854d0e; }
        .answer-option-btn:hover          { border-color: #93c5fd; background: #eff6ff; }
      `}</style>

      <div className="topic-wrap" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: "#3b82f6", textTransform: "uppercase", marginBottom: 6 }}>
              Hệ thống thi
            </p>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#0f172a", lineHeight: 1.2 }}>
              Quản lý Đáp Án TFNG
            </h2>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#94a3b8" }}>
              Đáp án True / False / Not Given cho từng câu hỏi
            </p>
          </div>

          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Tìm theo ID, câu hỏi hoặc đáp án..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "8px 16px", borderRadius: 12,
                background: "#eff6ff", border: "1px solid #bfdbfe",
              }}
            >
              <span style={{ fontSize: 12, color: "#3b82f6", fontWeight: 500 }}>Tổng</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#1d4ed8" }}>{filtered.length}</span>
              <span style={{ fontSize: 12, color: "#3b82f6", fontWeight: 500 }}>đáp án</span>
            </div>
            <button className="btn btn-primary" onClick={openAddModal}>
              + Thêm Đáp Án TFNG
            </button>
          </div>
        </div>

        {error && (
          <div style={{ padding: "12px 16px", borderRadius: 10, background: "#fff1f2", border: "1px solid #fecdd3", color: "#be123c", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Table */}
        <div style={{ borderRadius: 16, border: "1px solid #e2e8f0", background: "#fff", boxShadow: "0 4px 24px rgba(15,23,42,0.05)", overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fafcff" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>Danh sách đáp án TFNG</span>
            {loading && <span className="spinner" />}
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Answer ID", "Question ID", "Đáp án đúng", "Thao tác"].map((h, i) => (
                    <th
                      key={i}
                      style={{
                        padding: "10px 20px",
                        textAlign: i === 3 ? "right" : "left",
                        color: "#64748b", fontWeight: 600, fontSize: 12,
                        letterSpacing: "0.05em", textTransform: "uppercase",
                        borderBottom: "1px solid #e2e8f0",
                        width: i === 0 || i === 1 ? 140 : i === 2 ? 180 : i === 3 ? 150 : "auto",
                        whiteSpace: i === 0 || i === 1 ? "nowrap" : "normal",
                      }}
                    >
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
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: "48px 20px", textAlign: "center", color: "#94a3b8" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 32 }}>📭</span>
                        <span style={{ fontWeight: 500 }}>Không tìm thấy đáp án TFNG</span>
                        <span style={{ fontSize: 12 }}>Thử từ khóa khác hoặc thêm đáp án mới</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((a, index) => (
                    <tr
                      key={a.answer_id}
                      className="topic-row fade-up"
                      style={{ borderTop: "1px solid #f1f5f9", background: "#fff", animationDelay: `${index * 40}ms` }}
                    >
                      <td style={{ padding: "13px 20px", color: "#64748b", fontWeight: 600, fontSize: 13, whiteSpace: "nowrap" }}>
                        {a.answer_id}
                      </td>
                      <td style={{ padding: "13px 20px", color: "#3b82f6", fontWeight: 600, whiteSpace: "nowrap" }}>
                        {a.question_id}
                      </td>
                      <td style={{ padding: "13px 20px" }}>
                        {correctAnswerBadge(a.correct_answer)}
                      </td>
                      <td style={{ padding: "13px 20px", textAlign: "right", whiteSpace: "nowrap" }}>
                        <button
                          onClick={() => openEditModal(a)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", marginRight: 10 }}
                        >
                          ✏️ Chỉnh sửa
                        </button>
                        <button
                          onClick={() => handleDelete(a)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}
                        >
                          ❌ Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content fade-up">
              <h3 style={{ margin: "0 0 16px", fontSize: 18, color: "#0f172a" }}>
                {editing ? "Chỉnh sửa Đáp Án TFNG" : "Thêm Đáp Án TFNG"}
              </h3>

              {formError && (
                <div style={{ marginBottom: 16, padding: 10, borderRadius: 8, background: "#fff1f2", color: "#be123c", fontSize: 13 }}>
                  {formError}
                </div>
              )}

              {/* Answer ID */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#475569" }}>
                  Answer ID {!editing && <span style={{ color: "red" }}>*</span>}
                </label>
                <input
                  type="text"
                  value={editing ? editing.answer_id : formData.answer_id}
                  onChange={(e) => !editing && setFormData({ ...formData, answer_id: e.target.value })}
                  disabled={!!editing}
                  placeholder="VD: TF07"
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 8,
                    border: "1px solid #cbd5e1", fontSize: 14, outline: "none",
                    background: editing ? "#f1f5f9" : "#fff",
                    color: editing ? "#94a3b8" : "#0f172a",
                  }}
                />
              </div>

              {/* Question ID */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#475569" }}>
                  Question ID <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  value={formData.question_id}
                  onChange={(e) => setFormData({ ...formData, question_id: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, outline: "none", transition: "border 0.2s" }}
                >
                  <option value="">-- Chọn Question ID (loại TFNG) --</option>
                  {tfngQuestions.map((q) => (
                    <option key={q.question_id} value={q.question_id}>
                      {q.question_id}{q.content ? ` — ${q.content.substring(0, 40)}...` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Correct Answer - 3 buttons */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 500, color: "#475569" }}>
                  Đáp án đúng <span style={{ color: "red" }}>*</span>
                </label>
                <div style={{ display: "flex", gap: 10 }}>
                  {CORRECT_ANSWER_OPTIONS.map((opt) => {
                    const isSelected = formData.correct_answer === opt;
                    const cls =
                      isSelected && opt === "TRUE" ? "answer-option-btn selected-true"
                      : isSelected && opt === "FALSE" ? "answer-option-btn selected-false"
                      : isSelected && opt === "NOT GIVEN" ? "answer-option-btn selected-ng"
                      : "answer-option-btn";
                    return (
                      <button
                        key={opt}
                        type="button"
                        className={cls}
                        onClick={() => setFormData({ ...formData, correct_answer: opt })}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
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
