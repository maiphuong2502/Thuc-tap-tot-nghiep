import { useState, useEffect, Component, ReactNode } from "react";

// Error Boundary để hiển thị lỗi thay vì màn hình trắng
class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: any) {
    console.error("AdminLayout lỗi render:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, fontFamily: "monospace", color: "#dc2626", background: "#fff1f2", minHeight: "100vh" }}>
          <h2>⚠️ Lỗi khi tải trang Admin</h2>
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
import DataEntry from "./pages/admin/DataEntry";

import QuestionGroup from "./pages/admin/QuestionGroup";
import Question from "./pages/admin/Question";
import McqQuestion from "./pages/admin/McqQuestion";
import DropdownQuestion from "./pages/admin/DropdownQuestion";
import MatchingQuestion from "./pages/admin/MatchingQuestion";
import FillQuestion from "./pages/admin/FillQuestion";
import TfngQuestion from "./pages/admin/TfngQuestion";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { prefetchAll } from "./app/cacheSlice";

export default function AdminLayout() {
  const [page,      setPage]      = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useAppDispatch();
  const { loaded } = useAppSelector((s) => s.cache);

  // Prefetch tất cả dữ liệu ngay khi admin layout mount (sau đăng nhập)
  useEffect(() => {
    if (!loaded) {
      dispatch(prefetchAll());
    }
  }, [dispatch, loaded]);


  const renderPage = () => {
    if (page === "dashboard") return <Dashboard />;
    if (page === "users")     return <Users />;
    if (page === "skill")     return <Skill />;
    if (page === "topic")     return <Topic />;
    if (page === "data_entry") return <DataEntry />;
    if (page === "passage")   return <Passage />;
    if (page === "audio")     return <Audio />;
    if (page === "examset")   return <Test />;
    if (page === "testpart")  return <TestPart />;
    if (page === "question_group") return <QuestionGroup />;
    if (page === "question")  return <Question />;
    if (page === "mcq_question") return <McqQuestion />;
    if (page === "fill_question") return <FillQuestion />;
    if (page === "dropdown_question") return <DropdownQuestion />;
    if (page === "matching_question") return <MatchingQuestion />;
    if (page === "tfng_question") return <TfngQuestion />;
    return <Placeholder title={META[page]} />;
  };

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}