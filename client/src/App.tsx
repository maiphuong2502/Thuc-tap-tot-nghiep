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

function App() {
  return (
    <AppErrorBoundary>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    </AppErrorBoundary>
  );
}

export default App;
