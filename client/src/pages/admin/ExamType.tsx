import { useEffect, useState } from "react";
import examTypeService from "../../services/examTypeService";
import { ExamType } from "../../types/examType";

// ── Icon map ────────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, string> = {
  "academic":         "🎓",
  "general training": "📋",
  "mini test":        "⚡",
  "full test":        "📝",
  "listening test":   "🎧",
  "listening":        "🎧",
  "reading test":     "📖",
  "reading":          "📖",
  "writing task 1":   "📊",
  "writing task 2":   "✍️",
  "writing":          "✍️",
  "speaking test":    "🎤",
  "speaking":         "🎤",
  "practice set":     "🗂️",
};

function getIcon(name: string): string {
  const key = name.toLowerCase().trim();
  for (const k of Object.keys(ICON_MAP)) {
    if (key.includes(k)) return ICON_MAP[k];
  }
  return "📄";
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// ── Styles ──────────────────────────────────────────────────────────────────
const S: Record<string, React.CSSProperties> = {
  page: {
    padding: "32px 40px",
    fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
    background: "#f0f2f5",
    minHeight: "100vh",
  },

  // Header
  pageHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  pageTag: {
    fontSize: 11,
    fontWeight: 700,
    color: "#1677ff",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: 6,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: 800,
    color: "#0a0a0a",
    letterSpacing: "-0.4px",
    margin: "0 0 5px",
  },
  pageDesc: {
    fontSize: 13,
    color: "#666",
    margin: 0,
  },
  totalBadge: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    border: "1.5px solid #1677ff",
    borderRadius: 8,
    padding: "8px 18px",
    fontSize: 13,
    color: "#1677ff",
    fontWeight: 500,
    background: "#fff",
    whiteSpace: "nowrap",
  },
  totalNum: {
    fontSize: 18,
    fontWeight: 800,
    color: "#1677ff",
  },

  // Error
  errorBox: {
    padding: "12px 16px",
    borderRadius: 8,
    background: "#fff1f0",
    color: "#cf1322",
    border: "1px solid #ffa39e",
    fontSize: 13,
    marginBottom: 20,
  },

  // Table card
  tableCard: {
    background: "#fff",
    borderRadius: 12,
    border: "1px solid #e8e8e8",
    overflow: "hidden",
  },
  toolbar: {
    padding: "14px 22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #f0f0f0",
  },
  toolbarTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#0f172a",
  },
  toolbarRight: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  searchWrap: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    border: "1px solid #d9d9d9",
    borderRadius: 7,
    padding: "7px 13px",
    background: "#fafafa",
  },
  searchInput: {
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: 13,
    fontFamily: "inherit",
    color: "#0f172a",
    width: 190,
  },

  // Buttons
  btnPrimary: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "7px 16px",
    borderRadius: 7,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    border: "none",
    fontFamily: "inherit",
    background: "#1677ff",
    color: "#fff",
  },
  btnGhost: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "7px 16px",
    borderRadius: 7,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    background: "#fff",
    border: "1px solid #d9d9d9",
    color: "#444",
  },

  // Table
  th: {
    padding: "10px 20px",
    fontSize: 11,
    fontWeight: 700,
    color: "#888",
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    textAlign: "left",
    borderBottom: "1px solid #f0f0f0",
    background: "#fafafa",
  },
  td: {
    padding: "15px 20px",
    verticalAlign: "middle",
  },
  numCell: {
    fontSize: 13,
    fontWeight: 700,
    color: "#999",
  },
  nameCell: {
    display: "flex",
    alignItems: "center",
    gap: 13,
  },
  nameIcon: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    flexShrink: 0,
    lineHeight: 1,
  },
  nameText: {
    fontSize: 14,
    fontWeight: 700,
    color: "#0f172a",
  },
  descCell: {
    fontSize: 13,
    color: "#444",
    lineHeight: 1.55,
  },
  actionCell: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    justifyContent: "flex-end",
  },
  actEdit: {
  padding: "5px 13px",
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  border: "1px solid #c4c4c4",   // ← đậm hơn từ #d9d9d9
  background: "transparent",
  color: "#333",                  // ← đậm hơn từ #444
  fontFamily: "inherit",
},
  actDel: {
  padding: "5px 13px",
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  border: "1px solid #e8c4c4",   // ← thêm viền đỏ nhạt
  background: "#fff5f5",          // ← nền đỏ nhạt luôn
  color: "#e03131",               // ← đỏ đậm hơn từ #bbb
  fontFamily: "inherit",
},

  // Footer
  tableFoot: {
    padding: "12px 22px",
    borderTop: "1px solid #f0f0f0",
    display: "flex",
    justifyContent: "flex-end",
  },
  footTxt: {
    fontSize: 12,
    color: "#aaa",
  },

  // Empty / loading
  empty: {
    textAlign: "center",
    padding: "48px 0",
    color: "#bbb",
    fontSize: 13,
  },

  // Modal overlay
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.28)",
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    background: "#fff",
    borderRadius: 12,
    width: 460,
    boxShadow: "0 16px 56px rgba(0,0,0,0.16)",
    overflow: "hidden",
  },
  modalHead: {
    background: "#1677ff",
    padding: "20px 22px",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  modalHeadIcon: {
    width: 36,
    height: 36,
    background: "rgba(255,255,255,0.18)",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 800,
    color: "#fff",
    marginBottom: 3,
    margin: "0 0 3px",
  },
  modalSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.72)",
    margin: 0,
  },
  modalClose: {
    width: 28,
    height: 28,
    background: "rgba(255,255,255,0.18)",
    border: "none",
    borderRadius: 6,
    color: "#fff",
    fontSize: 18,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    lineHeight: 1,
  },
  modalBody: {
    padding: "22px 22px 8px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  fieldLabel: {
    display: "block",
    fontSize: 11.5,
    fontWeight: 700,
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: 6,
  },
  req: {
    color: "#ff4d4f",
    marginLeft: 2,
  },
  fieldInp: {
    width: "100%",
    padding: "10px 13px",
    border: "1.5px solid #e8e8e8",
    borderRadius: 8,
    fontSize: 13.5,
    fontFamily: "inherit",
    color: "#0f172a",
    background: "#fafafa",
    outline: "none",
    display: "block",
  },
  fieldTa: {
    width: "100%",
    padding: "10px 13px",
    border: "1.5px solid #e8e8e8",
    borderRadius: 8,
    fontSize: 13.5,
    fontFamily: "inherit",
    color: "#0f172a",
    background: "#fafafa",
    outline: "none",
    resize: "none",
    minHeight: 82,
    lineHeight: 1.6,
    display: "block",
  },
  modalDiv: {
    height: 1,
    background: "#f0f0f0",
    margin: "8px 0 0",
  },
  modalFoot: {
    padding: "14px 22px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
  },
};

