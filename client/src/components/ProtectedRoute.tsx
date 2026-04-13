import React, { useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children, allowedRole = null }: { children: React.ReactElement, allowedRole?: number | null }) {
  const token = localStorage.getItem('access_token');
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  }, []);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu có yêu cầu role cụ thể mà user không khớp, redirect về trang chủ của họ
  if (allowedRole !== null && user?.role !== allowedRole) {
    return <Navigate to={user?.role === 0 ? "/admin" : "/"} replace />;
  }

  return children;
}

export default ProtectedRoute;
