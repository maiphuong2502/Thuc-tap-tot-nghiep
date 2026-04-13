import React, { useState, useEffect, useMemo } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import UserSidebar from "./components/UserSidebar";
import UserHeader from "./components/UserHeader";
import authService from "./services/authService";
import UserDashboard from "./pages/user/Dashboard";
import UserProfile from "./pages/user/Profile";

// Reusable hook to get current user from storage
function useCurrentUser() {
  return useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);
}

// Placeholder for pages under development
function ComingSoon({ name }: { name: string }) {
  return (
    <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
      <h3>Đang phát triển tính năng "{name}"</h3>
      <p>Vui lòng quay lại sau.</p>
    </div>
  );
}

export default function UserLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const user = useCurrentUser();
  const navigate = useNavigate();
  const location = useLocation();

  // Derive current page key from URL for sidebar highlighting
  const currentPage = location.pathname.replace("/user/", "") || "dashboard";

  useEffect(() => {
    // If not logged in, redirect to login
    if (!localStorage.getItem("access_token")) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (_) {
      // ignore
    }
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <div style={{
      display: "flex", height: "100vh",
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
      background: "#f3f4f6", color: "#111827", overflow: "hidden",
    }}>
      <UserSidebar
        page={currentPage}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <UserHeader page={currentPage} onLogout={handleLogout} />

        <main style={{ flex: 1, overflow: "auto", padding: "28px 32px" }}>
          <Routes>
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="schedule" element={<ComingSoon name="Lịch thi" />} />
            <Route path="listening" element={<ComingSoon name="Luyện Listening" />} />
            <Route path="reading" element={<ComingSoon name="Luyện Reading" />} />
            <Route path="writing" element={<ComingSoon name="Luyện Writing" />} />
            <Route path="speaking" element={<ComingSoon name="Luyện Speaking" />} />
            <Route path="mock_test" element={<ComingSoon name="Bài thi thử" />} />
            <Route path="result" element={<ComingSoon name="Kết quả" />} />
            {/* Default redirect */}
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