// ── Modal dùng chung ─────────────────────────────────────────────────────────
function Modal({
  title,
  subtitle,
  form,
  onChange,
  onSubmit,
  onClose,
}: {
  title: string;
  subtitle: string;
  form: { category_name: string; description: string };
  onChange: (f: { category_name: string; description: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}) {
  return (
    <div
      style={S.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={S.modal}>
        {/* Header xanh */}
        <div style={S.modalHead}>
          <div>
            <div style={S.modalHeadIcon}>
              <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2.2" viewBox="0 0 16 16">
                <rect x="2" y="2" width="12" height="12" rx="2" />
                <path d="M5 6h6M5 9.5h4" />
              </svg>
            </div>
            <p style={S.modalTitle}>{title}</p>
            <p style={S.modalSub}>{subtitle}</p>
          </div>
          <button style={S.modalClose} onClick={onClose}>×</button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit}>
          <div style={S.modalBody}>
            {/* Tên loại */}
            <div>
              <label style={S.fieldLabel}>
                Tên loại đề <span style={S.req}>*</span>
              </label>
              <input
                required
                style={S.fieldInp}
                placeholder="Ví dụ: Academic, Full Test, Mini Test..."
                value={form.category_name}
                onChange={(e) =>
                  onChange({ ...form, category_name: e.target.value })
                }
              />
            </div>

            {/* Mô tả */}
            <div>
              <label style={S.fieldLabel}>Mô tả</label>
              <textarea
                style={S.fieldTa}
                placeholder="Mô tả ngắn về mục đích của loại đề thi này..."
                value={form.description}
                onChange={(e) =>
                  onChange({ ...form, description: e.target.value })
                }
              />
            </div>
          </div>

          <div style={S.modalDiv} />

          <div style={S.modalFoot}>
            <button type="button" style={S.btnGhost} onClick={onClose}>
              Huỷ bỏ
            </button>
            <button type="submit" style={S.btnPrimary}>
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 16 16">
                <path d="M3 8l4 4 6-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Lưu lại
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Page chính ───────────────────────────────────────────────────────────────
export default function ExamTypePage() {
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [search, setSearch]       = useState("");

  const [creating, setCreating]   = useState(false);
  const [createForm, setCreateForm] = useState({ category_name: "", description: "" });

  const [editing, setEditing]     = useState<ExamType | null>(null);
  const [editForm, setEditForm]   = useState({ category_name: "", description: "" });

  // Load danh sách
  const loadExamTypes = async () => {
    setLoading(true);
    setError("");
    try {
      const res: any = await examTypeService.list();
      if (res?.success && Array.isArray(res.data)) {
        setExamTypes(res.data);
      } else {
        setError("Không tải được danh sách loại đề thi.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Có lỗi xảy ra khi tải danh sách.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadExamTypes(); }, []);

  // Thêm mới
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await examTypeService.create(createForm);
      setCreateForm({ category_name: "", description: "" });
      setCreating(false);
      await loadExamTypes();
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể thêm mới.");
    }
  };

  // Cập nhật
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setError("");
    try {
      await examTypeService.update(editing.category_id, editForm);
      setEditing(null);
      await loadExamTypes();
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể cập nhật.");
    }
  };

  // Xóa
  const handleDelete = async (examType: ExamType) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa "${examType.category_name}"?`
    );
    if (!confirmed) return;
    try {
      await examTypeService.remove(examType.category_id);
      await loadExamTypes();
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể xóa. Vui lòng thử lại.");
    }
  };

  // Filter tìm kiếm
  const filtered = examTypes.filter(
    (e) =>
      e.category_name.toLowerCase().includes(search.toLowerCase()) ||
      (e.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={S.page}>

      {/* ── PAGE HEADER ── */}
      <div style={S.pageHeader}>
        <div>
          <div style={S.pageTag}>Hệ thống thi</div>
          <h1 style={S.pageTitle}>Loại đề thi</h1>
          <p style={S.pageDesc}>Danh mục phân loại các định dạng đề thi</p>
        </div>
        <div style={S.totalBadge}>
          Tổng&nbsp;
          <span style={S.totalNum}>{examTypes.length}</span>
          &nbsp;loại đề
        </div>
      </div>

      {/* ── ERROR ── */}
      {error && <div style={S.errorBox}>{error}</div>}

      {/* ── TABLE CARD ── */}
      <div style={S.tableCard}>

        {/* Toolbar */}
        <div style={S.toolbar}>
          <span style={S.toolbarTitle}>Danh sách loại đề thi</span>
          <div style={S.toolbarRight}>

            {/* Tìm kiếm */}
            <div style={S.searchWrap}>
              <svg width="13" height="13" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 16 16">
                <circle cx="6.5" cy="6.5" r="5" />
                <path d="M10.5 10.5L14 14" />
              </svg>
              <input
                style={S.searchInput}
                placeholder="Tìm kiếm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Thêm mới */}
            <button
              style={S.btnPrimary}
              onClick={() => { setCreating(true); setError(""); }}
            >
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 16 16">
                <path d="M8 3v10M3 8h10" strokeLinecap="round" />
              </svg>
              Thêm loại đề
            </button>
          </div>
        </div>

        {/* Table */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ ...S.th, width: 60 }}>#</th>
              <th style={{ ...S.th, width: 230 }}>Loại đề</th>
              <th style={S.th}>Mô tả</th>
              <th style={{ ...S.th, textAlign: "right", paddingRight: 22 }}>
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} style={S.empty}>Đang tải dữ liệu...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4} style={S.empty}>Không tìm thấy kết quả nào</td>
              </tr>
            ) : (
              filtered.map((ext, idx) => (
                <tr
                  key={ext.category_id}
                  style={{
                    borderBottom:
                      idx < filtered.length - 1 ? "1px solid #f5f5f5" : "none",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f8f9ff")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  {/* Số thứ tự */}
                  <td style={S.td}>
                    <span style={S.numCell}>{pad(idx + 1)}</span>
                  </td>

                  {/* Tên loại + icon */}
                  <td style={S.td}>
                    <div style={S.nameCell}>
                      <div style={S.nameIcon}>
                        {getIcon(ext.category_name)}
                      </div>
                      <span style={S.nameText}>{ext.category_name}</span>
                    </div>
                  </td>

                  {/* Mô tả */}
                  <td style={S.td}>
                    <span style={S.descCell}>{ext.description || "—"}</span>
                  </td>

                  {/* Hành động */}
                  <td style={{ ...S.td, textAlign: "right" }}>
                    <div style={S.actionCell}>
                      <button
                        style={S.actEdit}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#1677ff";
                          e.currentTarget.style.color = "#1677ff";
                          e.currentTarget.style.background = "#f0f6ff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#c4c4c4";
                          e.currentTarget.style.color = "#333";
                          e.currentTarget.style.background = "transparent";
                        }}
                        onClick={() => {
                          setEditing(ext);
                          setEditForm({
                            category_name: ext.category_name,
                            description: ext.description,
                          });
                          setError("");
                        }}
                      >
                        Sửa
                      </button>
                      <button
                        style={S.actDel}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#ffa39e";
                          e.currentTarget.style.color = "#ff4d4f";
                          e.currentTarget.style.background = "#fff1f0";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor ="#e8c4c4";
                          e.currentTarget.style.color = "#e03131";
                          e.currentTarget.style.background = "transparent";
                        }}
                        onClick={() => handleDelete(ext)}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Footer */}
        <div style={S.tableFoot}>
          <span style={S.footTxt}>Hiển thị {filtered.length} loại đề</span>
        </div>
      </div>

      {/* ── MODAL THÊM MỚI ── */}
      {creating && (
        <Modal
          title="Thêm loại đề thi"
          subtitle="Điền đầy đủ thông tin bên dưới"
          form={createForm}
          onChange={setCreateForm}
          onSubmit={handleCreate}
          onClose={() => {
            setCreating(false);
            setCreateForm({ category_name: "", description: "" });
          }}
        />
      )}

      {/* ── MODAL CHỈNH SỬA ── */}
      {editing && (
        <Modal
          title="Chỉnh sửa loại đề"
          subtitle={`Đang sửa: ${editing.category_name}`}
          form={editForm}
          onChange={setEditForm}
          onSubmit={handleEdit}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}