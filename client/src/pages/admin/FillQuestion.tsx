import { useState } from "react";
import fillQuestionService from "../../services/fillQuestionService";
import fillAnswerService from "../../services/fillAnswerService";
import { FillQuestion } from "../../types/fill-question";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { upsertFillQuestion, removeFillQuestion, upsertFillAnswer, removeFillAnswer } from "../../app/cacheSlice";

export default function FillQuestionPage() {
  const { fillQuestions, fillAnswers, questions, loading } = useAppSelector(state => state.cache);
  const dispatch = useAppDispatch();
  const [error] = useState("");
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<FillQuestion | null>(null);
  const [formData, setFormData] = useState({ question_id: "", content: "" });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  // View answers modal
  const [viewingQuestion, setViewingQuestion] = useState<FillQuestion | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);
  const [editingAnswerText, setEditingAnswerText] = useState("");
  const [savingAnswer, setSavingAnswer] = useState(false);

  const openViewModal = (fq: FillQuestion) => { setViewingQuestion(fq); setIsViewModalOpen(true); setEditingAnswerId(null); };
  const closeViewModal = () => { setViewingQuestion(null); setIsViewModalOpen(false); setEditingAnswerId(null); };
  const viewAnswers = viewingQuestion ? fillAnswers.filter((a: any) => a.question_id === viewingQuestion.question_id) : [];

  const startEditAnswer = (ans: any) => { setEditingAnswerId(ans.answer_id); setEditingAnswerText(ans.correct_answer); };
  const cancelEditAnswer = () => setEditingAnswerId(null);

  const saveEditAnswer = async (ans: any) => {
    setSavingAnswer(true);
    try {
      const res = await fillAnswerService.update(ans.answer_id, { question_id: ans.question_id, correct_answer: editingAnswerText });
      dispatch(upsertFillAnswer(res.data));
      setEditingAnswerId(null);
    } catch (err: any) { alert(err.response?.data?.message || "Lỗi khi cập nhật đáp án."); }
    finally { setSavingAnswer(false); }
  };

  const handleDeleteAnswer = async (ans: any) => {
    if (!window.confirm(`Xóa đáp án "${ans.correct_answer}"?`)) return;
    try { await fillAnswerService.delete(ans.answer_id); dispatch(removeFillAnswer(ans.answer_id)); }
    catch (err: any) { alert(err.response?.data?.message || "Lỗi khi xóa đáp án."); }
  };

  const openAddModal = () => { setEditingQuestion(null); setFormData({ question_id: "", content: "" }); setFormError(""); setIsModalOpen(true); };
  const openEditModal = (fq: FillQuestion) => { setEditingQuestion(fq); setFormData({ question_id: fq.question_id, content: fq.content || "" }); setFormError(""); setIsModalOpen(true); };

  const handleSave = async () => {
    if (!formData.question_id) { setFormError("Vui lòng chọn ID câu hỏi."); return; }
    if (!formData.content.trim()) { setFormError("Vui lòng nhập nội dung câu hỏi điền từ."); return; }
    setSaving(true); setFormError("");
    try {
      let savedItem;
      if (editingQuestion) { const res = await fillQuestionService.update(editingQuestion.question_id, formData); savedItem = res.data; }
      else { const res = await fillQuestionService.create(formData); savedItem = res.data; }
      dispatch(upsertFillQuestion(savedItem)); setIsModalOpen(false);
    } catch (err: any) { setFormError(err.response?.data?.message || err.message || "Có lỗi xảy ra."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (fq: FillQuestion) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa câu hỏi điền từ "${fq.question_id}"?`)) {
      try { await fillQuestionService.delete(fq.question_id); dispatch(removeFillQuestion(fq.question_id)); }
      catch (err: any) { alert(err.response?.data?.message || err.message || "Lỗi khi xóa câu hỏi."); }
    }
  };

  const filteredQuestions = fillQuestions.filter(q =>
    q.question_id.toLowerCase().includes(search.toLowerCase()) ||
    q.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');
        .topic-wrap * { box-sizing: border-box; font-family: 'Be Vietnam Pro', sans-serif; }
        .topic-row { transition: background 0.15s; }
        .topic-row:hover { background: #f0f7ff !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { width: 18px; height: 18px; border: 2px solid #dbeafe; border-top-color: #3b82f6; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.35s ease both; }
        .btn { padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer; font-weight: 500; font-size: 13px; transition: all 0.2s; }
        .btn-primary { background: #3b82f6; color: white; }
        .btn-primary:hover { background: #2563eb; }
        .btn-secondary { background: #f1f5f9; color: #475569; }
        .btn-secondary:hover { background: #e2e8f0; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(2px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-content { background: white; border-radius: 16px; width: 100%; max-width: 500px; padding: 24px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
        .search-input { width: 300px; padding: 8px 14px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 13px; }
      `}</style>

      <div className="topic-wrap" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: "#3b82f6", textTransform: "uppercase", marginBottom: 6 }}>Hệ thống thi</p>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#0f172a", lineHeight: 1.2 }}>Quản lý Câu Hỏi Điền Từ</h2>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#94a3b8" }}>Danh sách chi tiết nội dung các câu hỏi điền vào chỗ trống</p>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <input type="text" className="search-input" placeholder="🔍 Tìm theo ID hoặc nội dung..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 12, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
              <span style={{ fontSize: 12, color: "#3b82f6", fontWeight: 500 }}>Tổng</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#1d4ed8" }}>{filteredQuestions.length}</span>
              <span style={{ fontSize: 12, color: "#3b82f6", fontWeight: 500 }}>câu hỏi</span>
            </div>
            <button className="btn btn-primary" onClick={openAddModal}>+ Thêm Câu Hỏi Điền Từ</button>
          </div>
        </div>

        {error && <div style={{ padding: "12px 16px", borderRadius: 10, background: "#fff1f2", border: "1px solid #fecdd3", color: "#be123c", fontSize: 13 }}>⚠️ {error}</div>}

        <div style={{ borderRadius: 16, border: "1px solid #e2e8f0", background: "#fff", boxShadow: "0 4px 24px rgba(15,23,42,0.05)", overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fafcff" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>Danh sách câu hỏi điền từ</span>
            {loading && <span className="spinner" />}
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Question ID", "Nội dung", "Thao tác"].map((h, i) => (
                    <th key={i} style={{ padding: "10px 20px", textAlign: i === 2 ? "right" : "left", color: "#64748b", fontWeight: 600, fontSize: 12, letterSpacing: "0.05em", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0", width: i === 0 ? 160 : i === 2 ? 230 : "auto", whiteSpace: i === 0 ? "nowrap" : "normal" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={3} style={{ padding: "40px 20px", textAlign: "center", color: "#94a3b8" }}><div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}><span className="spinner" style={{ width: 24, height: 24 }} /><span>Đang tải dữ liệu...</span></div></td></tr>
                ) : filteredQuestions.length === 0 ? (
                  <tr><td colSpan={3} style={{ padding: "48px 20px", textAlign: "center", color: "#94a3b8" }}><div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}><span style={{ fontSize: 32 }}>📭</span><span style={{ fontWeight: 500 }}>Không tìm thấy câu hỏi điền từ</span></div></td></tr>
                ) : (
                  filteredQuestions.map((q, index) => (
                    <tr key={q.question_id} className="topic-row fade-up" style={{ borderTop: "1px solid #f1f5f9", background: "#fff", animationDelay: `${index * 40}ms` }}>
                      <td style={{ padding: "13px 20px", color: "#64748b", fontWeight: 600, fontSize: 13, whiteSpace: "nowrap" }}>{q.question_id}</td>
                      <td style={{ padding: "13px 20px" }}><span style={{ color: "#0f172a", whiteSpace: "pre-wrap" }}>{q.content}</span></td>
                      <td style={{ padding: "13px 20px", textAlign: "right", whiteSpace: "nowrap" }}>
                        <button onClick={() => openViewModal(q)} style={{ background: "none", border: "none", cursor: "pointer", color: "#16a34a", marginRight: 10 }}>👁️ Xem</button>
                        <button onClick={() => openEditModal(q)} style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", marginRight: 10 }}>✏️ Chỉnh sửa</button>
                        <button onClick={() => handleDelete(q)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}>❌ Xóa</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit/Add Modal */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content fade-up">
              <h3 style={{ margin: "0 0 16px", fontSize: 18, color: "#0f172a" }}>{editingQuestion ? "Chỉnh sửa Câu Hỏi Điền Từ" : "Thêm Câu Hỏi Điền Từ"}</h3>
              {formError && <div style={{ marginBottom: 16, padding: 10, borderRadius: 8, background: "#fff1f2", color: "#be123c", fontSize: 13 }}>{formError}</div>}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#475569" }}>Question ID <span style={{ color: "red" }}>*</span></label>
                {editingQuestion ? (
                  <input type="text" value={formData.question_id} disabled style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, outline: "none", background: "#f1f5f9", color: "#94a3b8" }} />
                ) : (
                  <select value={formData.question_id} onChange={(e) => setFormData({ ...formData, question_id: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, outline: "none" }}>
                    <option value="">-- Chọn Question ID (Loại FILL) --</option>
                    {questions.filter(q => q.question_type.toLowerCase() === 'fill').map((q) => (<option key={q.question_id} value={q.question_id}>{q.question_id}</option>))}
                  </select>
                )}
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#475569" }}>Nội dung (Có chỗ trống, VD: "____") <span style={{ color: "red" }}>*</span></label>
                <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} placeholder="Nhập nội dung câu hỏi..." rows={4} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, outline: "none", resize: "vertical" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? "Đang lưu..." : "Lưu Thay Đổi"}</button>
              </div>
            </div>
          </div>
        )}

        {/* View Answers Modal */}
        {isViewModalOpen && viewingQuestion && (
          <div className="modal-overlay" onClick={closeViewModal}>
            <div className="fade-up" style={{ background: "white", borderRadius: 20, width: "100%", maxWidth: 620, padding: 28, boxShadow: "0 25px 50px rgba(0,0,0,0.15)", maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#3b82f6", textTransform: "uppercase" }}>FILL — {viewingQuestion.question_id}</p>
                  <h3 style={{ margin: "6px 0 0", fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Danh Sách Đáp Án Chấp Nhận</h3>
                </div>
                <button onClick={closeViewModal} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", color: "#64748b", fontSize: 13 }}>✕ Đóng</button>
              </div>
              <div style={{ background: "#f8fafc", borderRadius: 12, padding: "14px 18px", marginBottom: 20, border: "1px solid #e2e8f0" }}>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>NỘI DUNG CÂU HỎI</p>
                <p style={{ margin: 0, fontSize: 14, color: "#0f172a", lineHeight: 1.6 }}>{viewingQuestion.content}</p>
              </div>
              {viewAnswers.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 20px", color: "#94a3b8" }}><span style={{ fontSize: 32, display: "block", marginBottom: 8 }}>📭</span><span style={{ fontWeight: 500 }}>Chưa có đáp án nào cho câu hỏi này</span></div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 600, color: "#334155" }}>Danh sách {viewAnswers.length} đáp án được chấp nhận:</p>
                  {viewAnswers.map((ans: any, idx: number) => (
                    <div key={ans.answer_id} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "12px 16px", background: "#fff" }}>
                      {editingAnswerId === ans.answer_id ? (
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          <input type="text" value={editingAnswerText} onChange={(e) => setEditingAnswerText(e.target.value)} style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, outline: "none" }} />
                          <button onClick={cancelEditAnswer} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#f1f5f9", cursor: "pointer", fontSize: 13 }}>Hủy</button>
                          <button onClick={() => saveEditAnswer(ans)} disabled={savingAnswer} style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: "#3b82f6", color: "white", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>{savingAnswer ? "Đang lưu..." : "💾 Lưu"}</button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <span style={{ minWidth: 28, height: 28, borderRadius: "50%", background: "#e2e8f0", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{idx + 1}</span>
                          <span style={{ flex: 1, fontSize: 14, color: "#0f172a", fontWeight: 500 }}>{ans.correct_answer}</span>
                          <button onClick={() => startEditAnswer(ans)} style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", fontSize: 13, padding: "4px 8px" }}>✏️</button>
                          <button onClick={() => handleDeleteAnswer(ans)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 13, padding: "4px 8px" }}>🗑️</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
