import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userExamService from "../../services/userExamService";

export default function ExamList() {
    const navigate = useNavigate();
    const [exams, setExams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        setLoading(true);
        try {
            const res = await userExamService.getExams();
            setExams(res.data?.data?.data || res.data?.data || []);
        } catch (err) {
            console.error("Lỗi khi tải danh sách đề thi:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px" }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1e293b", marginBottom: 24 }}>
                Chọn bộ đề thi
            </h1>
            
            {loading ? (
                <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Đang tải danh sách bài thi...</div>
            ) : exams.length === 0 ? (
                <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Chưa có bộ đề nào.</div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
                    {exams.map(exam => (
                        <div key={exam.test_id} style={{ 
                            background: "#fff", 
                            borderRadius: 16, 
                            padding: 24, 
                            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                            border: "1px solid rgba(148,163,184,.2)",
                            display: "flex",
                            flexDirection: "column",
                            gap: 16
                        }}>
                            <div>
                                <h3 style={{ margin: "0 0 8px 0", fontSize: 18, color: "#0f172a" }}>
                                    {exam.test_name}
                                </h3>
                                <p style={{ margin: 0, fontSize: 14, color: "#64748b", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                    {exam.description || "Không có mô tả"}
                                </p>
                            </div>
                            <div style={{ marginTop: "auto" }}>
                                <button 
                                    onClick={() => navigate(`/user/exam/${exam.test_id}`)}
                                    style={{
                                        width: "100%",
                                        padding: "10px 16px",
                                        background: "#3b82f6",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: 8,
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        transition: "background 0.2s"
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = "#2563eb"}
                                    onMouseOut={(e) => e.currentTarget.style.background = "#3b82f6"}
                                >
                                    Xem chi tiết
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
