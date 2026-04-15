import { useState, useEffect } from "react";
import axios from "axios";

interface McqAnswer {
    amc_id: string;
    result_id: string;
    question_id: string;
    selected_option_id: string;
    is_correct: boolean;
    created_at: string;
}

export default function McqAnswer() {
    const [answers, setAnswers] = useState<McqAnswer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnswers();
    }, []);

    const fetchAnswers = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/mcq-answers");
            setAnswers(res.data.data.data || res.data.data);
        } catch (err) {
            console.error("Lỗi lấy dữ liệu:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Bảng lưu kết quả MCQ</h1>
            
            <div style={{ background: "#fff", padding: 20, borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                        <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                            <th style={{ padding: 12, fontWeight: 600 }}>ID</th>
                            <th style={{ padding: 12, fontWeight: 600 }}>Result ID</th>
                            <th style={{ padding: 12, fontWeight: 600 }}>Question ID</th>
                            <th style={{ padding: 12, fontWeight: 600 }}>Selected Option</th>
                            <th style={{ padding: 12, fontWeight: 600 }}>Kết quả</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} style={{ padding: 20, textAlign: "center" }}>Đang tải...</td></tr>
                        ) : answers.length === 0 ? (
                            <tr><td colSpan={5} style={{ padding: 20, textAlign: "center" }}>Không có dữ liệu</td></tr>
                        ) : (
                            answers.map(ans => (
                                <tr key={ans.amc_id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                    <td style={{ padding: 12 }}>{ans.amc_id}</td>
                                    <td style={{ padding: 12 }}>{ans.result_id}</td>
                                    <td style={{ padding: 12 }}>{ans.question_id}</td>
                                    <td style={{ padding: 12 }}>{ans.selected_option_id}</td>
                                    <td style={{ padding: 12 }}>
                                        {ans.is_correct ? (
                                            <span style={{ color: "#10b981", fontWeight: "bold" }}>Đúng</span>
                                        ) : (
                                            <span style={{ color: "#ef4444", fontWeight: "bold" }}>Sai</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
