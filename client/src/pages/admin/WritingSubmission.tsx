import React, { useMemo, useState } from "react";
import writingSubmissionService from "../../services/writingSubmissionService";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { upsertWritingSubmission, removeWritingSubmission } from "../../app/cacheSlice";

export default function WritingSubmissionPage() {
  const { writingSubmissions, users, questions, loading } = useAppSelector(state => state.cache);
  const dispatch = useAppDispatch();
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({ user_id: "", question_id: "", has_score: "" });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubmission, setEditingSubmission] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    writing_id: "",
    user_id: "",
    question_id: "",
    content: "",
    score: "" as string | number,
  });
  
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [viewingSubmission, setViewingSubmission] = useState<any>(null);

  // Delete confirmation
  const [deletingSubmission, setDeletingSubmission] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredSubmissions = useMemo(() => {
    return writingSubmissions.filter((s: any) => {
      let pass = true;
      if (filters.user_id && s.user_id !== filters.user_id) pass = false;
      if (filters.question_id && s.question_id !== filters.question_id) pass = false;
      if (filters.has_score === "yes" && (s.score === null || s.score === undefined)) pass = false;
      if (filters.has_score === "no" && (s.score !== null && s.score !== undefined)) pass = false;
      return pass;
    });
  }, [writingSubmissions, filters]);

  const openAddModal = () => {
    setEditingSubmission(null);
    setFormData({ writing_id: "", user_id: "", question_id: "", content: "", score: "" });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (s: any) => {
    setEditingSubmission(s);
    setFormData({
      writing_id: s.writing_id,
      user_id: s.user_id,
      question_id: s.question_id,
      content: s.content,
      score: s.score ?? "",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.user_id || !formData.question_id || !formData.content) {
      setFormError("Vui lòng nhập đầy đủ thông tin bắt buộc.");
      return;
    }

    setSaving(true);
    setFormError("");
    try {
      const payload: any = {
        user_id: formData.user_id,
        question_id: formData.question_id,
        content: formData.content,
        score: formData.score === "" ? null : Number(formData.score),
      };

      let saved;
      if (editingSubmission) {
        const res = await writingSubmissionService.update(editingSubmission.writing_id, payload);
        saved = res.data.data;
      } else {
        if (formData.writing_id) payload.writing_id = formData.writing_id;
        const res = await writingSubmissionService.create(payload);
        saved = res.data.data;
      }
      dispatch(upsertWritingSubmission(saved));
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Có lỗi xảy ra khi lưu bài viết.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingSubmission) return;
    setIsDeleting(true);
    try {
      await writingSubmissionService.delete(deletingSubmission.writing_id);
      dispatch(removeWritingSubmission(deletingSubmission.writing_id));
      setDeletingSubmission(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Lỗi khi xóa bài viết.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getUserName = (id: string) => users.find(u => u.user_id === id)?.username || id;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');
        .ws-wrap * { box-sizing: border-box; font-family: 'Be Vietnam Pro', sans-serif; }
        .ws-row { transition: background 0.15s; }
        .ws-row:hover { background: #f0f7ff !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { width: 18px; height: 18px; border: 2px solid #dbeafe; border-top-color: #3b82f6; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.35s ease both; }
        .btn { padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer; font-weight: 500; font-size: 13px; transition: all 0.2s; }
        .btn-primary { background: #3b82f6; color: white; }
        .btn-primary:hover { background: #2563eb; }
        .btn-secondary { background: #f1f5f9; color: #475569; }
        .btn-secondary:hover { background: #e2e8f0; }
        .btn-danger { background: #ef4444; color: white; }
        .btn-danger:hover { background: #dc2626; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(2px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-content { background: white; border-radius: 16px; width: 100%; max-width: 500px; padding: 24px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); max-height: 90vh; overflow-y: auto; }
        .form-control { width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid #cbd5e1; fontSize: 14px; outline: none; transition: border 0.2s; background: #fff;}
        .form-control:focus { border-color: #3b82f6; }
        .form-control:disabled { background: #f1f5f9; cursor: not-allowed; }
      `}</style>

      <div className="ws-wrap" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: "#3b82f6", textTransform: "uppercase", marginBottom: 6 }}>
              Hệ thống thi
            </p>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#0f172a", lineHeight: 1.2 }}>
              Quản lý Bài viết
            </h2>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#94a3b8" }}>
              Xem và chấm điểm các bài viết của người dùng
            </p>
          </div>

          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <button className="btn btn-primary" onClick={openAddModal}>+ Thêm Bài Viết</button>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 12, background: "#fff", padding: "16px", borderRadius: 12, border: "1px solid #e2e8f0" }}>
            <select className="form-control" style={{ width: 180 }} value={filters.user_id} onChange={e => setFilters({...filters, user_id: e.target.value})}>
              <option value="">-- Tất cả Người dùng --</option>
              {users.map(u => <option key={u.user_id} value={u.user_id}>{u.username} ({u.user_id})</option>)}
            </select>
            <select className="form-control" style={{ width: 180 }} value={filters.question_id} onChange={e => setFilters({...filters, question_id: e.target.value})}>
              <option value="">-- Tất cả Câu hỏi --</option>
              {questions.filter(q => q.question_type === 'writing' || q.question_type === 'WRITING' || true).map(q => <option key={q.question_id} value={q.question_id}>{q.question_id}</option>)}
            </select>
            <select className="form-control" style={{ width: 180 }} value={filters.has_score} onChange={e => setFilters({...filters, has_score: e.target.value})}>
              <option value="">-- Trạng thái chấm điểm --</option>
              <option value="yes">Đã chấm điểm</option>
              <option value="no">Chưa chấm điểm</option>
            </select>
        </div>

        <div style={{ borderRadius: 16, border: "1px solid #e2e8f0", background: "#fff", boxShadow: "0 4px 24px rgba(15,23,42,0.05)", overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fafcff" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
              Danh sách Bài viết ({filteredSubmissions.length})
            </span>
            {loading && <span className="spinner" />}
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["STT", "Người dùng", "Mã Câu hỏi", "Điểm", "Ngày nộp", "Thao tác"].map((h, i) => (
                    <th key={i} style={{ padding: "10px 20px", textAlign: i === 5 ? "center" : "left", color: "#64748b", fontWeight: 600, fontSize: 12, letterSpacing: "0.05em", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.length === 0 && !loading ? (
                   <tr>
                    <td colSpan={6} style={{ padding: "48px 20px", textAlign: "center", color: "#94a3b8" }}>Không tìm thấy bài viết nào</td>
                  </tr>
                ) : (
                  filteredSubmissions.map((s: any, index: number) => (
                    <tr key={s.writing_id} className="ws-row fade-up" style={{ borderTop: "1px solid #f1f5f9", background: "#fff", animationDelay: `${index * 30}ms` }}>
                      {/* STT: Hiển thị 01, 02... theo yêu cầu */}
                      <td style={{ padding: "13px 20px", color: "#64748b", fontWeight: 600, fontSize: 12 }}>
                        {String(index + 1).padStart(2, '0')}
                      </td>
                      <td style={{ padding: "13px 20px", color: "#1e293b", fontWeight: 500 }}>
                        {getUserName(s.user_id)}
                      </td>
                      <td style={{ padding: "13px 20px", color: "#475569" }}>{s.question_id}</td>
                      <td style={{ padding: "13px 20px" }}>
                        {s.score !== null ? (
                          <span style={{ background: "#f0fdf4", color: "#166534", padding: "4px 10px", borderRadius: 20, fontWeight: 700 }}>
                            {s.score}
                          </span>
                        ) : (
                          <span style={{ color: "#94a3b8", fontStyle: "italic" }}>Chưa chấm</span>
                        )}
                      </td>
                      <td style={{ padding: "13px 20px", color: "#64748b" }}>
                        {new Date(s.created_at).toLocaleDateString("vi-VN")}
                      </td>
                      <td style={{ padding: "13px 20px", textAlign: "center", whiteSpace: "nowrap" }}>
                        <button onClick={() => setViewingSubmission(s)} style={{ background: "none", border: "none", cursor: "pointer", color: "#10b981", marginRight: 8 }} title="Xem chi tiết">👁️ Xem</button>
                        <button onClick={() => openEditModal(s)} style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", marginRight: 8 }} title="Sửa / Chấm điểm">✏️ Sửa</button>
                        <button onClick={() => setDeletingSubmission(s)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }} title="Xóa">🗑️ Xóa</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Xem chi tiết (Hiển thị đầy đủ mã định danh) */}
        {viewingSubmission && (
          <div className="modal-overlay" onClick={() => setViewingSubmission(null)}>
            <div className="modal-content fade-up" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ margin: 0, fontSize: 18, color: "#0f172a", fontWeight: "bold" }}>Chi tiết Bài viết</h3>
                <button onClick={() => setViewingSubmission(null)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#64748b" }}>&times;</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div style={{ padding: 12, background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <p style={{ margin: "0 0 4px", fontSize: 11, color: "#64748b", fontWeight: 600 }}>MÃ BÀI VIẾT (Writing ID)</p>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#3b82f6" }}>{viewingSubmission.writing_id}</p>
                  </div>
                  <div style={{ padding: 12, background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <p style={{ margin: "0 0 4px", fontSize: 11, color: "#64748b", fontWeight: 600 }}>NGƯỜI DÙNG (User ID)</p>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>{viewingSubmission.user_id} - {getUserName(viewingSubmission.user_id)}</p>
                  </div>
                  <div style={{ padding: 12, background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <p style={{ margin: "0 0 4px", fontSize: 11, color: "#64748b", fontWeight: 600 }}>MÃ CÂU HỎI (Question ID)</p>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>{viewingSubmission.question_id}</p>
                  </div>
                  <div style={{ padding: 12, background: "#f0fdf4", borderRadius: 8, border: "1px solid #bbf7d0" }}>
                    <p style={{ margin: "0 0 4px", fontSize: 11, color: "#166534", fontWeight: 600 }}>ĐIỂM SỐ (Score)</p>
                    <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#15803d" }}>{viewingSubmission.score ?? "Chưa chấm"}</p>
                  </div>
                </div>
                <div style={{ padding: 16, background: "#fff", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                  <p style={{ margin: "0 0 8px", fontSize: 11, color: "#64748b", fontWeight: 600 }}>NỘI DUNG BÀI VIẾT</p>
                  <div style={{ fontSize: 14, color: "#334155", lineHeight: 1.6, whiteSpace: "pre-wrap", minHeight: 150 }}>
                    {viewingSubmission.content}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
                <button className="btn btn-secondary" onClick={() => setViewingSubmission(null)}>Đóng</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Thêm/Sửa */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content fade-up" style={{ maxWidth: 650 }}>
              <h3 style={{ margin: "0 0 20px", fontSize: 18, color: "#0f172a" }}>
                {editingSubmission ? "Chỉnh sửa bài viết / Chấm điểm" : "Thêm bài viết mới"}
              </h3>

              {formError && (
                <div style={{ marginBottom: 16, padding: "10px 14px", borderRadius: 8, background: "#fff1f2", color: "#be123c", fontSize: 13, border: "1px solid #fecdd3" }}>
                  ⚠️ {formError}
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#475569" }}>Người dùng *</label>
                  <select className="form-control" value={formData.user_id} onChange={e => setFormData({...formData, user_id: e.target.value})}>
                    <option value="">-- Chọn người dùng --</option>
                    {users.map(u => <option key={u.user_id} value={u.user_id}>{u.username} ({u.user_id})</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#475569" }}>Mã Câu hỏi *</label>
                  <select className="form-control" value={formData.question_id} onChange={e => setFormData({...formData, question_id: e.target.value})}>
                    <option value="">-- Chọn câu hỏi --</option>
                    {questions.map(q => <option key={q.question_id} value={q.question_id}>{q.question_id}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#475569" }}>Điểm số (0 - 10)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  min="0" 
                  max="10" 
                  className="form-control" 
                  placeholder="Nhập điểm số..." 
                  value={formData.score} 
                  onChange={e => setFormData({...formData, score: e.target.value})}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#475569" }}>Nội dung bài viết *</label>
                <textarea 
                  className="form-control" 
                  style={{ height: 250, resize: "vertical" }} 
                  placeholder="Nhập nội dung bài viết..."
                  value={formData.content}
                  onChange={e => setFormData({...formData, content: e.target.value})}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)} disabled={saving}>Hủy</button>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? "Đang lưu..." : "Lưu bài viết"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Xác nhận Xóa */}
        {deletingSubmission && (
          <div className="modal-overlay">
            <div className="modal-content fade-up" style={{ maxWidth: 400, textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
              <h3 style={{ margin: "0 0 12px", fontSize: 18, color: "#0f172a" }}>Xác nhận Xóa</h3>
              <p style={{ margin: "0 0 24px", fontSize: 14, color: "#64748b", lineHeight: 1.5 }}>
                Bạn có chắc chắn muốn xóa bài viết của <strong>{getUserName(deletingSubmission.user_id)}</strong>?
                Hành động này không thể hoàn tác.
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                <button className="btn btn-secondary" onClick={() => setDeletingSubmission(null)} disabled={isDeleting}>Hủy</button>
                <button className="btn btn-danger" onClick={confirmDelete} disabled={isDeleting}>
                  {isDeleting ? "Đang xóa..." : "Xóa vĩnh viễn"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
