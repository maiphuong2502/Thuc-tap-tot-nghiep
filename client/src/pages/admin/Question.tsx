import React, { useEffect, useState } from "react";
import questionService from "../../services/questionService";
import questionGroupService from "../../services/questionGroupService";
import skillService from "../../services/skillService";
import { Question } from "../../types/question";

export default function QuestionPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({ skill: "", type: "", group: "" });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  
  const [formData, setFormData] = useState({
    question_id: "",
    group_id: "",
    skill_id: "",
    question_type: "MCQ",
    order_index: 1,
  });
  
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [qRes, gRes, sRes]: any = await Promise.all([
        questionService.list(filters),
        questionGroupService.list(),
        skillService.list()
      ]);
      
      if (qRes?.data?.data) {
        setQuestions(qRes.data.data.data || qRes.data.data); // Support both paginated and unpaginated responses
      }
      if (gRes?.data) setGroups(Array.isArray(gRes.data) ? gRes.data : gRes.data.data || []);
      if (sRes?.data) setSkills(Array.isArray(sRes.data) ? sRes.data : sRes.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const openAddModal = () => {
    setEditingQuestion(null);
    setFormData({ question_id: "", group_id: "", skill_id: "", question_type: "MCQ", order_index: 1 });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (q: Question) => {
    setEditingQuestion(q);
    setFormData({
      question_id: q.question_id,
      group_id: q.group_id,
      skill_id: q.skill_id,
      question_type: q.question_type,
      order_index: q.order_index,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleGroupChange = (groupId: string) => {
    const selectedGroup = groups.find(g => g.group_id === groupId);
    setFormData({
      ...formData,
      group_id: groupId,
      skill_id: selectedGroup ? selectedGroup.skill_id : formData.skill_id
    });
  };

  const handleSave = async () => {
    if (!formData.group_id) {
      setFormError("Vui lòng chọn nhóm câu hỏi.");
      return;
    }
    if (!formData.order_index || formData.order_index < 1) {
      setFormError("Thứ tự câu hỏi phải từ 1 trở lên.");
      return;
    }

    setSaving(true);
    setFormError("");
    try {
      const payload: any = { ...formData };
      if (!payload.question_id) delete payload.question_id;

      if (editingQuestion) {
        await questionService.update(editingQuestion.question_id, payload);
      } else {
        await questionService.create(payload);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setFormError(err.response?.data?.message || err.response?.data?.errors?.order_index?.[0] || "Có lỗi xảy ra.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (q: Question) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa câu hỏi "${q.question_id}"?`)) {
      try {
        await questionService.delete(q.question_id);
        loadData();
      } catch (err: any) {
        alert(err.response?.data?.message || "Lỗi khi xóa câu hỏi. Có thể câu hỏi đang được sử dụng.");
      }
    }
  };

  const getSkillName = (id: string) => skills.find(s => s.id === id || s.skill_id === id)?.skill_name || id;
  const getGroupName = (id: string) => groups.find(g => g.group_id === id)?.title || id;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');
        .q-wrap * { box-sizing: border-box; font-family: 'Be Vietnam Pro', sans-serif; }
        .q-row { transition: background 0.15s; }
        .q-row:hover { background: #f0f7ff !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 18px; height: 18px; border: 2px solid #dbeafe; border-top-color: #3b82f6;
          border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block;
        }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.35s ease both; }
        .btn { padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer; font-weight: 500; font-size: 13px; transition: all 0.2s; }
        .btn-primary { background: #3b82f6; color: white; }
        .btn-primary:hover { background: #2563eb; }
        .btn-secondary { background: #f1f5f9; color: #475569; }
        .btn-secondary:hover { background: #e2e8f0; }
        .modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(2px);
          display: flex; align-items: center; justify-content: center; z-index: 1000;
        }
        .modal-content {
          background: white; border-radius: 16px; width: 100%; max-width: 450px;
          padding: 24px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        .form-control { width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid #cbd5e1; fontSize: 14px; outline: none; transition: border 0.2s; background: #fff;}
        .form-control:focus { border-color: #3b82f6; }
        .form-control:disabled { background: #f1f5f9; cursor: not-allowed; }
      `}</style>

      <div className="q-wrap" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: "#3b82f6", textTransform: "uppercase", marginBottom: 6 }}>
              Hệ thống thi
            </p>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#0f172a", lineHeight: 1.2 }}>
              Quản lý Câu Học
            </h2>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#94a3b8" }}>
              Danh sách câu hỏi trong các đề thi
            </p>
          </div>

          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <button className="btn btn-primary" onClick={openAddModal}>+ Thêm Câu Hỏi</button>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 12, background: "#fff", padding: "16px", borderRadius: 12, border: "1px solid #e2e8f0" }}>
            <select className="form-control" style={{ width: 180 }} value={filters.skill} onChange={e => setFilters({...filters, skill: e.target.value})}>
              <option value="">-- Tất cả Kỹ năng --</option>
              {skills.map(s => <option key={s.id || s.skill_id} value={s.id || s.skill_id}>{s.skill_name || s.id}</option>)}
            </select>
            <select className="form-control" style={{ width: 180 }} value={filters.group} onChange={e => setFilters({...filters, group: e.target.value})}>
              <option value="">-- Tất cả Nhóm --</option>
              {groups.map(g => <option key={g.group_id} value={g.group_id}>{g.title || g.group_id}</option>)}
            </select>
            <select className="form-control" style={{ width: 180 }} value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})}>
              <option value="">-- Tất cả Loại --</option>
              <option value="MCQ">Trắc nghiệm (MCQ)</option>
              <option value="FILL">Điền từ (FILL)</option>
              <option value="DROPDOWN">Dropdown</option>
              <option value="matching">Nối từ (Matching)</option>
            </select>
        </div>

        {error && (
          <div style={{ padding: "12px 16px", borderRadius: 10, background: "#fff1f2", border: "1px solid #fecdd3", color: "#be123c", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
            <span>⚠️</span> {error}
          </div>
        )}

        <div style={{ borderRadius: 16, border: "1px solid #e2e8f0", background: "#fff", boxShadow: "0 4px 24px rgba(15,23,42,0.05)", overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fafcff" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
              Danh sách Câu hỏi ({questions.length})
            </span>
            {loading && <span className="spinner" />}
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Mã", "Nhóm", "Kỹ năng", "Loại", "Thứ tự", "Thao tác"].map((h, i) => (
                    <th key={i} style={{ padding: "10px 20px", textAlign: i === 5 ? "right" : "left", color: "#64748b", fontWeight: 600, fontSize: 12, borderBottom: "1px solid #e2e8f0" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {questions.length === 0 && !loading ? (
                   <tr>
                    <td colSpan={6} style={{ padding: "48px 20px", textAlign: "center", color: "#94a3b8" }}>Không tìm thấy câu hỏi</td>
                  </tr>
                ) : (
                  questions.map((q, index) => (
                    <tr key={q.question_id} className="q-row fade-up" style={{ borderTop: "1px solid #f1f5f9", background: "#fff", animationDelay: `${index * 30}ms` }}>
                      <td style={{ padding: "13px 20px", fontWeight: 600, color: "#3b82f6" }}>{q.question_id}</td>
                      <td style={{ padding: "13px 20px", color: "#475569" }}>{getGroupName(q.group_id)}</td>
                      <td style={{ padding: "13px 20px", color: "#475569" }}>{getSkillName(q.skill_id)}</td>
                      <td style={{ padding: "13px 20px" }}>
                        <span style={{ background: "#f1f5f9", padding: "4px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, color: "#475569" }}>
                          {q.question_type}
                        </span>
                      </td>
                      <td style={{ padding: "13px 20px", color: "#475569", fontWeight: 600 }}>{q.order_index}</td>
                      <td style={{ padding: "13px 20px", textAlign: "right", whiteSpace: "nowrap" }}>
                        <button onClick={() => openEditModal(q)} style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", marginRight: 10 }}>✏️</button>
                        <button onClick={() => handleDelete(q)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}>❌</button>
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
                {editingQuestion ? "Chỉnh sửa Câu hỏi" : "Thêm Câu hỏi mới"}
              </h3>

              {formError && (
                <div style={{ marginBottom: 16, padding: 10, borderRadius: 8, background: "#fff1f2", color: "#be123c", fontSize: 13 }}>
                  {formError}
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#475569" }}>
                  Mã câu hỏi (Tùy chọn)
                </label>
                <input
                  type="text"
                  className="form-control"
                  disabled={!!editingQuestion}
                  value={formData.question_id}
                  onChange={(e) => setFormData({ ...formData, question_id: e.target.value })}
                  placeholder={editingQuestion ? "" : "Tự động sinh nếu để trống"}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#475569" }}>
                  Nhóm câu hỏi <span style={{ color: "red" }}>*</span>
                </label>
                <select 
                  className="form-control" 
                  value={formData.group_id}
                  onChange={(e) => handleGroupChange(e.target.value)}
                >
                  <option value="">-- Chọn nhóm --</option>
                  {groups.map(g => (
                     <option key={g.group_id} value={g.group_id}>{g.title || g.group_id}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#475569" }}>
                  Kỹ năng (Tự động theo Nhóm)
                </label>
                <input
                  type="text"
                  className="form-control"
                  disabled
                  value={getSkillName(formData.skill_id)}
                />
              </div>

              <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#475569" }}>Loại <span style={{ color: "red" }}>*</span></label>
                  <select className="form-control" value={formData.question_type} onChange={e => setFormData({...formData, question_type: e.target.value as any})}>
                    <option value="MCQ">MCQ</option>
                    <option value="FILL">FILL (Điền từ)</option>
                    <option value="DROPDOWN">DROPDOWN</option>
                    <option value="matching">Matching (Nối)</option>
                  </select>
                </div>
                <div style={{ width: 80 }}>
                  <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#475569" }}>Thứ tự <span style={{ color: "red" }}>*</span></label>
                  <input type="number" className="form-control" min={1} value={formData.order_index} onChange={e => setFormData({...formData, order_index: parseInt(e.target.value) || 1})} />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? "Đang lưu..." : "Lưu Câu hỏi"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
