import { useMemo, useState } from "react";
import questionGroupService from "../../services/questionGroupService";
import { IQuestionGroup } from "../../types/question-group";
import { ITestPart } from "../../types/test-part";
import { ISkill } from "../../types/skill";
import { IPassage } from "../../types/passage";
import { IAudio } from "../../types/audio";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { upsertQuestionGroup, removeQuestionGroup } from "../../app/cacheSlice";

export default function QuestionGroup() {
  const { questionGroups, loading } = useAppSelector(state => state.cache);
  const dispatch = useAppDispatch();

  // Đọc dữ liệu dùng chung từ Redux cache
  const cachedSkills = useAppSelector((s) => s.cache.skills) as ISkill[];
  const cachedPassages = useAppSelector((s) => s.cache.passages) as IPassage[];
  const cachedAudios = useAppSelector((s) => s.cache.audios) as IAudio[];
  const cachedTestParts = useAppSelector((s) => s.cache.testParts) as ITestPart[];

  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterSkillId, setFilterSkillId] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<IQuestionGroup | null>(null);
  const [viewingGroup, setViewingGroup] = useState<IQuestionGroup | null>(null);
  const [formData, setFormData] = useState({
    skill_id: "",
    title: "",
    passage_id: "",
    audio_id: "",
    part_id: ""
  });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  // Client-side filter tức thì - không cần gọi API khi tìm kiếm/lọc
  const questionGroupsFiltered = useMemo(() => {
    let groups = questionGroups;
    if (search.trim()) {
      groups = groups.filter((g) =>
        g.title?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filterSkillId) {
      groups = groups.filter((g) => g.skill_id === filterSkillId);
    }
    return groups;
  }, [questionGroups, search, filterSkillId]);

  const resetFilters = () => {
    setSearch("");
    setFilterSkillId("");
  };

  const openAddModal = () => {
    setEditingGroup(null);
    setFormData({ skill_id: filterSkillId, title: "", passage_id: "", audio_id: "", part_id: "" });
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
      part_id: group.part_id || ""
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.skill_id) return setFormError("Vui lòng chọn kỹ năng.");
    if (!formData.title.trim()) return setFormError("Vui lòng nhập tên nhóm câu hỏi.");

    setSaving(true);
    setFormError("");
    try {
      const payload = {
        ...formData,
        passage_id: formData.passage_id || null,
        audio_id: formData.audio_id || null,
        part_id: formData.part_id || null
      };

      let savedGroup;
      if (editingGroup) {
        const res = await questionGroupService.update(editingGroup.group_id, payload);
        savedGroup = res.data;
      } else {
        const res = await questionGroupService.create(payload);
        savedGroup = res.data;
      }
      dispatch(upsertQuestionGroup(savedGroup));
      setIsModalOpen(false);
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
        dispatch(removeQuestionGroup(group.group_id));
      } catch (err: any) {
        alert(err.response?.data?.message || "Lỗi khi xóa nhóm câu hỏi. Đang có câu hỏi sử dụng nhóm này.");
      }
    }
  };

  /* Lấy mã part để hiển thị trong bảng */
  const getPartId = (group: IQuestionGroup) => {
    if (group.passage_id) return group.passage_id;
    if (group.audio_id) return group.audio_id;
    return null;
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

        {/* ── Header ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: "#3b82f6", textTransform: "uppercase", marginBottom: 6 }}>Hệ thống thi</p>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#0f172a", lineHeight: 1.2 }}>Quản lý Nhóm Câu Hỏi</h2>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#94a3b8" }}>Quản lý nhóm câu hỏi (Ví dụ: Reading Passages, Listening Audios)</p>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <select className="filter-select" value={filterSkillId} onChange={(e) => setFilterSkillId(e.target.value)}>
              <option value="">-- Tất cả kỹ năng --</option>
              {cachedSkills.map(s => <option key={s.id} value={s.id}>{s.skill_name}</option>)}
            </select>
            <div style={{ display: "flex", gap: 8 }}>
              <input type="text" placeholder="Tìm kiếm..." className="form-control" style={{ width: 200 }} value={search} onChange={(e) => setSearch(e.target.value)} />
              <button className="btn btn-secondary" onClick={resetFilters}>Làm mới</button>
            </div>
            <button className="btn btn-primary" onClick={openAddModal}>+ Thêm nhóm</button>
          </div>
        </div>

        {error && (
          <div style={{ padding: "12px 16px", borderRadius: 10, background: "#fff1f2", border: "1px solid #fecdd3", color: "#be123c", fontSize: 13 }}>
            ⚠️ {error}
          </div>
        )}

        {/* ── Bảng dữ liệu ── */}
        <div style={{ borderRadius: 16, border: "1px solid #e2e8f0", background: "#fff", boxShadow: "0 4px 24px rgba(15,23,42,0.05)", overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fafcff" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>Danh sách Nhóm Câu Hỏi</span>
            {loading && <span className="spinner" />}
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["STT", "Tiêu đề", "Kỹ năng", "Phần thi - Bộ đề", "Thao tác"].map((h, i) => (
                    <th key={i} style={{
                      padding: "10px 20px",
                      textAlign: i === 0 || i === 4 ? "center" : "left",
                      color: "#64748b", fontWeight: 600, fontSize: 12,
                      letterSpacing: "0.05em", textTransform: "uppercase",
                      borderBottom: "1px solid #e2e8f0",
                      width: i === 0 ? 60 : i === 4 ? 180 : "auto",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading && questionGroups.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                        <span className="spinner" style={{ width: 24, height: 24 }} />
                        <span>Đang tải dữ liệu...</span>
                      </div>
                    </td>
                  </tr>
                ) : questionGroups.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: "48px", textAlign: "center", color: "#94a3b8" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 32 }}>📭</span>
                        <span style={{ fontWeight: 500 }}>Không có dữ liệu</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  questionGroupsFiltered.map((group, index) => {
                    const partId = getPartId(group);
                    const isPassage = !!group.passage_id;
                    return (
                      <tr
                        key={group.group_id}
                        className="qg-row fade-up"
                        style={{ borderTop: "1px solid #f1f5f9", background: "#fff", animationDelay: `${index * 20}ms` }}
                      >
                        {/* STT */}
                        <td style={{ padding: "13px 20px", color: "#64748b", fontWeight: 600, fontSize: 12, textAlign: "center" }}>
                          {String(index + 1).padStart(2, '0')}
                        </td>

                        {/* Tiêu đề */}
                        <td style={{ padding: "13px 20px", fontWeight: 600, color: "#0f172a" }}>
                          {group.title}
                        </td>

                        {/* Kỹ năng */}
                        <td style={{ padding: "13px 20px" }}>
                          <span style={{ padding: "4px 8px", background: "#fdf4ff", border: "1px solid #fbcfe8", borderRadius: 4, fontSize: 12, color: "#b83280" }}>
                            {group.skill?.skill_name || group.skill_id}
                          </span>
                        </td>

                        {/* Phần thi - Bộ đề */}
                        <td style={{ padding: "13px 20px" }}>
                          {group.part ? (
                            <span style={{
                              padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                              background: "#e0e7ff",
                              color: "#4338ca",
                              border: "1px solid #c7d2fe",
                            }}>
                              ⭐ {group.part.part_name} - {group.part.test?.test_name || ''}
                            </span>
                          ) : (
                            <span style={{ fontStyle: "italic", color: "#cbd5e1", fontSize: 12 }}>Không có</span>
                          )}
                        </td>



                        {/* Thao tác */}
                        <td style={{ padding: "13px 20px", textAlign: "center", whiteSpace: "nowrap" }}>
                          <button onClick={() => setViewingGroup(group)} style={{ background: "none", border: "none", cursor: "pointer", color: "#10b981", marginRight: 8 }}>👁️ Xem</button>
                          <button onClick={() => openEditModal(group)} style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", marginRight: 8 }}>✏️ Sửa</button>
                          <button onClick={() => handleDelete(group)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}>🗑️ Xóa</button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Modal Thêm/Sửa ── */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content fade-up" style={{ maxHeight: "90vh", overflowY: "auto" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 18, color: "#0f172a" }}>{editingGroup ? "Sửa" : "Thêm"} Nhóm Câu Hỏi</h3>
              {formError && <div style={{ marginBottom: 16, padding: 10, borderRadius: 8, background: "#fff1f2", color: "#be123c", fontSize: 13 }}>{formError}</div>}

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#475569" }}>Kỹ năng <span style={{ color: "red" }}>*</span></label>
                <select className="form-control" value={formData.skill_id} onChange={(e) => setFormData({ ...formData, skill_id: e.target.value })}>
                  <option value="">-- Chọn kỹ năng --</option>
                  {cachedSkills.map(s => <option key={s.id} value={s.id}>{s.skill_name}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#475569" }}>Tiêu đề <span style={{ color: "red" }}>*</span></label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="form-control" placeholder="Nhập tiêu đề nhóm câu hỏi..." />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#475569" }}>Bài Đọc (Passage)</label>
                <select className="form-control" value={formData.passage_id} onChange={(e) => setFormData({ ...formData, passage_id: e.target.value, audio_id: "" })}>
                  <option value="">-- Không có --</option>
                  {cachedPassages.map(p => <option key={p.passage_id} value={p.passage_id}>{p.title}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#475569" }}>File Nghe (Audio)</label>
                <select className="form-control" value={formData.audio_id} onChange={(e) => setFormData({ ...formData, audio_id: e.target.value, passage_id: "" })}>
                  <option value="">-- Không có --</option>
                  {cachedAudios.map(a => <option key={a.audio_id} value={a.audio_id}>{a.audio_file}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#475569" }}>Phần thi - Bộ đề</label>
                <select className="form-control" value={formData.part_id} onChange={(e) => setFormData({ ...formData, part_id: e.target.value })}>
                  <option value="">-- Không chọn --</option>
                  {cachedTestParts.map((p: any) => <option key={p.part_id} value={p.part_id}>{p.part_name} - {p.test?.test_name}</option>)}
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? "Đang lưu..." : "Lưu"}</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Modal Xem chi tiết ── */}
        {viewingGroup && (
          <div className="modal-overlay" onClick={() => setViewingGroup(null)}>
            <div className="modal-content fade-up" style={{ maxWidth: 540 }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 22 }}>🗂️</span>
                  <h3 style={{ margin: 0, fontSize: 18, color: "#0f172a", fontWeight: "bold" }}>Chi tiết Nhóm Câu Hỏi</h3>
                </div>
                <button onClick={() => setViewingGroup(null)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#64748b", lineHeight: 1 }}>&times;</button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>

                {/* Mã nhóm */}
                <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", borderRadius: 8, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
                  <span style={{ fontWeight: 600, color: "#1d4ed8", fontSize: 13, width: 130, flexShrink: 0 }}>🔑 Mã nhóm:</span>
                  <span style={{ color: "#1e40af", fontSize: 14, fontWeight: 700 }}>{viewingGroup.group_id}</span>
                </div>

                {/* Tiêu đề */}
                <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <span style={{ fontWeight: 600, color: "#475569", fontSize: 13, width: 130, flexShrink: 0 }}>📝 Tiêu đề:</span>
                  <span style={{ color: "#0f172a", fontSize: 14, fontWeight: 600 }}>{viewingGroup.title}</span>
                </div>

                {/* Kỹ năng */}
                <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <span style={{ fontWeight: 600, color: "#475569", fontSize: 13, width: 130, flexShrink: 0 }}>🎯 Kỹ năng:</span>
                  <span style={{ padding: "4px 10px", background: "#fdf4ff", border: "1px solid #fbcfe8", borderRadius: 6, fontSize: 13, color: "#b83280", fontWeight: 500 }}>
                    {viewingGroup.skill?.skill_name || viewingGroup.skill_id}
                  </span>
                </div>

                {/* Mã Part - Passage */}
                {viewingGroup.passage_id && (
                  <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", borderRadius: 8, background: "#f0f9ff", border: "1px solid #bae6fd" }}>
                    <span style={{ fontWeight: 600, color: "#475569", fontSize: 13, width: 130, flexShrink: 0 }}>📖 Mã bài đọc:</span>
                    <span style={{ padding: "4px 10px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 6, fontSize: 13, color: "#1d4ed8", fontWeight: 600 }}>
                      {viewingGroup.passage_id}
                    </span>
                  </div>
                )}

                {/* Mã Part - Audio */}
                {viewingGroup.audio_id && (
                  <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", borderRadius: 8, background: "#faf5ff", border: "1px solid #ddd6fe" }}>
                    <span style={{ fontWeight: 600, color: "#475569", fontSize: 13, width: 130, flexShrink: 0 }}>🎧 Mã file nghe:</span>
                    <span style={{ padding: "4px 10px", background: "#f5f3ff", border: "1px solid #ddd6fe", borderRadius: 6, fontSize: 13, color: "#7c3aed", fontWeight: 600 }}>
                      {viewingGroup.audio_id}
                    </span>
                  </div>
                )}

                {/* Phần thi - Bộ đề */}
                {viewingGroup.part_id && (
                  <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", borderRadius: 8, background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                    <span style={{ fontWeight: 600, color: "#475569", fontSize: 13, width: 130, flexShrink: 0 }}>⭐ Phần thi:</span>
                    <span style={{ padding: "4px 10px", background: "#dcfce7", border: "1px solid #bbf7d0", borderRadius: 6, fontSize: 13, color: "#166534", fontWeight: 600 }}>
                      {viewingGroup.part?.part_name} - {viewingGroup.part?.test?.test_name}
                    </span>
                  </div>
                )}

                {/* Không có Part */}
                {!viewingGroup.passage_id && !viewingGroup.audio_id && !viewingGroup.part_id && (
                  <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                    <span style={{ fontWeight: 600, color: "#475569", fontSize: 13, width: 130, flexShrink: 0 }}>📎 Dữ liệu liên kết:</span>
                    <span style={{ fontStyle: "italic", color: "#cbd5e1", fontSize: 13 }}>Không có</span>
                  </div>
                )}



              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button className="btn btn-secondary" onClick={() => setViewingGroup(null)}>Đóng</button>
                <button className="btn btn-primary" onClick={() => { setViewingGroup(null); openEditModal(viewingGroup); }}>✏️ Chỉnh sửa</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
