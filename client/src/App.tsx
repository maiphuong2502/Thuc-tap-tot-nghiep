import React, { Component, ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './AdminLayout';
import './App.css';

class AppErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: any) {
    console.error("App lỗi render:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, fontFamily: "monospace", color: "#dc2626", background: "#fff1f2", minHeight: "100vh" }}>
          <h2>⚠️ Lỗi Ứng Dụng Toàn Cục</h2>
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all", fontSize: 13 }}>
            {this.state.error?.message}
            {"\n\n"}
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

import UserLayout from './UserLayout';

function App() {
  return (
    <AppErrorBoundary>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/user/*"
            element={
              <ProtectedRoute allowedRole={1}>
                <UserLayout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRole={0}>
                <AdminLayout />
              </ProtectedRoute>
            }
          />
          {/* Redirect root to appropriate dashboard */}
          <Route path="/" element={<Navigate to="/user/dashboard" replace />} />
          {/* Catch all fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </AppErrorBoundary>
  );
}

export default App;
