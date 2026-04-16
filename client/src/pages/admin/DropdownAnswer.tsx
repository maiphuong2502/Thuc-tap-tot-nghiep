import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";

interface DropdownAnswer {
    daw_id: string;
    result_id: string;
    question_id: string;
    selected_option_id: string;
    is_correct: boolean;
    created_at: string;
}

export default function DropdownAnswer() {
    const [answers, setAnswers] = useState<DropdownAnswer[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => { fetchAnswers(); }, []);

    const fetchAnswers = async () => {
        setLoading(true);
        try {
            const res: any = await axiosClient.get("/dropdown-answers");
            setAnswers(res.data?.data || res.data || []);
        } catch (err) {
            console.error("Lỗi lấy dữ liệu:", err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = answers.filter(a =>
        a.daw_id.toLowerCase().includes(search.toLowerCase()) ||
        a.result_id.toLowerCase().includes(search.toLowerCase()) ||
        a.question_id.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1e293b", margin: 0, letterSpacing: "-0.6px" }}>
                        Kết quả Dropdown
                    </h1>
                    <p style={{ color: "#64748b", margin: "4px 0 0", fontSize: 14 }}>
                        Bài làm của học viên cho câu hỏi chọn từ thả xuống
                    </p>
                </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(148,163,184,.2)", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                <div style={{ padding: 20, borderBottom: "1px solid #f1f5f9", display: "flex", gap: 16 }}>
                    <div style={{ position: "relative", flex: 1 }}>
                        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}>🔍</span>
                        <input
                            type="text"
                            placeholder="Tìm theo mã, result ID, question ID..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ width: "100%", padding: "10px 14px 10px 40px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, outline: "none" }}
                        />
                    </div>
                    <button onClick={fetchAnswers} style={{ padding: "10px 16px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 14 }}>
                        🔄 Làm mới
                    </button>
                </div>

                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                                {["Mã", "Result ID", "Question ID", "Option đã chọn", "Kết quả"].map(h => (
                                    <th key={h} style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Đang tải dữ liệu...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Không có dữ liệu</td></tr>
                            ) : filtered.map(ans => (
                                <tr key={ans.daw_id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                    <td style={{ padding: "14px 20px" }}>
                                        <span style={{ fontWeight: 600, color: "#8b5cf6", background: "rgba(139,92,246,.1)", padding: "2px 8px", borderRadius: 6, fontSize: 12 }}>
                                            {ans.daw_id}
                                        </span>
                                    </td>
                                    <td style={{ padding: "14px 20px", color: "#334155", fontSize: 14 }}>{ans.result_id}</td>
                                    <td style={{ padding: "14px 20px", color: "#334155", fontSize: 14 }}>{ans.question_id}</td>
                                    <td style={{ padding: "14px 20px", color: "#334155", fontSize: 14 }}>{ans.selected_option_id}</td>
                                    <td style={{ padding: "14px 20px" }}>
                                        {ans.is_correct
                                            ? <span style={{ color: "#10b981", fontWeight: 700, background: "rgba(16,185,129,.1)", padding: "3px 10px", borderRadius: 20, fontSize: 13 }}>✓ Đúng</span>
                                            : <span style={{ color: "#ef4444", fontWeight: 700, background: "rgba(239,68,68,.1)", padding: "3px 10px", borderRadius: 20, fontSize: 13 }}>✗ Sai</span>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
