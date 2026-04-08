import { useState } from "react";
import tfngQuestionService from "../../services/tfngQuestionService";
import tfngAnswerService from "../../services/tfngAnswerService";
import { TfngQuestion } from "../../types/tfng-question";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { upsertTfngQuestion, removeTfngQuestion, upsertTfngAnswer, removeTfngAnswer } from "../../app/cacheSlice";

const TFNG_OPTIONS = ["TRUE", "FALSE", "NOT GIVEN"];
const TFNG_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  TRUE: { bg: "#f0fdf4", color: "#15803d", border: "#22c55e" },
  FALSE: { bg: "#fff1f2", color: "#be123c", border: "#f43f5e" },
  "NOT GIVEN": { bg: "#fefce8", color: "#854d0e", border: "#eab308" },
};

export default function TfngQuestionPage() {
  const { tfngQuestions: rows, tfngAnswers, questions, loading } = useAppSelector(state => state.cache);
  const dispatch = useAppDispatch();
  const [error] = useState("");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<TfngQuestion | null>(null);
  const [formData, setFormData] = useState({ question_id: "", content: "" });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [viewingQuestion, setViewingQuestion] = useState<TfngQuestion | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingAnsId, setEditingAnsId] = useState<string | null>(null);
  const [editingAnsValue, setEditingAnsValue] = useState("TRUE");
  const [savingAns, setSavingAns] = useState(false);

  const openViewModal = (q: TfngQuestion) => { setViewingQuestion(q); setIsViewModalOpen(true); setEditingAnsId(null); };
  const closeViewModal = () => { setViewingQuestion(null); setIsViewModalOpen(false); setEditingAnsId(null); };
  const viewAnswers = viewingQuestion ? tfngAnswers.filter((a: any) => a.question_id === viewingQuestion.question_id) : [];

  const startEditAns = (ans: any) => { setEditingAnsId(ans.answer_id); setEditingAnsValue(ans.correct_answer); };
  const cancelEditAns = () => setEditingAnsId(null);

  const saveEditAns = async (ans: any) => {
    setSavingAns(true);
    try {
      const res = await tfngAnswerService.update(ans.answer_id, { question_id: ans.question_id, correct_answer: editingAnsValue });
      dispatch(upsertTfngAnswer(res.data));
      setEditingAnsId(null);
    } catch (err: any) { alert(err.response?.data?.message || "Lỗi khi cập nhật."); }
    finally { setSavingAns(false); }
  };

  const handleDeleteAns = async (ans: any) => {
    if (!window.confirm(`Xóa đáp án "${ans.correct_answer}"?`)) return;
    try { await tfngAnswerService.delete(ans.answer_id); dispatch(removeTfngAnswer(ans.answer_id)); }
    catch (err: any) { alert(err.response?.data?.message || "Lỗi khi xóa."); }
  };

  const openAddModal = () => { setEditing(null); setFormData({ question_id: "", content: "" }); setFormError(""); setIsModalOpen(true); };
  const openEditModal = (row: TfngQuestion) => { setEditing(row); setFormData({ question_id: row.question_id, content: row.content || "" }); setFormError(""); setIsModalOpen(true); };

  const handleSave = async () => {
    if (!formData.question_id && !editing) { setFormError("Vui lòng chọn ID câu hỏi."); return; }
    if (!formData.content.trim()) { setFormError("Vui lòng nhập nội dung câu hỏi TFNG."); return; }
    setSaving(true); setFormError("");
    try {
      let savedItem;
      if (editing) { const res = await tfngQuestionService.update(editing.question_id, { content: formData.content }); savedItem = res.data; }
      else { const res = await tfngQuestionService.create({ question_id: formData.question_id, content: formData.content }); savedItem = res.data; }
      dispatch(upsertTfngQuestion(savedItem)); setIsModalOpen(false);
    } catch (err: any) { setFormError(err.response?.data?.message || err.message || "Có lỗi xảy ra."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (row: TfngQuestion) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa câu hỏi TFNG "${row.question_id}"?`)) {
      try { await tfngQuestionService.delete(row.question_id); dispatch(removeTfngQuestion(row.question_id)); }
      catch (err: any) { alert(err.response?.data?.message || "Lỗi khi xóa câu hỏi."); }
    }
  };

  const filtered = rows.filter(q => q.question_id.toLowerCase().includes(search.toLowerCase()) || (q.content || "").toLowerCase().includes(search.toLowerCase()));

  const S = {
    overlay: { position: "fixed" as const, top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15,23,42,0.5)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
    box: { background: "white", borderRadius: 16, width: "100%", maxWidth: 500, padding: 24, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" },
    viewBox: { background: "white", borderRadius: 20, width: "100%", maxWidth: 640, padding: 28, boxShadow: "0 25px 50px rgba(0,0,0,0.15)", maxHeight: "90vh", overflowY: "auto" as const },
    input: { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, outline: "none" } as React.CSSProperties,
    inputDis: { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, outline: "none", background: "#f1f5f9", color: "#94a3b8" } as React.CSSProperties,
    btnPrimary: { padding: "6px 14px", borderRadius: 8, border: "none", background: "#3b82f6", color: "white", cursor: "pointer", fontSize: 13, fontWeight: 600 } as React.CSSProperties,
    btnSec: { padding: "6px 14px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#f1f5f9", cursor: "pointer", fontSize: 13 } as React.CSSProperties,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');
        .topic-wrap * { box-sizing: border-box; font-family: 'Be Vietnam Pro', sans-serif; }
        .topic-row:hover { background: #f0f7ff !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { width: 18px; height: 18px; border: 2px solid #dbeafe; border-top-color: #3b82f6; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.35s ease both; }
        .search-input { width: 300px; padding: 8px 14px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 13px; }
      `}</style>
      <div className="topic-wrap" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#3b82f6", textTransform: "uppercase", marginBottom: 6 }}>Hệ thống thi</p>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#0f172a" }}>Quản lý Câu Hỏi TFNG</h2>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#94a3b8" }}>Nội dung câu hỏi dạng True / False / Not Given</p>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <input type="text" className="search-input" placeholder="🔍 Tìm theo ID hoặc nội dung..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 12, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
              <span style={{ fontSize: 12, color: "#3b82f6", fontWeight: 500 }}>Tổng</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#1d4ed8" }}>{filtered.length}</span>
              <span style={{ fontSize: 12, color: "#3b82f6", fontWeight: 500 }}>câu hỏi</span>
            </div>
            <button style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#3b82f6", color: "white", cursor: "pointer", fontWeight: 600, fontSize: 13 }} onClick={openAddModal}>+ Thêm Câu Hỏi TFNG</button>
          </div>
        </div>
        {error && <div style={{ padding: "12px 16px", borderRadius: 10, background: "#fff1f2", color: "#be123c", fontSize: 13 }}>⚠️ {error}</div>}
        <div style={{ borderRadius: 16, border: "1px solid #e2e8f0", background: "#fff", overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fafcff" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>Danh sách câu hỏi TFNG</span>
            {loading && <span className="spinner" />}
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Question ID", "Nội dung", "Thao tác"].map((h, i) => (
                  <th key={i} style={{ padding: "10px 20px", textAlign: i === 2 ? "right" : "left", color: "#64748b", fontWeight: 600, fontSize: 12, textTransform: "uppercase", borderBottom: "1px solid #e2e8f0", width: i === 0 ? 160 : i === 2 ? 230 : "auto" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={3} style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}><span className="spinner" style={{ width: 24, height: 24 }} /></td></tr>
                : filtered.length === 0 ? <tr><td colSpan={3} style={{ padding: 48, textAlign: "center", color: "#94a3b8" }}>📭 Không tìm thấy câu hỏi TFNG</td></tr>
                : filtered.map((q, i) => (
                  <tr key={q.question_id} className="topic-row fade-up" style={{ borderTop: "1px solid #f1f5f9", animationDelay: `${i * 40}ms` }}>
                    <td style={{ padding: "13px 20px", color: "#64748b", fontWeight: 600, whiteSpace: "nowrap" }}>{q.question_id}</td>
                    <td style={{ padding: "13px 20px", color: "#0f172a" }}>{q.content}</td>
                    <td style={{ padding: "13px 20px", textAlign: "right", whiteSpace: "nowrap" }}>
                      <button onClick={() => openViewModal(q)} style={{ background: "none", border: "none", cursor: "pointer", color: "#16a34a", marginRight: 10 }}>👁️ Xem</button>
                      <button onClick={() => openEditModal(q)} style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", marginRight: 10 }}>✏️ Chỉnh sửa</button>
                      <button onClick={() => handleDelete(q)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}>❌ Xóa</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div style={S.overlay}>
            <div style={S.box} className="fade-up">
              <h3 style={{ margin: "0 0 16px", fontSize: 18, color: "#0f172a" }}>{editing ? "Chỉnh sửa Câu Hỏi TFNG" : "Thêm Câu Hỏi TFNG"}</h3>
              {formError && <div style={{ marginBottom: 16, padding: 10, borderRadius: 8, background: "#fff1f2", color: "#be123c", fontSize: 13 }}>{formError}</div>}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#475569" }}>Question ID <span style={{ color: "red" }}>*</span></label>
                {editing ? <input type="text" value={formData.question_id} disabled style={S.inputDis} />
                  : <select value={formData.question_id} onChange={(e) => setFormData({ ...formData, question_id: e.target.value })} style={S.input}>
                    <option value="">-- Chọn Question ID (loại TFNG) --</option>
                    {questions.filter(q => q.question_type.toLowerCase() === 'tfng').map(q => <option key={q.question_id} value={q.question_id}>{q.question_id}</option>)}
                  </select>}
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#475569" }}>Nội dung câu hỏi (True / False / Not Given) <span style={{ color: "red" }}>*</span></label>
                <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={4} style={{ ...S.input, resize: "vertical" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button style={S.btnSec} onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button style={S.btnPrimary} onClick={handleSave} disabled={saving}>{saving ? "Đang lưu..." : "Lưu Thay Đổi"}</button>
              </div>
            </div>
          </div>
        )}

        {isViewModalOpen && viewingQuestion && (
          <div style={S.overlay} onClick={closeViewModal}>
            <div style={S.viewBox} className="fade-up" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#3b82f6", textTransform: "uppercase" }}>TFNG — {viewingQuestion.question_id}</p>
                  <h3 style={{ margin: "6px 0 0", fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Đáp Án Đúng</h3>
                </div>
                <button onClick={closeViewModal} style={S.btnSec}>✕ Đóng</button>
              </div>
              <div style={{ background: "#f8fafc", borderRadius: 12, padding: "14px 18px", marginBottom: 20, border: "1px solid #e2e8f0" }}>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>NỘI DUNG CÂU HỎI</p>
                <p style={{ margin: 0, fontSize: 14, color: "#0f172a", lineHeight: 1.6 }}>{viewingQuestion.content}</p>
              </div>
              {viewAnswers.length === 0
                ? <div style={{ textAlign: "center", padding: 32, color: "#94a3b8" }}><span style={{ fontSize: 32, display: "block", marginBottom: 8 }}>📭</span>Chưa có đáp án nào</div>
                : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 600, color: "#334155" }}>Đáp án hiện tại:</p>
                    {viewAnswers.map((ans: any) => {
                      const style = TFNG_COLORS[ans.correct_answer] || TFNG_COLORS["NOT GIVEN"];
                      return (
                        <div key={ans.answer_id} style={{ border: `2px solid ${style.border}`, borderRadius: 12, padding: "12px 16px", background: style.bg }}>
                          {editingAnsId === ans.answer_id ? (
                            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                              <select value={editingAnsValue} onChange={(e) => setEditingAnsValue(e.target.value)} style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, outline: "none" }}>
                                {TFNG_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                              </select>
                              <button onClick={cancelEditAns} style={S.btnSec}>Hủy</button>
                              <button onClick={() => saveEditAns(ans)} disabled={savingAns} style={S.btnPrimary}>{savingAns ? "..." : "💾 Lưu"}</button>
                            </div>
                          ) : (
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <span style={{ fontSize: 22 }}>{ans.correct_answer === "TRUE" ? "✅" : ans.correct_answer === "FALSE" ? "❌" : "❓"}</span>
                              <span style={{ flex: 1, fontSize: 15, fontWeight: 700, color: style.color }}>{ans.correct_answer}</span>
                              <button onClick={() => startEditAns(ans)} style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", fontSize: 13 }}>✏️</button>
                              <button onClick={() => handleDeleteAns(ans)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 13 }}>🗑️</button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
