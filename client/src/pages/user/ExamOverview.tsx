import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userExamService from "../../services/userExamService";

export default function ExamOverview() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [test, setTest] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (id) {
            fetchTestStructure(id);
        }
    }, [id]);

    const fetchTestStructure = async (testId: string) => {
        setLoading(true);
        setError("");
        try {
            const res = await userExamService.getFullStructure(testId);
            setTest(res.data);
        } catch (err: any) {
            console.error("Lỗi khi tải dữ liệu bài thi:", err);
            setError(err.response?.data?.message || "Không thể tải cấu trúc bài thi.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Đang tải thông tin bài thi...</div>;
    }

    if (error || !test) {
        return (
            <div style={{ padding: 40, textAlign: "center" }}>
                <p style={{ color: "#ef4444", marginBottom: 20 }}>{error || "Không tìm thấy bài thi."}</p>
                <button 
                    onClick={() => navigate('/user/exams')}
                    style={{ padding: "8px 16px", background: "#f1f5f9", border: "none", borderRadius: 8, cursor: "pointer" }}
                >
                    Quay lại danh sách
                </button>
            </div>
        );
    }

    // Tính toán số liệu thống kê
    let totalQuestions = 0;
    test.parts?.forEach((part: any) => {
        part.question_groups?.forEach((group: any) => {
            totalQuestions += (group.questions?.length || 0);
        });
    });

    return (
        <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 20px" }}>
            <div style={{ 
                background: "#fff", 
                borderRadius: 20, 
                padding: 40, 
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
                border: "1px solid rgba(226,232,240,1)",
                textAlign: "center"
            }}>
                <div style={{ display: "inline-block", padding: "12px 24px", background: "#f0fdf4", color: "#16a34a", borderRadius: 30, fontWeight: 700, fontSize: 14, marginBottom: 24, letterSpacing: "1px" }}>
                    TỔNG QUAN BÀI THI
                </div>
                
                <h1 style={{ fontSize: 36, fontWeight: 800, color: "#0f172a", marginBottom: 16 }}>{test.test_name}</h1>
                
                <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.6, marginBottom: 40, maxWidth: 600, margin: "0 auto 40px" }}>
                    {test.description || "Bài thi đánh giá năng lực tiếng Anh."}
                </p>

                <div style={{ display: "flex", justifyContent: "center", gap: 32, marginBottom: 40 }}>
                    <div style={{ padding: "20px", background: "#f8fafc", borderRadius: 16, minWidth: 140 }}>
                        <div style={{ fontSize: 32, fontWeight: 800, color: "#3b82f6" }}>{test.parts?.length || 0}</div>
                        <div style={{ fontSize: 14, color: "#64748b", fontWeight: 600, marginTop: 4 }}>PHẦN THI</div>
                    </div>
                    <div style={{ padding: "20px", background: "#f8fafc", borderRadius: 16, minWidth: 140 }}>
                        <div style={{ fontSize: 32, fontWeight: 800, color: "#8b5cf6" }}>{totalQuestions}</div>
                        <div style={{ fontSize: 14, color: "#64748b", fontWeight: 600, marginTop: 4 }}>CÂU HỎI</div>
                    </div>
                </div>

                <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
                    <button 
                        onClick={() => navigate('/user/exams')}
                        style={{
                            padding: "16px 32px",
                            background: "#f1f5f9",
                            color: "#475569",
                            border: "none",
                            borderRadius: 12,
                            fontWeight: 600,
                            fontSize: 16,
                            cursor: "pointer",
                            transition: "background 0.2s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = "#e2e8f0"}
                        onMouseOut={(e) => e.currentTarget.style.background = "#f1f5f9"}
                    >
                        Quay Lại
                    </button>
                    <button 
                        onClick={() => navigate(`/user/exam/${test.test_id}/mock`)}
                        style={{
                            padding: "16px 40px",
                            background: "linear-gradient(135deg, #1e293b, #334155)",
                            color: "#fff",
                            border: "none",
                            borderRadius: 12,
                            fontWeight: 700,
                            fontSize: 16,
                            cursor: "pointer",
                            boxShadow: "0 4px 14px 0 rgba(30, 41, 59, 0.39)",
                            transition: "transform 0.2s, box-shadow 0.2s"
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 6px 20px rgba(30,41,59,0.23)";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 4px 14px 0 rgba(30, 41, 59, 0.39)";
                        }}
                    >
                        BẮT ĐẦU THI THỬ 🏆
                    </button>
                    <button 
                        onClick={() => navigate(`/user/exam/${test.test_id}/take`)}
                        style={{
                            padding: "16px 40px",
                            background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                            color: "#fff",
                            border: "none",
                            borderRadius: 12,
                            fontWeight: 700,
                            fontSize: 16,
                            cursor: "pointer",
                            boxShadow: "0 4px 14px 0 rgba(59, 130, 246, 0.39)",
                            transition: "transform 0.2s, box-shadow 0.2s"
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 6px 20px rgba(59,130,246,0.23)";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 4px 14px 0 rgba(59, 130, 246, 0.39)";
                        }}
                    >
                        LUYỆN TẬP TỰ DO
                    </button>
                </div>
            </div>
        </div>
    );
}
