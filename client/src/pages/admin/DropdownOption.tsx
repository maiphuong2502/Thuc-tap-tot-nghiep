import { useEffect, useState } from "react";
import dropdownOptionService from "../../services/dropdownOptionService";
import dropdownQuestionService from "../../services/dropdownQuestionService";
import { DropdownOption, DropdownOptionFormData } from "../../types/dropdown-option";
import { DropdownQuestion } from "../../types/dropdown-question";

export default function DropdownOptionPage() {
  const [dropdownOptions, setDropdownOptions] = useState<DropdownOption[]>([]);
  const [dropdownQuestions, setDropdownQuestions] = useState<DropdownQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<DropdownOption | null>(null);
  const [formData, setFormData] = useState<DropdownOptionFormData>({ 
      option_id: "", 
      question_id: "", 
      content: "",
      is_correct: false,
  });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadDropdownOptions = async () => {
    setLoading(true);
    setError("");
    try {
      const res: any = await dropdownOptionService.list();
      if (res?.success && Array.isArray(res.data)) {
        setDropdownOptions(res.data);
      } else if (res?.status === "success" && Array.isArray(res.data)) {
        setDropdownOptions(res.data);
      } else {
        setError("Không tải được danh sách đáp án chọn từ.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Có lỗi xảy ra khi tải danh sách.");
    } finally {
      setLoading(false);
    }
  };

  const loadDropdownQuestionsForDropdown = async () => {
    try {
      const res: any = await dropdownQuestionService.list();
      // Adjust according to the API response structure
      if (res?.success && Array.isArray(res.data)) {
        setDropdownQuestions(res.data);
      } else if (res?.status === "success" && Array.isArray(res.data)) {
        setDropdownQuestions(res.data);
      }
    } catch (err) {
      console.error("Failed to load dropdown questions", err);
    }
  };

  useEffect(() => {
    loadDropdownOptions();
    loadDropdownQuestionsForDropdown();
  }, []);

  const openAddModal = () => {
    setEditingOption(null);
    setFormData({ option_id: "", question_id: "", content: "", is_correct: false });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (opt: DropdownOption) => {
    setEditingOption(opt);
    setFormData({ 
      option_id: opt.option_id, 
      question_id: opt.question_id, 
      content: opt.content,
      is_correct: opt.is_correct
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingOption && !(formData.option_id && formData.option_id.trim())) {
      setFormError("Vui lòng nhập ID đáp án (VD: DO01).");
      return;
    }
    if (!formData.question_id) {
      setFormError("Vui lòng chọn Câu hỏi tương ứng.");
      return;
    }
    if (!formData.content.trim()) {
      setFormError("Vui lòng nhập nội dung đáp án.");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      if (editingOption) {
        await dropdownOptionService.update(editingOption.option_id, formData);
      } else {
        await dropdownOptionService.create(formData);
      }
      setIsModalOpen(false);
      loadDropdownOptions();
    } catch (err: any) {
      setFormError(err.response?.data?.message || err.message || "Có lỗi xảy ra.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (opt: DropdownOption) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa đáp án "${opt.option_id}"?`)) {
      try {
        await dropdownOptionService.delete(opt.option_id);
        loadDropdownOptions();
      } catch (err: any) {
        alert(err.response?.data?.message || err.message || "Lỗi khi xóa đáp án.");
      }
    }
  };

  const filteredOptions = dropdownOptions.filter(o => 
    o.option_id.toLowerCase().includes(search.toLowerCase()) || 
    o.question_id.toLowerCase().includes(search.toLowerCase()) || 
    o.content.toLowerCase().includes(search.toLowerCase())
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

        .checkbox-label {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            color: #0f172a;
        }
        
        .checkbox-input {
            width: 18px;
            height: 18px;
            cursor: pointer;
        }

        .correct-badge {
            background-color: #dcfce7;
            color: #166534;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            display: inline-block;
        }
        .wrong-badge {
            background-color: #f1f5f9;
            color: #64748b;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            display: inline-block;
        }
      `}</style>

      <div className="topic-wrap" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: "#3b82f6", textTransform: "uppercase", marginBottom: 6 }}>
              Hệ thống thi
            </p>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#0f172a", lineHeight: 1.2 }}>
              Quản lý Đáp Án Chọn Từ
            </h2>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#94a3b8" }}>
              Danh sách các lựa chọn đáp án dạng dropdown
            </p>
          </div>

          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <input 
              type="text" 
              className="search-input" 
              placeholder="🔍 Tìm theo ID hoặc nội dung..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 16px", borderRadius: 12,
              background: "#eff6ff", border: "1px solid #bfdbfe",
            }}>
              <span style={{ fontSize: 12, color: "#3b82f6", fontWeight: 500 }}>Tổng</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#1d4ed8" }}>{filteredOptions.length}</span>
              <span style={{ fontSize: 12, color: "#3b82f6", fontWeight: 500 }}>đáp án</span>
            </div>
            <button className="btn btn-primary" onClick={openAddModal}>
              + Thêm Đáp Án
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
              Danh sách lựa chọn
            </span>
            {loading && <span className="spinner" />}
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Option ID", "Question ID", "Nội dung", "Trạng thái", "Thao tác"].map((h, i) => (
                    <th key={i} style={{
                      padding: "10px 20px", textAlign: i === 4 ? "right" : "left",
                      color: "#64748b", fontWeight: 600, fontSize: 12,
                      letterSpacing: "0.05em", textTransform: "uppercase",
                      borderBottom: "1px solid #e2e8f0",
                      width: i === 0 || i === 1 ? 120 : i === 4 ? 150 : "auto",
                      whiteSpace: i === 0 || i === 1 ? "nowrap" : "normal",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} style={{ padding: "40px 20px", textAlign: "center", color: "#94a3b8" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                        <span className="spinner" style={{ width: 24, height: 24 }} />
                        <span>Đang tải dữ liệu...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredOptions.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: "48px 20px", textAlign: "center", color: "#94a3b8" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 32 }}>📭</span>
                        <span style={{ fontWeight: 500 }}>Không tìm thấy đáp án</span>
                        <span style={{ fontSize: 12 }}>Dữ liệu sẽ hiển thị khi được thêm vào hệ thống</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOptions.map((o, index) => {
                    return (
                      <tr
                        key={o.option_id}
                        className="topic-row fade-up"
                        style={{
                          borderTop: "1px solid #f1f5f9", background: "#fff",
                          animationDelay: `${index * 40}ms`,
                        }}
                      >
                        <td style={{ padding: "13px 20px", color: "#64748b", fontWeight: 600, fontSize: 13, whiteSpace: "nowrap" }}>
                          {o.option_id}
                        </td>
                        <td style={{ padding: "13px 20px", color: "#3b82f6", fontWeight: 500, fontSize: 13, whiteSpace: "nowrap" }}>
                          {o.question_id}
                        </td>
                        <td style={{ padding: "13px 20px", color: "#334155", fontWeight: 500 }}>
                          {o.content}
                        </td>
                        <td style={{ padding: "13px 20px" }}>
                           <span className={o.is_correct ? "correct-badge" : "wrong-badge"}>
                               {o.is_correct ? "Đáp án Đúng" : "Sai"}
                           </span>
                        </td>
                        <td style={{ padding: "13px 20px", textAlign: "right", whiteSpace: "nowrap" }}>
                          <button onClick={() => openEditModal(o)} style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", marginRight: 10 }}>✏️ Chỉnh sửa</button>
                          <button onClick={() => handleDelete(o)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}>❌ Xóa</button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content fade-up">
              <h3 style={{ margin: "0 0 16px", fontSize: 18, color: "#0f172a" }}>
                {editingOption ? "Chỉnh sửa Đáp Án Chọn Từ" : "Thêm Đáp Án Chọn Từ"}
              </h3>

              {formError && (
                <div style={{ marginBottom: 16, padding: 10, borderRadius: 8, background: "#fff1f2", color: "#be123c", fontSize: 13 }}>
                  {formError}
                </div>
              )}

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#475569" }}>
                  Option ID <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.option_id || ""}
                  onChange={(e) => setFormData({ ...formData, option_id: e.target.value })}
                  disabled={!!editingOption}
                  placeholder="Nhập Option ID (VD: DO01)"
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 8,
                    border: "1px solid #cbd5e1", fontSize: 14, outline: "none",
                    background: editingOption ? "#f1f5f9" : "#fff", 
                    color: editingOption ? "#94a3b8" : "#0f172a",
                    transition: "border 0.2s"
                  }}
                  onFocus={(e) => !editingOption && (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => !editingOption && (e.target.style.borderColor = "#cbd5e1")}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#475569" }}>
                  Câu Hỏi (Question ID) <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  value={formData.question_id}
                  onChange={(e) => setFormData({ ...formData, question_id: e.target.value })}
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 8,
                    border: "1px solid #cbd5e1", fontSize: 14, outline: "none",
                    transition: "border 0.2s",
                    background: "#fff"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                  onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
                >
                  <option value="">-- Chọn câu hỏi dropdown --</option>
                  {dropdownQuestions.map(q => (
                    <option key={q.question_id} value={q.question_id}>
                      {q.question_id} - {q.content ? (q.content.length > 50 ? q.content.substring(0, 50) + "..." : q.content) : "---"}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#475569" }}>
                  Nội dung đáp án <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Nhập nội dung hiển thị của lựa chọn..."
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 8,
                    border: "1px solid #cbd5e1", fontSize: 14, outline: "none",
                    transition: "border 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                  onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={formData.is_correct}
                    onChange={(e) => setFormData({ ...formData, is_correct: e.target.checked })}
                  />
                  Đây là đáp án ĐÚNG (is_correct)
                </label>
                <p style={{ margin: "6px 0 0", fontSize: 11, color: "#94a3b8", fontStyle: "italic" }}>
                  * Lưu ý: Mỗi câu hỏi chỉ được phép có 1 đáp án đúng.
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Hủy
                </button>
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
