import { useEffect, useState } from "react";
import testPartService from "../../services/testPartService";
import testService from "../../services/testService";
import skillService from "../../services/skillService";
import { ITestPart } from "../../types/test-part";
import { ITest } from "../../types/test";
import { ISkill } from "../../types/skill";

export default function TestPart() {
  const [testParts, setTestParts] = useState<ITestPart[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [search, setSearch] = useState("");
  const [filterTestId, setFilterTestId] = useState("");
  const [filterSkillId, setFilterSkillId] = useState("");

  const [tests, setTests] = useState<ITest[]>([]);
  const [skills, setSkills] = useState<ISkill[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<ITestPart | null>(null);
  const [formData, setFormData] = useState({ 
    test_id: "", 
    skill_id: "", 
    part_name: "", 
    order_index: 1 
  });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadOptions = async () => {
    try {
      const [testRes, skillRes] = await Promise.all([
        testService.list(""),
        skillService.list()
      ]);
      if (testRes?.data?.data) {
        setTests(testRes.data.data);
      } else if (testRes?.data) {
        setTests(testRes.data as unknown as ITest[]);
      }
      if (skillRes?.data?.data) {
        setSkills(skillRes.data.data);
      } else if (skillRes?.data) {
        setSkills(skillRes.data as unknown as ISkill[]);
      }
    } catch (err) {
      console.error("Failed to load options", err);
    }
  };

  const loadTestParts = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        search: search.trim() || undefined,
        test_id: filterTestId || undefined,
        skill_id: filterSkillId || undefined,
        per_page: 100
      };
      const res: any = await testPartService.list(params);
      const data = res?.data?.data || res?.data || [];
      if (Array.isArray(data)) {
        setTestParts(data);
      } else {
        setTestParts([]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Có lỗi xảy ra khi tải danh sách phần thi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOptions(); }, []);
  useEffect(() => { loadTestParts(); }, [search, filterTestId, filterSkillId]);

  const resetFilters = () => {
    setSearch("");
    setFilterTestId("");
    setFilterSkillId("");
  };

  const openAddModal = () => {
    setEditingPart(null);
    setFormData({ test_id: filterTestId, skill_id: filterSkillId, part_name: "", order_index: testParts.length + 1 });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (part: ITestPart) => {
    setEditingPart(part);
    setFormData({ 
      test_id: part.test_id, 
      skill_id: part.skill_id, 
      part_name: part.part_name, 
      order_index: part.order_index 
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.test_id) return setFormError("Vui lòng chọn bộ đề.");
    if (!formData.skill_id) return setFormError("Vui lòng chọn kỹ năng.");
    if (!formData.part_name.trim()) return setFormError("Vui lòng nhập tên phần thi.");
    if (!formData.order_index || formData.order_index < 1) return setFormError("Thứ tự không hợp lệ.");

    setSaving(true);
    setFormError("");
    try {
      if (editingPart) {
        await testPartService.update(editingPart.part_id, {
          part_name: formData.part_name,
          skill_id: formData.skill_id,
          order_index: formData.order_index
        });
      } else {
        await testPartService.create(formData);
      }
      setIsModalOpen(false);
      loadTestParts();
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Có lỗi xảy ra khi lưu.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (part: ITestPart) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa phần "${part.part_name}"?`)) {
      try {
        await testPartService.delete(part.part_id);
        loadTestParts();
      } catch (err: any) {
        alert(err.response?.data?.message || "Lỗi khi xóa phần thi. Có thể phần thi đang có câu hỏi.");
      }
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');

        .test-part-wrap * { box-sizing: border-box; font-family: 'Be Vietnam Pro', sans-serif; }
        .test-part-row { transition: background 0.15s; }
        .test-part-row:hover { background: #f0f7ff !important; }

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

        .form-control {
          padding: 10px 14px; border-radius: 8px; border: 1px solid #cbd5e1; 
          outline: none; transition: border 0.2s; width: 100%; font-size: 14px;
        }
        .form-control:focus { border-color: #3b82f6; }
        
        .filter-select {
          padding: 10px 14px; border-radius: 8px; border: 1px solid #cbd5e1; outline: none; background: white;
        }
        
        .modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(2px);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: white; border-radius: 16px; width: 100%; max-width: 450px;
          padding: 24px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      <div className="test-part-wrap" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: "#3b82f6", textTransform: "uppercase", marginBottom: 6 }}>
              Hệ thống thi
            </p>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#0f172a", lineHeight: 1.2 }}>
              Quản lý Phần Thi Bộ Đề
            </h2>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#94a3b8" }}>
              Cấu trúc các phần trong từng bộ đề
            </p>
          </div>

          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <select 
              className="filter-select" 
              value={filterTestId} 
              onChange={(e) => setFilterTestId(e.target.value)}
            >
              <option value="">-- Tất cả bộ đề --</option>
              {tests.map(t => <option key={t.test_id} value={t.test_id}>{t.test_name}</option>)}
            </select>

            <select 
              className="filter-select" 
              value={filterSkillId} 
              onChange={(e) => setFilterSkillId(e.target.value)}
            >
              <option value="">-- Tất cả kỹ năng --</option>
              {skills.map(s => <option key={s.id} value={s.id}>{s.skill_name}</option>)}
            </select>

            <div style={{ display: "flex", gap: 8 }}>
              <input 
                type="text" 
                placeholder="Tìm phần thi..." 
                className="form-control"
                style={{ width: 200 }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="btn btn-secondary" onClick={resetFilters}>Làm mới</button>
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 16px", borderRadius: 12,
              background: "#eff6ff", border: "1px solid #bfdbfe",
            }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#1d4ed8" }}>{testParts.length}</span>
              <span style={{ fontSize: 12, color: "#3b82f6", fontWeight: 500 }}>phần</span>
            </div>
            <button className="btn btn-primary" onClick={openAddModal}>
              + Thêm phần thi
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
              Danh sách phần thi
            </span>
            {loading && <span className="spinner" />}
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Mã", "Bộ đề", "Tên phần thi", "Kỹ năng", "Thứ tự", "Thao tác"].map((h, i) => (
                    <th key={i} style={{
                      padding: "10px 20px",
                      textAlign: i === 4 || i === 5 ? "center" : "left",
                      color: "#64748b", fontWeight: 600, fontSize: 12,
                      letterSpacing: "0.05em", textTransform: "uppercase",
                      borderBottom: "1px solid #e2e8f0"
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading && testParts.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: "40px 20px", textAlign: "center", color: "#94a3b8" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                        <span className="spinner" style={{ width: 24, height: 24 }} />
                        <span>Đang tải dữ liệu...</span>
                      </div>
                    </td>
                  </tr>
                ) : testParts.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: "48px 20px", textAlign: "center", color: "#94a3b8" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 32 }}>📭</span>
                        <span style={{ fontWeight: 500 }}>Không tìm thấy phần thi nào</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  testParts.map((part, index) => (
                    <tr
                      key={part.part_id}
                      className="test-part-row fade-up"
                      style={{ borderTop: "1px solid #f1f5f9", background: "#fff", animationDelay: `${index * 20}ms` }}
                    >
                      {/* Mã */}
                      <td style={{ padding: "13px 20px", color: "#64748b", fontSize: 12 }}>
                        {part.part_id}
                      </td>

                      {/* Bộ đề */}
                      <td style={{ padding: "13px 20px" }}>
                        <span style={{
                          padding: "4px 8px", background: "#f1f5f9", borderRadius: 4, fontSize: 12, color: "#475569"
                        }}>
                          {part.test?.test_name || part.test_id}
                        </span>
                      </td>

                      {/* Tên phần thi */}
                      <td style={{ padding: "13px 20px", fontWeight: 600, color: "#0f172a" }}>
                        {part.part_name}
                      </td>

                      {/* Kỹ năng */}
                      <td style={{ padding: "13px 20px" }}>
                        <span style={{
                          padding: "4px 8px", background: "#fdf4ff", border: "1px solid #fbcfe8", borderRadius: 4, fontSize: 12, color: "#b83280"
                        }}>
                          {part.skill?.skill_name || part.skill_id}
                        </span>
                      </td>

                      {/* Thứ tự */}
                      <td style={{ padding: "13px 20px", textAlign: "center", fontWeight: 600, color: "#0f172a" }}>
                        {part.order_index}
                      </td>

                      {/* Thao tác */}
                      <td style={{ padding: "13px 20px", textAlign: "center", whiteSpace: "nowrap" }}>
                        <button onClick={() => openEditModal(part)} style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", marginRight: 10 }}>✏️</button>
                        <button onClick={() => handleDelete(part)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}>🗑️</button>
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
                {editingPart ? "Chỉnh sửa phần thi" : "Thêm phần thi mới"}
              </h3>

              {formError && (
                <div style={{ marginBottom: 16, padding: 10, borderRadius: 8, background: "#fff1f2", color: "#be123c", fontSize: 13 }}>
                  {formError}
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#475569" }}>
                  Thuộc bộ đề <span style={{ color: "red" }}>*</span>
                </label>
                <select 
                  className="form-control" 
                  value={formData.test_id}
                  onChange={(e) => setFormData({...formData, test_id: e.target.value})}
                  disabled={!!editingPart}
                >
                  <option value="">-- Chọn bộ đề --</option>
                  {tests.map(t => <option key={t.test_id} value={t.test_id}>{t.test_name}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#475569" }}>
                  Kỹ năng <span style={{ color: "red" }}>*</span>
                </label>
                <select 
                  className="form-control" 
                  value={formData.skill_id}
                  onChange={(e) => setFormData({...formData, skill_id: e.target.value})}
                >
                  <option value="">-- Chọn kỹ năng --</option>
                  {skills.map(s => <option key={s.id} value={s.id}>{s.skill_name}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#475569" }}>
                  Tên phần thi (Part Name) <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.part_name}
                  onChange={(e) => setFormData({ ...formData, part_name: e.target.value })}
                  placeholder="Ví dụ: Listening Part 1"
                  className="form-control"
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#475569" }}>
                  Thứ tự hiển thị (Order Index) <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 1 })}
                  className="form-control"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Hủy
                </button>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? "Đang lưu..." : "Lưu phần thi"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}