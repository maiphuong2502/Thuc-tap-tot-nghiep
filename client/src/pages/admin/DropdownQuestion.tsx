import { useState } from "react";
import dropdownQuestionService from "../../services/dropdownQuestionService";
import dropdownOptionService from "../../services/dropdownOptionService";
import { DropdownQuestion } from "../../types/dropdown-question";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { upsertDropdownQuestion, removeDropdownQuestion, upsertDropdownOption, removeDropdownOption } from "../../app/cacheSlice";

export default function DropdownQuestionPage() {
  const { dropdownQuestions: rows, dropdownOptions, questions, loading } = useAppSelector(state => state.cache);
  const dispatch = useAppDispatch();
  const [error] = useState("");
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<DropdownQuestion | null>(null);
  const [formData, setFormData] = useState({ question_id: "", content: "" });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  // View options modal
  const [viewingQuestion, setViewingQuestion] = useState<DropdownQuestion | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingOptId, setEditingOptId] = useState<string | null>(null);
  const [editingOptContent, setEditingOptContent] = useState("");
  const [editingOptCorrect, setEditingOptCorrect] = useState(false);
  const [savingOpt, setSavingOpt] = useState(false);

  const openViewModal = (q: DropdownQuestion) => { setViewingQuestion(q); setIsViewModalOpen(true); setEditingOptId(null); };
  const closeViewModal = () => { setViewingQuestion(null); setIsViewModalOpen(false); setEditingOptId(null); };
  const viewOptions = viewingQuestion ? dropdownOptions.filter((o: any) => o.question_id === viewingQuestion.question_id) : [];

  const startEditOpt = (opt: any) => { setEditingOptId(opt.option_id); setEditingOptContent(opt.content); setEditingOptCorrect(opt.is_correct); };
  const cancelEditOpt = () => setEditingOptId(null);

  const saveEditOpt = async (opt: any) => {
    setSavingOpt(true);
    try {
      const res = await dropdownOptionService.update(opt.option_id, { question_id: opt.question_id, content: editingOptContent, is_correct: editingOptCorrect });
      dispatch(upsertDropdownOption(res.data));
      setEditingOptId(null);
    } catch (err: any) { alert(err.response?.data?.message || "Lỗi khi cập nhật."); }
    finally { setSavingOpt(false); }
  };

  const handleDeleteOpt = async (opt: any) => {
    if (!window.confirm(`Xóa tùy chọn "${opt.content}"?`)) return;
    try { await dropdownOptionService.delete(opt.option_id); dispatch(removeDropdownOption(opt.option_id)); }
    catch (err: any) { alert(err.response?.data?.message || "Lỗi khi xóa."); }
  };

  const openAddModal = () => { setEditing(null); setFormData({ question_id: "", content: "" }); setFormError(""); setIsModalOpen(true); };
  const openEditModal = (row: DropdownQuestion) => { setEditing(row); setFormData({ question_id: row.question_id, content: row.content || "" }); setFormError(""); setIsModalOpen(true); };

  const handleSave = async () => {
    if (!formData.question_id && !editing) { setFormError("Vui lòng chọn ID câu hỏi."); return; }
    if (!formData.content.trim()) { setFormError("Vui lòng nhập nội dung câu hỏi chọn từ."); return; }
    setSaving(true); setFormError("");
    try {
      let savedItem;
      if (editing) { const res = await dropdownQuestionService.update(editing.question_id, { content: formData.content }); savedItem = res.data; }
      else { const res = await dropdownQuestionService.create({ question_id: formData.question_id, content: formData.content }); savedItem = res.data; }
      dispatch(upsertDropdownQuestion(savedItem)); setIsModalOpen(false);
    } catch (err: any) { setFormError(err.response?.data?.message || err.message || "Có lỗi xảy ra."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (row: DropdownQuestion) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa câu hỏi chọn từ "${row.question_id}"?`)) {
      try { await dropdownQuestionService.delete(row.question_id); dispatch(removeDropdownQuestion(row.question_id)); }
      catch (err: any) { alert(err.response?.data?.message || err.message || "Lỗi khi xóa câu hỏi."); }
    }
  };

  const filtered = rows.filter(q =>
    q.question_id.toLowerCase().includes(search.toLowerCase()) ||
    (q.content || "").toLowerCase().includes(search.toLowerCase())
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
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#0f172a", lineHeight: 1.2 }}>Quản lý Câu Hỏi Chọn Từ</h2>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#94a3b8" }}>Nội dung câu hỏi dạng chọn từ (dropdown) gắn với câu hỏi loại DROPDOWN</p>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <input type="text" className="search-input" placeholder="🔍 Tìm theo ID hoặc nội dung..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 12, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
              <span style={{ fontSize: 12, color: "#3b82f6", fontWeight: 500 }}>Tổng</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#1d4ed8" }}>{filtered.length}</span>
              <span style={{ fontSize: 12, color: "#3b82f6", fontWeight: 500 }}>câu hỏi</span>
            </div>
            <button className="btn btn-primary" onClick={openAddModal}>+ Thêm Câu Hỏi Chọn Từ</button>
          </div>
        </div>

        {error && <div style={{ padding: "12px 16px", borderRadius: 10, background: "#fff1f2", border: "1px solid #fecdd3", color: "#be123c", fontSize: 13 }}>⚠️ {error}</div>}

        <div style={{ borderRadius: 16, border: "1px solid #e2e8f0", background: "#fff", boxShadow: "0 4px 24px rgba(15,23,42,0.05)", overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fafcff" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>Danh sách câu hỏi chọn từ</span>
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
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={3} style={{ padding: "48px 20px", textAlign: "center", color: "#94a3b8" }}><div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}><span style={{ fontSize: 32 }}>📭</span><span style={{ fontWeight: 500 }}>Không tìm thấy câu hỏi</span></div></td></tr>
                ) : (
                  filtered.map((q, index) => (
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

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content fade-up">
              <h3 style={{ margin: "0 0 16px", fontSize: 18, color: "#0f172a" }}>{editing ? "Chỉnh sửa Câu Hỏi Chọn Từ" : "Thêm Câu Hỏi Chọn Từ"}</h3>
              {formError && <div style={{ marginBottom: 16, padding: 10, borderRadius: 8, background: "#fff1f2", color: "#be123c", fontSize: 13 }}>{formError}</div>}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#475569" }}>Question ID <span style={{ color: "red" }}>*</span></label>
                {editing ? (
                  <input type="text" value={formData.question_id} disabled style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, outline: "none", background: "#f1f5f9", color: "#94a3b8" }} />
                ) : (
                  <select value={formData.question_id} onChange={(e) => setFormData({ ...formData, question_id: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, outline: "none" }}>
                    <option value="">-- Chọn Question ID (loại DROPDOWN) --</option>
                    {questions.filter(q => q.question_type.toLowerCase() === 'dropdown').map((q) => (<option key={q.question_id} value={q.question_id}>{q.question_id}</option>))}
                  </select>
                )}
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#475569" }}>Nội dung <span style={{ color: "red" }}>*</span></label>
                <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} placeholder="Nhập nội dung câu hỏi..." rows={4} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, outline: "none", resize: "vertical" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? "Đang lưu..." : "Lưu Thay Đổi"}</button>
              </div>
            </div>
          </div>
        )}

        {/* View Options Modal */}
        {isViewModalOpen && viewingQuestion && (
          <div className="modal-overlay" onClick={closeViewModal}>
            <div className="fade-up" style={{ background: "white", borderRadius: 20, width: "100%", maxWidth: 660, padding: 28, boxShadow: "0 25px 50px rgba(0,0,0,0.15)", maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#3b82f6", textTransform: "uppercase" }}>DROPDOWN — {viewingQuestion.question_id}</p>
                  <h3 style={{ margin: "6px 0 0", fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Danh Sách Tùy Chọn</h3>
                </div>
                <button onClick={closeViewModal} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", color: "#64748b", fontSize: 13 }}>✕ Đóng</button>
              </div>
              <div style={{ background: "#f8fafc", borderRadius: 12, padding: "14px 18px", marginBottom: 20, border: "1px solid #e2e8f0" }}>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>NỘI DUNG CÂU HỎI</p>
                <p style={{ margin: 0, fontSize: 14, color: "#0f172a", lineHeight: 1.6 }}>{viewingQuestion.content}</p>
              </div>
              {viewOptions.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 20px", color: "#94a3b8" }}><span style={{ fontSize: 32, display: "block", marginBottom: 8 }}>📭</span><span style={{ fontWeight: 500 }}>Chưa có tùy chọn nào</span></div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 600, color: "#334155" }}>Danh sách {viewOptions.length} tùy chọn:</p>
                  {viewOptions.map((opt: any, idx: number) => (
                    <div key={opt.option_id} style={{ border: opt.is_correct ? "2px solid #22c55e" : "1px solid #e2e8f0", borderRadius: 12, padding: "12px 16px", background: opt.is_correct ? "#f0fdf4" : "#fff" }}>
                      {editingOptId === opt.option_id ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          <input type="text" value={editingOptContent} onChange={(e) => setEditingOptContent(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#16a34a", fontWeight: 600 }}>
                              <input type="checkbox" checked={editingOptCorrect} onChange={(e) => setEditingOptCorrect(e.target.checked)} style={{ width: 16, height: 16 }} />
                              Đây là đáp án đúng
                            </label>
                            <div style={{ display: "flex", gap: 8 }}>
                              <button onClick={cancelEditOpt} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#f1f5f9", cursor: "pointer", fontSize: 13 }}>Hủy</button>
                              <button onClick={() => saveEditOpt(opt)} disabled={savingOpt} style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: "#3b82f6", color: "white", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>{savingOpt ? "Đang lưu..." : "💾 Lưu"}</button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <span style={{ minWidth: 28, height: 28, borderRadius: "50%", background: opt.is_correct ? "#22c55e" : "#e2e8f0", color: opt.is_correct ? "white" : "#64748b", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{String.fromCharCode(65 + idx)}</span>
                          <span style={{ flex: 1, fontSize: 14, color: "#0f172a" }}>{opt.content}</span>
                          {opt.is_correct && <span style={{ padding: "2px 10px", background: "#dcfce7", color: "#15803d", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>✓ Đúng</span>}
                          <button onClick={() => startEditOpt(opt)} style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", fontSize: 13, padding: "4px 8px" }}>✏️</button>
                          <button onClick={() => handleDeleteOpt(opt)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 13, padding: "4px 8px" }}>🗑️</button>
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
