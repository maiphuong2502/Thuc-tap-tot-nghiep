import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import META from "../constants/meta";

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

export default function Header({ page }) {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (_) {
      // ignore
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  const username = user?.username || user?.email || "Admin";
  // Create an avatar letter from username or default 'A'
  const avatarLetter = username.charAt(0).toUpperCase();

  return (
    <header style={{
      padding: "18px 32px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      borderBottom: "1px solid rgba(226,232,240,1)",
      background: "rgba(255,255,255,.9)", backdropFilter: "blur(14px)",
      flexShrink: 0,
      position: "relative",
      zIndex: 100,
    }}>
      <h1 style={{
        margin: 0, fontSize: 20, fontWeight: 800,
        color: "#0f172a", letterSpacing: "-0.5px",
      }}>
        {META[page] || "Trang quản trị"}
      </h1>

      {/* User Section */}
      <div 
        ref={dropdownRef} 
        style={{ position: "relative" }}
      >
        <div 
          onClick={() => setShowDropdown(!showDropdown)}
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "12px", 
            cursor: "pointer",
            padding: "4px 10px",
            borderRadius: "99px",
            transition: "background 0.2s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(241,245,249,1)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          title="Tài khoản"
        >
          {/* Username Text */}
          <span style={{ 
            fontSize: 14, 
            fontWeight: 600, 
            color: "#334155" 
          }}>
            {username}
          </span>
          
          {/* Avatar Circle */}
          <div style={{
            width: 38, height: 38, borderRadius: "50%",
            background: "linear-gradient(135deg,#3b82f6,#6366f1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 16, color: "#ffffff",
            boxShadow: "0 4px 10px rgba(59,130,246,0.3)"
          }}>
            {avatarLetter}
          </div>
        </div>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: 220,
            background: "#ffffff",
            borderRadius: 12,
            boxShadow: "0 10px 25px rgba(15,23,42,0.1), 0 4px 10px rgba(15,23,42,0.05)",
            border: "1px solid rgba(226,232,240,1)",
            overflow: "hidden",
            zIndex: 50,
            animation: "fadeIn 0.2s ease",
          }}>
            {/* User info box inside dropdown */}
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", background: "#fafafa" }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>
                {user?.username || "Tài khoản viên"}
              </p>
              <p style={{ margin: 0, fontSize: 12, color: "#64748b", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user?.email || "Chưa có email"}
              </p>
            </div>

            <div style={{ padding: "6px" }}>
              <button
                type="button"
                onClick={() => {
                  setShowDropdown(false);
                  navigate('/admin/profile'); 
                }}
                style={{
                  width: "100%", textAlign: "left", padding: "10px 12px",
                  background: "transparent", border: "none",
                  fontSize: 13, color: "#334155", fontWeight: 600,
                  borderRadius: 6, cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f1f5f9";
                  e.currentTarget.style.color = "#0f172a";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#334155";
                }}
              >
                Trang cá nhân
              </button>
              
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  width: "100%", textAlign: "left", padding: "10px 12px",
                  background: "transparent", border: "none",
                  fontSize: 13, color: "#ef4444", fontWeight: 600,
                  borderRadius: 6, cursor: "pointer",
                  marginTop: 2,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#fef2f2";
                  e.currentTarget.style.color = "#b91c1c";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#ef4444";
                }}
              >
                Đăng xuất
              </button>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </header>
  );
}