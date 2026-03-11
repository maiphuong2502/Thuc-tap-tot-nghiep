import { useState } from "react";
import Sidebar     from "./components/Sidebar";
import Header      from "./components/Header";
import META        from "./constants/meta";
import Dashboard   from "./pages/admin/Dashboard";
import Users       from "./pages/admin/Users";
import Placeholder from "./pages/admin/Placeholder";

export default function AdminLayout() {
  const [page,      setPage]      = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const renderPage = () => {
    if (page === "dashboard") return <Dashboard />;
    if (page === "users")     return <Users />;
    return <Placeholder title={META[page]} />;
  };

  return (
    <div style={{
      display: "flex", height: "100vh",
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
      background: "#0b1120", color: "#e2e8f0", overflow: "hidden",
    }}>
      <Sidebar
        page={page}
        setPage={setPage}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Header page={page} />
        <main style={{ flex: 1, overflow: "auto", padding: "28px 32px" }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}