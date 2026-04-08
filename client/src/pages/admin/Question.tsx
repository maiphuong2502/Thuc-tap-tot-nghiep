import React, { useMemo, useState } from "react";
import questionService from "../../services/questionService";
import mcqQuestionService from "../../services/mcqQuestionService";
import mcqOptionService from "../../services/mcqOptionService";
import fillQuestionService from "../../services/fillQuestionService";
import fillAnswerService from "../../services/fillAnswerService";
import dropdownQuestionService from "../../services/dropdownQuestionService";
import dropdownOptionService from "../../services/dropdownOptionService";
import matchingQuestionService from "../../services/matchingQuestionService";
import matchingAnswerService from "../../services/matchingAnswerService";
import tfngQuestionService from "../../services/tfngQuestionService";
import tfngAnswerService from "../../services/tfngAnswerService";
import { Question } from "../../types/question";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { upsertQuestion, removeQuestion, removeMcqQuestion, removeMcqOption, removeFillQuestion, removeFillAnswer, removeDropdownQuestion, removeDropdownOption, removeMatchingQuestion, removeMatchingAnswer, removeTfngQuestion, removeTfngAnswer } from "../../app/cacheSlice";

const TYPE_MAP: Record<string, string> = {
  mcq: "Multiple choice question",
  fill: "FILL",
  dropdown: "Dropdown",
  matching: "Matching",
  map: "Map",
  tfng: "True/False/Not Given",
  // uppercase fallbacks
  MCQ: "Multiple choice question",
  FILL: "FILL",
  DROPDOWN: "Dropdown",
  MAP: "Map",
};

