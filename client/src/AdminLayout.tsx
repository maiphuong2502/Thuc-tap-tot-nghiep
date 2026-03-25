import { useState } from "react";
import Sidebar     from "./components/Sidebar";
import Header      from "./components/Header";
import META        from "./constants/meta";
import Dashboard   from "./pages/admin/Dashboard";
import Users       from "./pages/admin/Users";
import Placeholder from "./pages/admin/Placeholder";
import Skill from "./pages/admin/Skill";
import Topic from "./pages/admin/Topic";
import Passage from "./pages/admin/Passage";
import Audio from "./pages/admin/Audio";
import Test from "./pages/admin/Test";
import TestPart from "./pages/admin/TestPart";

export default function AdminLayout() {
  const [page,      setPage]      = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const renderPage = () => {
    if (page === "dashboard") return <Dashboard />;
    if (page === "users")     return <Users />;
    if (page === "skill")     return <Skill />;
    if (page === "topic")     return <Topic />;
    if (page === "passage")   return <Passage />;
    if (page === "audio")     return <Audio />;
    if (page === "examset")   return <Test />;
    if (page === "testpart")  return <TestPart />;
    return <Placeholder title={META[page]} />;
  };

  return (
    <div style={{
      display: "flex", height: "100vh",
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
      background: "#f3f4f6", color: "#111827", overflow: "hidden",
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