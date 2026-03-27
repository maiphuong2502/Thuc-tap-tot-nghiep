import { useEffect, useMemo, useState } from "react";
import userService from "../../services/userService";

function useCurrentUser() {
  return useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);
}

function roleLabel(role) {
  return role === 0 ? "Admin" : "User";
}

function statusLabel(status) {
  return status === 1 ? "Active" : "Inactive";
}

export default function Users() {
  const currentUser = useCurrentUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    username: "",
    email: "",
    password: "",
    role: 1,
    status: 1,
  });

  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    user_id: null,
    username: "",
    email: "",
    password: "",
    role: 0,
    status: 1,
  });

  const canEditUser = (user) => {
    if (!currentUser) return false;
    // Admin luôn được sửa user; với admin chỉ sửa được chính mình
    if (user.role === 0) {
      return currentUser.user_id === user.user_id;
    }
    return true;
  };

  const canDeleteUser = (user) => {
    if (!currentUser) return false;
    // Chỉ cho phép xóa tài khoản role = user
    return user.role === 1;
  };

  const loadUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res: any = await userService.list();
      if (res?.success && Array.isArray(res.data)) {
        setUsers(res.data);
      } else {
        setError("Không tải được danh sách tài khoản.");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Có lỗi xảy ra khi tải danh sách tài khoản.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeCreate = (field, value) => {
    setCreateForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await userService.create({
        username: createForm.username.trim(),
        email: createForm.email.trim(),
        password: createForm.password,
        role: Number(createForm.role),
        status: Number(createForm.status),
      });
      setCreateForm({
        username: "",
        email: "",
        password: "",
        role: 1,
        status: 1,
      });
      setCreating(false);
      await loadUsers();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {})[0]?.[0] ||
        "Không thể thêm tài khoản.";
      setError(msg);
    }
  };

  const openEdit = (user) => {
    if (!canEditUser(user)) return;
    setEditForm({
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
      status: user.status,
    });
    setEditing(true);
  };

  const handleChangeEdit = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!editForm.user_id) return;
    setError("");
    try {
      const payload: any = {
        username: editForm.username.trim(),
        email: editForm.email.trim(),
        role: Number(editForm.role),
        status: Number(editForm.status),
      };
      if (editForm.password) {
        payload.password = editForm.password;
      }

      await userService.update(editForm.user_id, payload);

      // Nếu là user hiện tại, cập nhật luôn localStorage để đồng bộ hiển thị
      if (currentUser && currentUser.user_id === editForm.user_id) {
        const updatedUser = {
          ...currentUser,
          username: payload.username,
          email: payload.email,
          role: payload.role,
          status: payload.status,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      setEditing(false);
      await loadUsers();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {})[0]?.[0] ||
        "Không thể cập nhật tài khoản.";
      setError(msg);
    }
  };

  const handleDelete = async (user) => {
    if (!canDeleteUser(user)) return;
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa tài khoản "${user.username}"?`
    );
    if (!confirmed) return;

    setError("");
    try {
      await userService.remove(user.user_id);
      await loadUsers();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Không thể xóa tài khoản. Vui lòng thử lại.";
      setError(msg);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {/* Header + actions */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            Quản lý tài khoản
          </h2>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 13,
              color: "#6b7280",
            }}
          >
            Xem danh sách tài khoản, thêm mới và chỉnh sửa thông tin của chính
            bạn.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreating(true)}
          style={{
            padding: "9px 16px",
            borderRadius: 999,
            border: "none",
            background:
              "linear-gradient(135deg, rgba(56,189,248,1), rgba(129,140,248,1))",
            color: "#0b1120",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 10px 25px rgba(56,189,248,.35)",
            whiteSpace: "nowrap",
          }}
        >
          + Thêm tài khoản
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#b91c1c",
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      {/* List */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: 18,
          border: "1px solid rgba(209,213,219,1)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "14px 18px",
            borderBottom: "1px solid rgba(229,231,235,1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: 13,
              color: "#6b7280",
            }}
          >
            Tổng cộng:{" "}
            <strong style={{ color: "#111827" }}>{users.length}</strong> tài
            khoản
          </span>
          {loading && (
            <span style={{ fontSize: 12, color: "#6b7280" }}>Đang tải...</span>
          )}
        </div>

        <div
          style={{
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 13,
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#f9fafb",
                  color: "#6b7280",
                  textAlign: "left",
                }}
              >
                <th style={{ padding: "10px 18px", fontWeight: 500 }}>ID</th>
                <th style={{ padding: "10px 18px", fontWeight: 500 }}>
                  Username
                </th>
                <th style={{ padding: "10px 18px", fontWeight: 500 }}>Email</th>
                <th style={{ padding: "10px 18px", fontWeight: 500 }}>Role</th>
                <th style={{ padding: "10px 18px", fontWeight: 500 }}>
                  Trạng thái
                </th>
                <th style={{ padding: "10px 18px", fontWeight: 500 }}>
                  Ngày tạo
                </th>
                <th style={{ padding: "10px 18px", fontWeight: 500 }}>
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: "16px 18px",
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    Chưa có tài khoản nào.
                  </td>
                </tr>
              )}

              {users.map((user, index) => {
                const canEdit = canEditUser(user);
                const canDelete = canDeleteUser(user);
                return (
                  <tr
                    key={user.user_id}
                    style={{
                      borderTop: "1px solid rgba(229,231,235,1)",
                      background: index % 2 === 0 ? "#ffffff" : "#f9fafb",
                    }}
                  >
                    <td style={{ padding: "9px 18px", color: "#6b7280" }}>
                      {user.user_id}
                    </td>
                    <td style={{ padding: "9px 18px", color: "#111827" }}>
                      {user.username}
                    </td>
                    <td style={{ padding: "9px 18px", color: "#4b5563" }}>
                      {user.email}
                    </td>
                    <td style={{ padding: "9px 18px" }}>
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 600,
                          background:
                            user.role === 0
                              ? "rgba(56,189,248,.15)"
                              : "rgba(52,211,153,.12)",
                          color:
                            user.role === 0 ? "#38bdf8" : "rgb(52,211,153)",
                          border:
                            user.role === 0
                              ? "1px solid rgba(56,189,248,.4)"
                              : "1px solid rgba(52,211,153,.4)",
                        }}
                      >
                        {roleLabel(user.role)}
                      </span>
                    </td>
                    <td style={{ padding: "9px 18px" }}>
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 600,
                          background:
                            user.status === 1
                              ? "rgba(52,211,153,.12)"
                              : "rgba(248,113,113,.12)",
                          color:
                            user.status === 1
                              ? "rgb(52,211,153)"
                              : "rgb(248,113,113)",
                          border:
                            user.status === 1
                              ? "1px solid rgba(52,211,153,.4)"
                              : "1px solid rgba(248,113,113,.4)",
                        }}
                      >
                        {statusLabel(user.status)}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "9px 18px",
                        color: "#6b7280",
                        fontSize: 12,
                      }}
                    >
                      {user.created_at
                        ? new Date(user.created_at).toLocaleString("vi-VN")
                        : "-"}
                    </td>
                    <td style={{ padding: "9px 18px" }}>
                      {(canEdit || canDelete) ? (
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          {canEdit && (
                            <button
                              type="button"
                              onClick={() => openEdit(user)}
                              style={{
                                padding: "6px 14px",
                                borderRadius: 999,
                                border: "none",
                                background: "#2563eb",
                                color: "#ffffff",
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: "pointer",
                                boxShadow: "0 1px 2px rgba(15,23,42,.15)",
                              }}
                            >
                              Sửa
                            </button>
                          )}
                          {canDelete && (
                            <button
                              type="button"
                              onClick={() => handleDelete(user)}
                              style={{
                                padding: "6px 14px",
                                borderRadius: 999,
                                border: "none",
                                background: "#ef4444",
                                color: "#ffffff",
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: "pointer",
                                boxShadow: "0 1px 2px rgba(15,23,42,.15)",
                              }}
                            >
                              Xóa
                            </button>
                          )}
                        </div>
                      ) : (
                        <span
                          style={{
                            fontSize: 11,
                            color: "#4b5563",
                            fontStyle: "italic",
                          }}
                        >
                          Không có hành động
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form thêm tài khoản */}
      {creating && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,.5)",
            backdropFilter: "blur(2px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 40,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 440,
              background: "#ffffff",
              borderRadius: 16,
              border: "1px solid #e2e8f0",
              padding: 24,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3
              style={{
                margin: "0 0 4px",
                fontSize: 18,
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              Thêm tài khoản
            </h3>
            <p
              style={{
                margin: "0 0 16px",
                fontSize: 13,
                color: "#64748b",
              }}
            >
              Tài khoản mới sẽ có thể đăng nhập vào hệ thống theo vai trò được
              chọn.
            </p>

            <form
              onSubmit={handleSubmitCreate}
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              <label style={{ fontSize: 13, fontWeight: 500, color: "#475569" }}>
                Username
                <input
                  type="text"
                  value={createForm.username}
                  onChange={(e) =>
                    handleChangeCreate("username", e.target.value)
                  }
                  required
                  style={{
                    marginTop: 6,
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    color: "#0f172a",
                    fontSize: 14,
                    outline: "none",
                  }}
                />
              </label>

              <label style={{ fontSize: 13, fontWeight: 500, color: "#475569" }}>
                Email
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(e) =>
                    handleChangeCreate("email", e.target.value)
                  }
                  required
                  style={{
                    marginTop: 6,
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    color: "#0f172a",
                    fontSize: 14,
                    outline: "none",
                  }}
                />
              </label>

              <label style={{ fontSize: 13, fontWeight: 500, color: "#475569" }}>
                Mật khẩu
                <input
                  type="password"
                  value={createForm.password}
                  onChange={(e) =>
                    handleChangeCreate("password", e.target.value)
                  }
                  required
                  style={{
                    marginTop: 6,
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    color: "#0f172a",
                    fontSize: 14,
                    outline: "none",
                  }}
                />
              </label>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                }}
              >
                <label
                  style={{
                    flex: 1,
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#475569",
                  }}
                >
                  Vai trò
                  <select
                    value={createForm.role}
                    onChange={(e) =>
                      handleChangeCreate("role", Number(e.target.value))
                    }
                    style={{
                      marginTop: 6,
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 8,
                      border: "1px solid #cbd5e1",
                      background: "#ffffff",
                      color: "#0f172a",
                      fontSize: 14,
                      outline: "none",
                    }}
                  >
                    <option value={0}>Admin</option>
                    <option value={1}>User</option>
                  </select>
                </label>

                <label
                  style={{
                    flex: 1,
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#475569",
                  }}
                >
                  Trạng thái
                  <select
                    value={createForm.status}
                    onChange={(e) =>
                      handleChangeCreate("status", Number(e.target.value))
                    }
                    style={{
                      marginTop: 6,
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 8,
                      border: "1px solid #cbd5e1",
                      background: "#ffffff",
                      color: "#0f172a",
                      fontSize: 14,
                      outline: "none",
                    }}
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </label>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                  marginTop: 10,
                }}
              >
                <button
                  type="button"
                  onClick={() => setCreating(false)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 8,
                    border: "none",
                    background: "#f1f5f9",
                    color: "#475569",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "10px 16px",
                    borderRadius: 8,
                    border: "none",
                    background: "#3b82f6",
                    color: "#ffffff",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Form sửa tài khoản (chỉ cho chính mình) */}
      {editing && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,.5)",
            backdropFilter: "blur(2px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 40,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 440,
              background: "#ffffff",
              borderRadius: 16,
              border: "1px solid #e2e8f0",
              padding: 24,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3
              style={{
                margin: "0 0 4px",
                fontSize: 18,
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              Sửa thông tin tài khoản
            </h3>
            <p
              style={{
                margin: "0 0 16px",
                fontSize: 13,
                color: "#64748b",
              }}
            >
              Bạn chỉ có thể thay đổi thông tin tài khoản của chính mình.
            </p>

            <form
              onSubmit={handleSubmitEdit}
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              <label style={{ fontSize: 13, fontWeight: 500, color: "#475569" }}>
                Username
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) =>
                    handleChangeEdit("username", e.target.value)
                  }
                  required
                  style={{
                    marginTop: 6,
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    color: "#0f172a",
                    fontSize: 14,
                    outline: "none",
                  }}
                />
              </label>

              <label style={{ fontSize: 13, fontWeight: 500, color: "#475569" }}>
                Email
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => handleChangeEdit("email", e.target.value)}
                  required
                  style={{
                    marginTop: 6,
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    color: "#0f172a",
                    fontSize: 14,
                    outline: "none",
                  }}
                />
              </label>

              <label style={{ fontSize: 13, fontWeight: 500, color: "#475569" }}>
                Mật khẩu mới (tùy chọn)
                <input
                  type="password"
                  value={editForm.password}
                  onChange={(e) =>
                    handleChangeEdit("password", e.target.value)
                  }
                  placeholder="Để trống nếu không đổi mật khẩu"
                  style={{
                    marginTop: 6,
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    color: "#0f172a",
                    fontSize: 14,
                    outline: "none",
                  }}
                />
              </label>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                }}
              >
                <label
                  style={{
                    flex: 1,
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#475569",
                  }}
                >
                  Vai trò
                  <select
                    value={editForm.role}
                    onChange={(e) =>
                      handleChangeEdit("role", Number(e.target.value))
                    }
                    style={{
                      marginTop: 6,
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 8,
                      border: "1px solid #cbd5e1",
                      background: "#ffffff",
                      color: "#0f172a",
                      fontSize: 14,
                      outline: "none",
                    }}
                  >
                    <option value={0}>Admin</option>
                    <option value={1}>User</option>
                  </select>
                </label>

                <label
                  style={{
                    flex: 1,
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#475569",
                  }}
                >
                  Trạng thái
                  <select
                    value={editForm.status}
                    onChange={(e) =>
                      handleChangeEdit("status", Number(e.target.value))
                    }
                    style={{
                      marginTop: 4,
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: 9,
                      border: "1px solid rgba(55,65,81,1)",
                      background: "rgba(15,23,42,1)",
                      color: "#e5e7eb",
                      fontSize: 13,
                    }}
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </label>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                  marginTop: 10,
                }}
              >
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 8,
                    border: "none",
                    background: "#f1f5f9",
                    color: "#475569",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "10px 16px",
                    borderRadius: 8,
                    border: "none",
                    background: "#3b82f6",
                    color: "#ffffff",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