export default function QuestionPage() {
  const { questions, questionGroups: groups, skills, mcqQuestions, mcqOptions, fillQuestions, fillAnswers, dropdownQuestions, dropdownOptions, matchingQuestions, matchingAnswers, tfngQuestions, tfngAnswers, loading } = useAppSelector(state => state.cache);
  const dispatch = useAppDispatch();
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
  const [viewingQuestion, setViewingQuestion] = useState<Question | null>(null);

  // Delete confirmation modal
  const [deletingQuestion, setDeletingQuestion] = useState<Question | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const getRelatedData = (q: Question) => {
    const t = (q.question_type || "").toLowerCase();
    if (t === "mcq") {
      const mq = mcqQuestions.find((x: any) => x.question_id === q.question_id);
      const opts = mcqOptions.filter((x: any) => x.question_id === q.question_id);
      return { type: "MCQ", question: mq, children: opts, childLabel: "Đáp án", childKey: (x: any) => x.option_id, childDisplay: (x: any) => `${x.option_id}: ${x.content}${x.is_correct ? " ✓" : ""}` };
    }
    if (t === "fill") {
      const fq = fillQuestions.find((x: any) => x.question_id === q.question_id);
      const ans = fillAnswers.filter((x: any) => x.question_id === q.question_id);
      return { type: "FILL", question: fq, children: ans, childLabel: "Đáp án", childKey: (x: any) => x.answer_id, childDisplay: (x: any) => x.correct_answer };
    }
    if (t === "dropdown") {
      const dq = dropdownQuestions.find((x: any) => x.question_id === q.question_id);
      const opts = dropdownOptions.filter((x: any) => x.question_id === q.question_id);
      return { type: "DROPDOWN", question: dq, children: opts, childLabel: "Tùy chọn", childKey: (x: any) => x.option_id, childDisplay: (x: any) => `${x.content}${x.is_correct ? " ✓" : ""}` };
    }
    if (t === "matching") {
      const mq = matchingQuestions.find((x: any) => x.question_id === q.question_id);
      const ans = matchingAnswers.filter((x: any) => x.question_id === q.question_id);
      return { type: "MATCHING", question: mq, children: ans, childLabel: "Cặp nối", childKey: (x: any) => x.answer_id, childDisplay: (x: any) => `${x.left_item} ↔ ${x.right_item}` };
    }
    if (t === "tfng") {
      const tq = tfngQuestions.find((x: any) => x.question_id === q.question_id);
      const ans = tfngAnswers.filter((x: any) => x.question_id === q.question_id);
      return { type: "TFNG", question: tq, children: ans, childLabel: "Đáp án", childKey: (x: any) => x.answer_id, childDisplay: (x: any) => x.correct_answer };
    }
    return null;
  };

  const filteredQuestions = useMemo(() => {
    return questions.filter((q: any) => {
      let pass = true;
      if (filters.skill && q.skill_id !== filters.skill) pass = false;
      if (filters.type && q.question_type !== filters.type) pass = false;
      if (filters.group && q.group_id !== filters.group) pass = false;
      return pass;
    });
  }, [questions, filters]);

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
      const payload: any = {
        group_id: formData.group_id,
        question_type: formData.question_type,
        order_index: formData.order_index,
      };
      if (!editingQuestion && formData.question_id) {
        payload.question_id = formData.question_id;
      }

      let savedQuestion;
      if (editingQuestion) {
        const res = await questionService.update(editingQuestion.question_id, payload);
        savedQuestion = res.data;
      } else {
        const res = await questionService.create(payload);
        savedQuestion = res.data;
      }
      dispatch(upsertQuestion(savedQuestion));
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.response?.data?.message || err.response?.data?.errors?.order_index?.[0] || "Có lỗi xảy ra.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (q: Question) => setDeletingQuestion(q);

  const confirmDelete = async () => {
    if (!deletingQuestion) return;
    setIsDeleting(true);
    const q = deletingQuestion;
    const t = (q.question_type || "").toLowerCase();
    try {
      // 1. Chỉ gọi API xóa câu hỏi gốc (Backend DB đã set ON DELETE CASCADE sẽ tự xóa các bảng con)
      await questionService.delete(q.question_id);

      // 2. Dọn dẹp Redux Store ở Frontend để cập nhật UI ngay lập tức
      if (t === "mcq") {
        const opts = mcqOptions.filter((x: any) => x.question_id === q.question_id);
        for (const o of opts) { dispatch(removeMcqOption(o.option_id)); }
        const mq = mcqQuestions.find((x: any) => x.question_id === q.question_id);
        if (mq) { dispatch(removeMcqQuestion(mq.question_id)); }
      } else if (t === "fill") {
        const ans = fillAnswers.filter((x: any) => x.question_id === q.question_id);
        for (const a of ans) { dispatch(removeFillAnswer(a.answer_id)); }
        const fq = fillQuestions.find((x: any) => x.question_id === q.question_id);
        if (fq) { dispatch(removeFillQuestion(fq.question_id)); }
      } else if (t === "dropdown") {
        const opts = dropdownOptions.filter((x: any) => x.question_id === q.question_id);
        for (const o of opts) { dispatch(removeDropdownOption(o.option_id)); }
        const dq = dropdownQuestions.find((x: any) => x.question_id === q.question_id);
        if (dq) { dispatch(removeDropdownQuestion(dq.question_id)); }
      } else if (t === "matching") {
        const ans = matchingAnswers.filter((x: any) => x.question_id === q.question_id);
        for (const a of ans) { dispatch(removeMatchingAnswer(a.answer_id)); }
        const mq = matchingQuestions.find((x: any) => x.question_id === q.question_id);
        if (mq) { dispatch(removeMatchingQuestion(mq.question_id)); }
      } else if (t === "tfng") {
        const ans = tfngAnswers.filter((x: any) => x.question_id === q.question_id);
        for (const a of ans) { dispatch(removeTfngAnswer(a.answer_id)); }
        const tq = tfngQuestions.find((x: any) => x.question_id === q.question_id);
        if (tq) { dispatch(removeTfngQuestion(tq.question_id)); }
      }
      
      // Xóa câu hỏi gốc khỏi store
      dispatch(removeQuestion(q.question_id));
      setDeletingQuestion(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Lỗi khi xóa câu hỏi.");
    } finally {
      setIsDeleting(false);
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
              Quản lý Câu Hỏi
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
              <option value="mcq">Multiple choice question</option>
              <option value="fill">FILL</option>
              <option value="dropdown">Dropdown</option>
              <option value="matching">Matching</option>
              <option value="map">Map</option>
              <option value="tfng">True/False/Not Given</option>
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
              Danh sách Câu hỏi ({filteredQuestions.length})
            </span>
            {loading && <span className="spinner" />}
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["STT", "Nhóm", "Loại", "Thứ tự", "Thao tác"].map((h, i) => (
                    <th key={i} style={{ padding: "10px 20px", textAlign: i === 4 ? "center" : "left", color: "#64748b", fontWeight: 600, fontSize: 12, letterSpacing: "0.05em", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0", width: i === 0 ? 60 : i === 4 ? 200 : "auto" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredQuestions.length === 0 && !loading ? (
                   <tr>
                    <td colSpan={5} style={{ padding: "48px 20px", textAlign: "center", color: "#94a3b8" }}>Không tìm thấy câu hỏi</td>
                  </tr>
                ) : (
                  filteredQuestions.map((q: any, index: number) => (
                    <tr key={q.question_id} className="q-row fade-up" style={{ borderTop: "1px solid #f1f5f9", background: "#fff", animationDelay: `${index * 30}ms` }}>
                      {/* STT */}
                      <td style={{ padding: "13px 20px", color: "#64748b", fontWeight: 600, fontSize: 12, textAlign: "center" }}>
                        {String(index + 1).padStart(2, '0')}
                      </td>
                      {/* Nhóm */}
                      <td style={{ padding: "13px 20px", color: "#475569" }}>{getGroupName(q.group_id)}</td>
                      {/* Loại */}
                      <td style={{ padding: "13px 20px" }}>
                        <span style={{ background: "#f1f5f9", padding: "4px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, color: "#475569" }}>
                          {TYPE_MAP[q.question_type] || q.question_type}
                        </span>
                      </td>
                      {/* Thứ tự */}
                      <td style={{ padding: "13px 20px", color: "#475569", fontWeight: 600 }}>{q.order_index}</td>
                      {/* Thao tác */}
                      <td style={{ padding: "13px 20px", textAlign: "center", whiteSpace: "nowrap" }}>
                        <button onClick={() => setViewingQuestion(q)} style={{ background: "none", border: "none", cursor: "pointer", color: "#10b981", marginRight: 8 }}>👁️ Xem</button>
                        <button onClick={() => openEditModal(q)} style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", marginRight: 8 }}>✏️ Sửa</button>
                        <button onClick={() => handleDeleteClick(q)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}>🗑️ Xóa</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Modal Xem chi tiết ── */}
        {viewingQuestion && (
          <div className="modal-overlay" onClick={() => setViewingQuestion(null)}>
            <div className="modal-content fade-up" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 22 }}>📋</span>
                  <h3 style={{ margin: 0, fontSize: 18, color: "#0f172a", fontWeight: "bold" }}>Chi tiết Câu Hỏi</h3>
                </div>
                <button onClick={() => setViewingQuestion(null)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#64748b", lineHeight: 1 }}>&times;</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", borderRadius: 8, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
                  <span style={{ fontWeight: 600, color: "#1d4ed8", fontSize: 13, width: 140, flexShrink: 0 }}>🔑 Mã câu hỏi:</span>
                  <span style={{ color: "#1e40af", fontSize: 14, fontWeight: 700 }}>{viewingQuestion.question_id}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <span style={{ fontWeight: 600, color: "#475569", fontSize: 13, width: 140, flexShrink: 0 }}>🗂️ Nhóm:</span>
                  <span style={{ color: "#0f172a", fontSize: 14, fontWeight: 600 }}>{getGroupName(viewingQuestion.group_id)}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <span style={{ fontWeight: 600, color: "#475569", fontSize: 13, width: 140, flexShrink: 0 }}>🎯 Kỹ năng:</span>
                  <span style={{ padding: "4px 10px", background: "#fdf4ff", border: "1px solid #fbcfe8", borderRadius: 6, fontSize: 13, color: "#b83280", fontWeight: 500 }}>{getSkillName(viewingQuestion.skill_id)}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <span style={{ fontWeight: 600, color: "#475569", fontSize: 13, width: 140, flexShrink: 0 }}>🏷️ Loại:</span>
                  <span style={{ padding: "4px 10px", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 12, color: "#475569", fontWeight: 600 }}>{TYPE_MAP[viewingQuestion.question_type] || viewingQuestion.question_type}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <span style={{ fontWeight: 600, color: "#475569", fontSize: 13, width: 140, flexShrink: 0 }}>📊 Thứ tự:</span>
                  <span style={{ padding: "4px 10px", background: "#ecfdf5", border: "1px solid #bbf7d0", borderRadius: 6, fontSize: 13, color: "#166534", fontWeight: 600 }}>{viewingQuestion.order_index}</span>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button className="btn btn-secondary" onClick={() => setViewingQuestion(null)}>Đóng</button>
                <button className="btn btn-primary" onClick={() => { setViewingQuestion(null); openEditModal(viewingQuestion); }}>✏️ Chỉnh sửa</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Modal Thêm/Sửa ── */}
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
                    <option value="mcq">Multiple choice question</option>
                    <option value="fill">FILL</option>
                    <option value="dropdown">Dropdown</option>
                    <option value="matching">Matching</option>
                    <option value="map">Map</option>
                    <option value="tfng">True/False/Not Given</option>
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
        {/* ── Modal Xác nhận Xóa ── */}
        {deletingQuestion && (() => {
          const related = getRelatedData(deletingQuestion);
          return (
            <div className="modal-overlay" onClick={() => !isDeleting && setDeletingQuestion(null)}>
              <div className="modal-content fade-up" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: 24 }}>⚠️</span>
                  <h3 style={{ margin: 0, fontSize: 18, color: "#0f172a" }}>Xác nhận Xóa Câu Hỏi</h3>
                </div>

                {/* Thông tin câu hỏi gốc */}
                <div style={{ background: "#fff1f2", border: "1px solid #fecdd3", borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
                  <p style={{ margin: 0, fontSize: 13, color: "#be123c", fontWeight: 600, marginBottom: 6 }}>Câu hỏi sẽ bị xóa:</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ background: "#fecdd3", color: "#9f1239", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>ID: {deletingQuestion.question_id}</span>
                    <span style={{ background: "#f1f5f9", color: "#475569", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>Loại: {TYPE_MAP[deletingQuestion.question_type] || deletingQuestion.question_type}</span>
                    <span style={{ background: "#f1f5f9", color: "#475569", padding: "3px 10px", borderRadius: 20, fontSize: 12 }}>Nhóm: {getGroupName(deletingQuestion.group_id)}</span>
                  </div>
                </div>

                {/* Dữ liệu liên quan */}
                {related ? (
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 600, color: "#334155" }}>Dữ liệu liên quan sẽ bị xóa theo:</p>

                    {/* Nội dung câu hỏi con */}
                    {related.question && (
                      <div style={{ background: "#fef9f0", border: "1px solid #fed7aa", borderRadius: 8, padding: "10px 14px", marginBottom: 10 }}>
                        <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#92400e", marginBottom: 4 }}>📄 Câu hỏi {related.type}:</p>
                        <p style={{ margin: 0, fontSize: 13, color: "#78350f" }}>{(related.question as any).content}</p>
                      </div>
                    )}

                    {/* Danh sách đáp án/tùy chọn */}
                    {related.children.length > 0 ? (
                      <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 14px" }}>
                        <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 600, color: "#475569" }}>🗂️ {related.childLabel} ({related.children.length} mục):</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 160, overflowY: "auto" }}>
                          {related.children.map((child: any) => (
                            <div key={related.childKey(child)} style={{ fontSize: 12, color: "#64748b", padding: "4px 8px", background: "#fff", borderRadius: 6, border: "1px solid #e2e8f0" }}>
                              {related.childDisplay(child)}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 14px", color: "#94a3b8", fontSize: 13 }}>
                        Không có {related.childLabel.toLowerCase()} nào.
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 14px", marginBottom: 16, color: "#94a3b8", fontSize: 13 }}>
                    Không tìm thấy dữ liệu khóa ngoại liên quan.
                  </div>
                )}

                <p style={{ margin: "0 0 16px", fontSize: 13, color: "#64748b", fontStyle: "italic" }}>
                  ⚠️ Hành động này không thể hoàn tác. Tất cả dữ liệu trên sẽ bị xóa vĩnh viễn.
                </p>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                  <button className="btn btn-secondary" onClick={() => setDeletingQuestion(null)} disabled={isDeleting}>Hủy</button>
                  <button
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: isDeleting ? "#fca5a5" : "#ef4444", color: "white", cursor: isDeleting ? "not-allowed" : "pointer", fontWeight: 600, fontSize: 13 }}
                  >
                    {isDeleting ? "Đang xóa..." : "🗑️ Xác nhận Xóa"}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </>
  );
}
