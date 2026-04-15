import { useState, useEffect } from "react";
import axios from "axios";
import { useAppSelector } from "../../app/hooks";

interface TestCaseResult {
    result_id: string;
    user_id: string;
    test_id: string;
    start_time: string;
    end_time: string;
    total_questions: number;
    correct_count: number;
    wrong_count: number;
    skipped_count: number;
    band_score: number;
    user?: {
        name: string;
        email: string;
    };
    test?: {
        test_name: string;
    };
    created_at: string;
}

export default function Result() {
    const [results, setResults] = useState<TestCaseResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [viewingResult, setViewingResult] = useState<TestCaseResult | null>(null);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/results");
            setResults(res.data.data.data || res.data.data);
        } catch (err) {
            console.error("Lỗi lấy dữ liệu kết quả:", err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = results.filter(r => 
        r.test?.test_name.toLowerCase().includes(search.toLowerCase()) ||
        r.user?.name.toLowerCase().includes(search.toLowerCase()) ||
        r.user?.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1e293b", margin: 0, letterSpacing: "-0.6px" }}>
                        Quản lý kết quả thi
                    </h1>
                    <p style={{ color: "#64748b", margin: "4px 0 0", fontSize: 14 }}>
                        Xem và quản lý tất cả kết quả làm bài của học viên
                    </p>
                </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(148,163,184,.2)", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                <div style={{ padding: 20, borderBottom: "1px solid #f1f5f9", display: "flex", gap: 16 }}>
                    <div style={{ position: "relative", flex: 1 }}>
                        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}>🔍</span>
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm theo học viên, email hoặc bài thi..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: "100%", padding: "10px 14px 10px 40px", borderRadius: 10,
                                border: "1px solid #e2e8f0", fontSize: 14, outline: "none",
                                transition: "all .2s",
                            }}
                        />
                    </div>
                    <button 
                        onClick={fetchResults}
                        style={{ padding: "10px 16px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 14 }}
                    >
                        🔄 Làm mới
                    </button>
                </div>

                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                                <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>Mã KQ</th>
                                <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>Học viên</th>
                                <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>Bài thi</th>
                                <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>Điểm đúng</th>
                                <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>Band Score</th>
                                <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>Thời gian</th>
                                <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>Ngày làm</th>
                                <th style={{ padding: "14px 20px" }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={8} style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Đang tải dữ liệu...</td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={8} style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Không tìm thấy kết quả nào</td>
                                </tr>
                            ) : filtered.map(item => (
                                <tr key={item.result_id} style={{ borderBottom: "1px solid #f1f5f9", transition: "all .15s" }}>
                                    <td style={{ padding: "14px 20px" }}>
                                        <span style={{ fontWeight: 600, color: "#3b82f6", background: "rgba(59,130,246,.1)", padding: "2px 8px", borderRadius: 6, fontSize: 12 }}>
                                            {item.result_id}
                                        </span>
                                    </td>
                                    <td style={{ padding: "14px 20px" }}>
                                        <div style={{ fontWeight: 600, color: "#1e293b", fontSize: 14 }}>{item.user?.name}</div>
                                        <div style={{ fontSize: 12, color: "#64748b" }}>{item.user?.email}</div>
                                    </td>
                                    <td style={{ padding: "14px 20px", color: "#334155", fontSize: 14 }}>{item.test?.test_name}</td>
                                    <td style={{ padding: "14px 20px", color: "#334155", fontSize: 14 }}>
                                        <span style={{ color: "#10b981", fontWeight: 700 }}>{item.correct_count}</span>
                                        <span style={{ color: "#94a3b8" }}> / {item.total_questions}</span>
                                    </td>
                                    <td style={{ padding: "14px 20px" }}>
                                        <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#2563eb)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14 }}>
                                            {item.band_score}
                                        </div>
                                    </td>
                                    <td style={{ padding: "14px 20px", color: "#64748b", fontSize: 13 }}>
                                        {Math.round((new Date(item.end_time).getTime() - new Date(item.start_time).getTime()) / 60000)} phút
                                    </td>
                                    <td style={{ padding: "14px 20px", color: "#64748b", fontSize: 13 }}>
                                        {new Date(item.created_at).toLocaleDateString("vi-VN")}
                                    </td>
                                    <td style={{ padding: "14px 20px", textAlign: "right" }}>
                                        <button 
                                            onClick={() => setViewingResult(item)}
                                            style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#f8fafc", color: "#475569", cursor: "pointer", fontSize: 13, fontWeight: 500 }}
                                        >
                                            Xem chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal xem chi tiết */}
            {viewingResult && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
                    <div style={{ background: "#fff", width: "100%", maxWidth: 600, borderRadius: 24, overflow: "hidden", position: "relative", animations: "scaleUp .3s ease" }}>
                        <div style={{ padding: "24px 32px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc" }}>
                            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#1e293b" }}>Chi tiết kết quả</h2>
                            <button onClick={() => setViewingResult(null)} style={{ border: "none", background: "none", fontSize: 24, cursor: "pointer", color: "#94a3b8" }}>×</button>
                        </div>
                        
                        <div style={{ padding: 32 }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 32 }}>
                                <div>
                                    <p style={{ margin: "0 0 4px", fontSize: 12, color: "#64748b", textTransform: "uppercase", fontWeight: 600 }}>Học viên</p>
                                    <p style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>{viewingResult.user?.name}</p>
                                    <p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>{viewingResult.user?.email}</p>
                                </div>
                                <div>
                                    <p style={{ margin: "0 0 4px", fontSize: 12, color: "#64748b", textTransform: "uppercase", fontWeight: 600 }}>Bài thi</p>
                                    <p style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>{viewingResult.test?.test_name}</p>
                                </div>
                            </div>

                            <div style={{ background: "#f1f5f9", borderRadius: 16, padding: 24, display: "flex", justifyContent: "space-around" }}>
                                <div style={{ textAlign: "center" }}>
                                    <div style={{ fontSize: 28, fontWeight: 800, color: "#3b82f6" }}>{viewingResult.band_score}</div>
                                    <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>BAND SCORE</div>
                                </div>
                                <div style={{ width: 1, background: "#cbd5e1" }}></div>
                                <div style={{ textAlign: "center" }}>
                                    <div style={{ fontSize: 28, fontWeight: 800, color: "#10b981" }}>{viewingResult.correct_count}</div>
                                    <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>CÂU ĐÚNG</div>
                                </div>
                                <div style={{ width: 1, background: "#cbd5e1" }}></div>
                                <div style={{ textAlign: "center" }}>
                                    <div style={{ fontSize: 28, fontWeight: 800, color: "#ef4444" }}>{viewingResult.wrong_count}</div>
                                    <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>CÂU SAI</div>
                                </div>
                            </div>

                            <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                <div style={{ padding: 16, borderRadius: 12, border: "1px solid #f1f5f9" }}>
                                    <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>Bắt đầu</div>
                                    <div style={{ fontWeight: 600 }}>{new Date(viewingResult.start_time).toLocaleTimeString()}</div>
                                </div>
                                <div style={{ padding: 16, borderRadius: 12, border: "1px solid #f1f5f9" }}>
                                    <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>Kết thúc</div>
                                    <div style={{ fontWeight: 600 }}>{new Date(viewingResult.end_time).toLocaleTimeString()}</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: "24px 32px", borderTop: "1px solid #f1f5f9", textAlign: "right", background: "#f8fafc" }}>
                            <button 
                                onClick={() => setViewingResult(null)}
                                style={{ padding: "10px 24px", borderRadius: 10, background: "#1e293b", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600 }}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
