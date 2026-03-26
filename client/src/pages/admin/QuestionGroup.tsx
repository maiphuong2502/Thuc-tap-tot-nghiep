import { useEffect, useState } from "react";
import questionGroupService from "../../services/questionGroupService";
import skillService from "../../services/skillService";
import passageService from "../../services/passageService";
import audioService from "../../services/audioService";
import { IQuestionGroup } from "../../types/question-group";
import { ISkill } from "../../types/skill";
import { IPassage } from "../../types/passage";
import { IAudio } from "../../types/audio";

export default function QuestionGroup() {
  const [questionGroups, setQuestionGroups] = useState<IQuestionGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [search, setSearch] = useState("");
  const [filterSkillId, setFilterSkillId] = useState("");
  const [filterType, setFilterType] = useState("");

  const [skills, setSkills] = useState<ISkill[]>([]);
  const [passages, setPassages] = useState<IPassage[]>([]);
  const [audios, setAudios] = useState<IAudio[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<IQuestionGroup | null>(null);
  const [formData, setFormData] = useState({ 
    skill_id: "", 
    title: "", 
    passage_id: "", 
    audio_id: "",
    type: "reading_passage"
  });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadOptions = async () => {
    try {
      const [skillRes, passageRes, audioRes] = await Promise.all([
        skillService.list(),
        passageService.list(),
        audioService.list()
      ]);
      setSkills(skillRes?.data?.data || skillRes?.data || []);
      setPassages(passageRes?.data?.data || passageRes?.data || []);
      setAudios(audioRes?.data?.data || audioRes?.data || []);
    } catch (err) {
      console.error("Failed to load options", err);
    }
  };

  const loadQuestionGroups = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        search: search.trim() || undefined,
        skill_id: filterSkillId || undefined,
        type: filterType || undefined,
        per_page: 100
      };
      const res: any = await questionGroupService.list(params);
      const data = res?.data?.data || res?.data || [];
      setQuestionGroups(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Có lỗi xảy ra khi tải danh sách nhóm câu hỏi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOptions(); }, []);
  useEffect(() => { loadQuestionGroups(); }, [search, filterSkillId, filterType]);

  const resetFilters = () => {
    setSearch("");
    setFilterSkillId("");
    setFilterType("");
  };

  const openAddModal = () => {
    setEditingGroup(null);
    setFormData({ skill_id: filterSkillId, title: "", passage_id: "", audio_id: "", type: "reading_passage" });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (group: IQuestionGroup) => {
    setEditingGroup(group);
    setFormData({ 
      skill_id: group.skill_id, 
      title: group.title, 
      passage_id: group.passage_id || "", 
      audio_id: group.audio_id || "",
      type: group.type
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.skill_id) return setFormError("Vui lòng chọn kỹ năng.");
    if (!formData.title.trim()) return setFormError("Vui lòng nhập tên nhóm câu hỏi.");
    if (!formData.type) return setFormError("Vui lòng chọn loại.");

    setSaving(true);
    setFormError("");
    try {
      const payload = {
        ...formData,
        passage_id: formData.passage_id || null,
        audio_id: formData.audio_id || null
      };

      if (editingGroup) {
        await questionGroupService.update(editingGroup.group_id, payload);
      } else {
        await questionGroupService.create(payload);
      }
      setIsModalOpen(false);
      loadQuestionGroups();
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Có lỗi xảy ra khi lưu.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (group: IQuestionGroup) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa "${group.title}"?`)) {
      try {
        await questionGroupService.delete(group.group_id);
        loadQuestionGroups();
      } catch (err: any) {
        alert(err.response?.data?.message || "Lỗi khi xóa nhóm câu hỏi. Đang có câu hỏi sử dụng nhóm này.");
      }
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');
        .question-group-wrap * { box-sizing: border-box; font-family: 'Be Vietnam Pro', sans-serif; }
        .qg-row { transition: background 0.15s; }
        .qg-row:hover { background: #f0f7ff !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { width: 18px; height: 18px; border: 2px solid #dbeafe; border-top-color: #3b82f6; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.35s ease both; }
        .btn { padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer; font-weight: 500; font-size: 13px; transition: all 0.2s; }
        .btn-primary { background: #3b82f6; color: white; }
        .btn-primary:hover { background: #2563eb; }
        .btn-secondary { background: #f1f5f9; color: #475569; }
        .btn-secondary:hover { background: #e2e8f0; }
        .form-control { padding: 10px 14px; border-radius: 8px; border: 1px solid #cbd5e1; outline: none; transition: border 0.2s; width: 100%; font-size: 14px; }
        .form-control:focus { border-color: #3b82f6; }
        .filter-select { padding: 10px 14px; border-radius: 8px; border: 1px solid #cbd5e1; outline: none; background: white; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(2px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-content { background: white; border-radius: 16px; width: 100%; max-width: 450px; padding: 24px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
      `}</style>
      <div className="question-group-wrap" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: "#3b82f6", textTransform: "uppercase", marginBottom: 6 }}>Hệ thống thi</p>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#0f172a", lineHeight: 1.2 }}>Quản lý Nhóm Câu Hỏi</h2>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#94a3b8" }}>Quản lý nhóm câu hỏi (Ví dụ: Reading Passages, Listening Audios)</p>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <select className="filter-select" value={filterSkillId} onChange={(e) => setFilterSkillId(e.target.value)}>
              <option value="">-- Tất cả kỹ năng --</option>
              {skills.map(s => <option key={s.id} value={s.id}>{s.skill_name}</option>)}
            </select>
            <div style={{ display: "flex", gap: 8 }}>
              <input type="text" placeholder="Tìm kiếm..." className="form-control" style={{ width: 200 }} value={search} onChange={(e) => setSearch(e.target.value)} />
              <button className="btn btn-secondary" onClick={resetFilters}>Làm mới</button>
            </div>
            <button className="btn btn-primary" onClick={openAddModal}>+ Thêm nhóm</button>
          </div>
        </div>

        {error && <div style={{ padding: "12px 16px", borderRadius: 10, background: "#fff1f2", border: "1px solid #fecdd3", color: "#be123c", fontSize: 13 }}>⚠️ {error}</div>}

        <div style={{ borderRadius: 16, border: "1px solid #e2e8f0", background: "#fff", boxShadow: "0 4px 24px rgba(15,23,42,0.05)", overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fafcff" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>Danh sách Nhóm Câu Hỏi</span>
            {loading && <span className="spinner" />}
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Mã", "Tiêu đề", "Kỹ năng", "Bài đọc/Nghe", "Loại", "Thao tác"].map((h, i) => (
                    <th key={i} style={{ padding: "10px 20px", textAlign: i === 5 ? "center" : "left", color: "#64748b", fontWeight: 600, fontSize: 12, borderBottom: "1px solid #e2e8f0" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {testPartsLoadingState() /* Abstracted in code */}
                {questionGroups.map((group, index) => (
                  <tr key={group.group_id} className="qg-row fade-up" style={{ borderTop: "1px solid #f1f5f9", animationDelay: `${index * 20}ms` }}>
                    <td style={{ padding: "13px 20px", color: "#64748b", fontSize: 12 }}>{group.group_id}</td>
                    <td style={{ padding: "13px 20px", fontWeight: 600 }}>{group.title}</td>
                    <td style={{ padding: "13px 20px" }}><span style={{ padding: "4px 8px", background: "#fdf4ff", border: "1px solid #fbcfe8", borderRadius: 4, fontSize: 12, color: "#b83280" }}>{group.skill?.skill_name || group.skill_id}</span></td>
                    <td style={{ padding: "13px 20px" }}>
                      {group.passage_id && <div style={{ fontSize: 12, color: "#0ea5e9" }}>📖 {group.passage?.title || group.passage_id}</div>}
                      {group.audio_id && <div style={{ fontSize: 12, color: "#8b5cf6" }}>🎧 {group.audio?.audio_file || group.audio_id}</div>}
                    </td>
                    <td style={{ padding: "13px 20px", color: "#475569" }}>{group.type}</td>
                    <td style={{ padding: "13px 20px", textAlign: "center" }}>
                      <button onClick={() => openEditModal(group)} style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", marginRight: 10 }}>✏️</button>
                      <button onClick={() => handleDelete(group)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content fade-up" style={{maxHeight:'90vh', overflowY:'auto'}}>
              <h3 style={{ margin: "0 0 16px", fontSize: 18, color: "#0f172a" }}>{editingGroup ? "Sửa" : "Thêm"} Nhóm Câu Hỏi</h3>
              {formError && <div style={{ marginBottom: 16, padding: 10, background: "#fff1f2", color: "#be123c", fontSize: 13 }}>{formError}</div>}
              
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Kỹ năng *</label>
                <select className="form-control" value={formData.skill_id} onChange={(e) => setFormData({...formData, skill_id: e.target.value})}>
                  <option value="">-- Chọn kỹ năng --</option>
                  {skills.map(s => <option key={s.id} value={s.id}>{s.skill_name}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Tiêu đề *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="form-control" />
              </div>
              
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Loại (type) *</label>
                <input type="text" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} placeholder="VD: reading_passage, listening_audio" className="form-control" />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Bài Đọc (Passage)</label>
                <select className="form-control" value={formData.passage_id} onChange={(e) => setFormData({...formData, passage_id: e.target.value, audio_id: ""})}>
                  <option value="">-- Không có --</option>
                  {passages.map(p => <option key={p.passage_id} value={p.passage_id}>{p.title}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500 }}>File Nghe (Audio)</label>
                <select className="form-control" value={formData.audio_id} onChange={(e) => setFormData({...formData, audio_id: e.target.value, passage_id: ""})}>
                  <option value="">-- Không có --</option>
                  {audios.map(a => <option key={a.audio_id} value={a.audio_id}>{a.audio_file}</option>)}
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? "Đang lưu..." : "Lưu"}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );

  function testPartsLoadingState() {
    if (loading && questionGroups.length === 0) {
      return <tr><td colSpan={6} style={{ padding: "40px", textAlign: "center" }}><span className="spinner" /></td></tr>;
    }
    if (questionGroups.length === 0) {
      return <tr><td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>Không có dữ liệu</td></tr>;
    }
    return null;
  }
}
