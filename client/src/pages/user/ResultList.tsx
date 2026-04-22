import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userExamService from '../../services/userExamService';

export default function ResultList() {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const res: any = await userExamService.getMyResults();
            console.log("DEBUG: API Response for My Results:", res);
            
            // Handle different structures (direct array, {data: []}, {data: {data: []}})
            let list = [];
            if (Array.isArray(res)) {
                list = res;
            } else if (res && res.data) {
                list = Array.isArray(res.data) ? res.data : (res.data.data || []);
            }
            
            console.log("DEBUG: Final processed results list:", list);
            setResults(list);
        } catch (error) {
            console.error("Lỗi lấy lịch sử bài làm:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        const d = new Date(dateString);
        return d.toLocaleDateString("vi-VN", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit"
        });
    };

    if (loading) {
        return <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Đang tải lịch sử kết quả...</div>;
    }

    return (
        <div style={{ padding: "0", fontFamily: "'DM Sans', sans-serif" }}>
            <div style={{ 
                background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", 
                padding: "32px 40px", 
                borderRadius: 20, 
                color: "#fff",
                marginBottom: 32,
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
            }}>
                <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>Lịch sử làm bài</h1>
                <p style={{ margin: "8px 0 0", color: "#94a3b8", fontSize: 15 }}>Theo dõi sự tiến bộ và xem lại các kết quả đã đạt được của bạn.</p>
            </div>

            {results.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: 20, border: "1px dashed #cbd5e1" }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
                    <h3 style={{ fontSize: 18, color: "#334155", margin: "0 0 8px" }}>Bạn chưa có bài thi nào</h3>
                    <p style={{ color: "#64748b", margin: "0 0 24px" }}>Hãy bắt đầu làm bài để ghi nhận lại kết quả nhé.</p>
                    <button 
                        onClick={() => navigate('/user/exams')}
                        style={{ padding: "10px 24px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}
                    >
                        Danh sách đề thi
                    </button>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
                    {results.map((item, idx) => (
                        <div key={item.result_id || idx} style={{ 
                            background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", 
                            overflow: "hidden", transition: "all 0.2s", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)"
                        }}>
                            <div style={{ padding: 20, borderBottom: "1px solid #f1f5f9" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                                    <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, background: "#f1f5f9", padding: "4px 8px", borderRadius: 6 }}>
                                        {formatDate(item.created_at || item.start_time)}
                                    </div>
                                    <div style={{ 
                                        fontSize: 16, fontWeight: 800, color: "#2563eb", background: "#eff6ff", 
                                        padding: "4px 12px", borderRadius: 20, border: "1px solid #bfdbfe" 
                                    }}>
                                        Band {item.band_score}
                                    </div>
                                </div>
                                <h3 style={{ margin: "0 0 8px", fontSize: 18, color: "#0f172a", lineHeight: 1.4 }}>
                                    {item.test?.test_name || "Bài thi không tên"}
                                </h3>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", fontSize: 13 }}>
                                    <span style={{ color: "#10b981", fontWeight: 700 }}>{item.correct_count}</span> đúng / {item.total_questions} tổng câu
                                </div>
                            </div>
                            
                            <div style={{ padding: "16px 20px", background: "#f8fafc", display: "flex", gap: 12 }}>
                                <button 
                                    onClick={() => navigate(`/user/results/${item.result_id}`)}
                                    style={{ 
                                        flex: 1, padding: "10px", borderRadius: 8, background: "#fff", 
                                        border: "1px solid #cbd5e1", color: "#334155", fontWeight: 600, 
                                        cursor: "pointer", transition: "all 0.2s", fontSize: 13
                                    }}
                                >
                                    Thống kê
                                </button>
                                <button 
                                    onClick={() => navigate(`/user/results/${item.result_id}/review`)}
                                    style={{ 
                                        flex: 2, padding: "10px", borderRadius: 8, background: "#10b981", 
                                        border: "none", color: "#fff", fontWeight: 600, 
                                        cursor: "pointer", transition: "all 0.2s", fontSize: 13
                                    }}
                                >
                                    Xem đáp án
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
