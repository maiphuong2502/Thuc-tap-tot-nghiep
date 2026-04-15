import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userExamService from "../../services/userExamService";
import QuestionRenderer from "../../components/exam/QuestionRenderer";

export default function ResultReview() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentPartIndex, setCurrentPartIndex] = useState(0);
    const [unifiedAnswers, setUnifiedAnswers] = useState<Record<string, string>>({});
    const [uniqueSkills, setUniqueSkills] = useState<any[]>([]);

    useEffect(() => {
        if (id) fetchReviewData(id);
    }, [id]);

    const fetchReviewData = async (resultId: string) => {
        try {
            const res = await userExamService.getReviewData(resultId);
            const reviewData = res.data || res;
            
            // Map the nested data structure from ResultService
            const testResult = reviewData.data || reviewData;
            const testInfo = testResult.test;

            if (!testInfo) throw new Error("No test data found");

            setData(testResult);

            // 1. Process Skills for Tabs
            const skillMap = new Map();
            testInfo.parts?.forEach((p: any, idx: number) => {
                const s = p.skill;
                if (s && !skillMap.has(s.id)) {
                    skillMap.set(s.id, { ...s, firstPartIndex: idx });
                }
            });
            setUniqueSkills(Array.from(skillMap.values()));

            // 2. Unify User Answers
            const answers: Record<string, string> = {};
            
            // MCQ
            (testResult.mcqAnswers || testResult.mcq_answers)?.forEach((a: any) => {
                answers[a.question_id] = a.selected_option_id;
            });
            
            // FILL
            (testResult.fillUserAnswers || testResult.fill_user_answers)?.forEach((a: any) => {
                answers[a.question_id] = a.user_answer; 
            });
            
            // TFNG
            (testResult.tfngUserAnswers || testResult.tfng_user_answers)?.forEach((a: any) => {
                answers[a.question_id] = a.user_answer;
            });
            
            // DROPDOWN
            (testResult.dropdownAnswers || testResult.dropdown_answers)?.forEach((a: any) => {
                answers[a.question_id] = a.selected_option_text;
            });
            
            // MATCHING
            (testResult.matchingUserAnswers || testResult.matching_user_answers)?.forEach((a: any) => {
                answers[a.question_id] = a.user_answer;
            });

            setUnifiedAnswers(answers);

        } catch (err: any) {
            console.error("Fetch review error:", err);
            alert("Không tìm thấy thông tin bài làm.");
            navigate("/user/results");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Đang tải dữ liệu xem lại...</div>;
    if (!data) return <div style={{ padding: 40, textAlign: "center" }}>Không tìm thấy dữ liệu.</div>;

    const test = data.test;
    const currentPart = test.parts[currentPartIndex];
    if (!currentPart) return <div style={{ padding: 40, textAlign: "center" }}>Lỗi phần thi.</div>;

    const currentSkillId = currentPart.skill?.id;
    const currentSkillName = currentPart.skill?.skill_name || "IELTS Skill";

    const isFirstPart = currentPartIndex === 0;
    const isLastPart = currentPartIndex === test.parts.length - 1;

    const groups = currentPart.questionGroups || currentPart.question_groups || [];

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#f8fafc", fontFamily: "'DM Sans', sans-serif" }}>
            
            {/* HEADBAR */}
            <header style={{ 
                background: "#0f172a", color: "#fff", display: "flex", flexDirection: "column",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", zIndex: 10
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <button 
                            onClick={() => navigate(`/user/results/${id}`)} 
                            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
                        >
                            ← Trở lại
                        </button>
                        <div>
                            <h1 style={{ fontSize: 18, margin: 0, fontWeight: 700 }}>XEM LẠI: {test.test_name}</h1>
                            <div style={{ fontSize: 12, color: "#94a3b8", display: 'flex', gap: 12, marginTop: 2 }}>
                                <span>Học viên: <strong style={{color: '#fff'}}>{data.user?.username || "N/A"}</strong></span>
                                <span>Band Score: <strong style={{color: '#4ade80'}}>{data.band_score}</strong></span>
                            </div>
                        </div>
                    </div>

                    <div style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#4ade80", padding: "8px 20px", borderRadius: 20, fontSize: 14, fontWeight: 700 }}>
                        CHẾ ĐỘ XEM LẠI BÀI LÀM
                    </div>
                </div>

                {/* SKILLS TAB NAVIGATION */}
                <div style={{ display: "flex", background: "#1e293b", padding: "0 24px", gap: 24 }}>
                    {uniqueSkills.map((s, idx) => {
                        const isActive = s.id === currentSkillId;
                        return (
                            <button 
                                key={s.id}
                                onClick={() => setCurrentPartIndex(s.firstPartIndex)}
                                style={{
                                    background: "transparent", border: "none", color: isActive ? "#60a5fa" : "#94a3b8",
                                    padding: "16px 4px", fontSize: 14, fontWeight: isActive ? 700 : 500,
                                    borderBottom: isActive ? "3px solid #60a5fa" : "3px solid transparent",
                                    cursor: "pointer", transition: "all 0.2s"
                                }}
                            >
                                {idx + 1}. {s.skill_name}
                            </button>
                        );
                    })}
                </div>
            </header>

            {/* MAIN CONTENT SPLIT PANE */}
            <main style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                
                {/* LEFT: PASSAGE / AUDIO */}
                <div style={{ flex: 4.5, background: "#fff", borderRight: "1px solid #e2e8f0", overflowY: "auto", padding: "32px", display: "flex", flexDirection: "column", gap: 32 }}>
                    <div style={{ background: "#f1f5f9", color: "#475569", padding: "8px 16px", borderRadius: 8, alignSelf: "flex-start", fontWeight: 700, fontSize: 13, textTransform: 'uppercase' }}>
                        {currentSkillName} - {currentPart.part_name || `Phần ${currentPartIndex + 1}`}
                    </div>

                    {groups.map((group: any, gIdx: number) => (
                        <div key={group.group_id} style={{ marginBottom: 40 }}>
                            {group.passage && (
                                <div style={{ background: "#f8fafc", padding: "32px", borderRadius: 16, border: "1px solid #f1f5f9" }}>
                                    <h3 style={{ fontSize: 18, color: "#1e293b", marginBottom: 20, borderBottom: '1px solid #e2e8f0', paddingBottom: 12 }}>
                                        {group.title || "Passage Content"}
                                    </h3>
                                    <div style={{ fontSize: 15, lineHeight: 1.8, color: "#334155", textAlign: "justify", whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: group.passage.content }} />
                                </div>
                            )}
                            {group.audio && (
                                <div style={{ background: "#f0f9ff", padding: "24px", borderRadius: 16, border: "1px solid #e0f2fe", marginTop: group.passage ? 24 : 0 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                                        <div style={{ width: 40, height: 40, background: "#3b82f6", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🎧</div>
                                        <div>
                                            <div style={{ fontSize: 14, fontWeight: 700, color: "#1e3a8a" }}>{group.audio.title || "Listening Audio"}</div>
                                            <div style={{ fontSize: 12, color: "#3b82f6" }}>Chất lượng cao • IELTS Listening</div>
                                        </div>
                                    </div>
                                    <audio 
                                        controls 
                                        src={`http://localhost:8000${group.audio.audio_file}`} 
                                        style={{ width: "100%" }} 
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* RIGHT: QUESTIONS & FEEDBACK */}
                <div style={{ flex: 5.5, background: "#f1f5f9", overflowY: "auto", padding: "32px", display: "flex", flexDirection: "column", gap: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h2 style={{ fontSize: 20, color: "#0f172a", margin: 0, fontWeight: 700 }}>Câu trả lời & Kết quả</h2>
                        <div style={{ fontSize: 13, background: "#fff", padding: "4px 12px", borderRadius: 12, border: "1px solid #e2e8f0", color: "#64748b" }}>
                            Phần thi này có <strong>{groups.reduce((acc: number, g: any) => acc + (g.questions?.length || 0), 0)}</strong> câu hỏi
                        </div>
                    </div>

                    {groups.map((group: any) => (
                        <div key={`qg-${group.group_id}`} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            {group.questions?.map((q: any, i: number) => (
                                <QuestionRenderer 
                                    key={q.question_id} 
                                    question={q} 
                                    index={i}
                                    value={unifiedAnswers[q.question_id] || ""} 
                                    onChange={() => {}} // Disabled in review
                                    mode="review"
                                />
                            ))}
                        </div>
                    ))}

                    {/* NAVIGATION IN REVIEW */}
                    <div style={{ marginTop: "auto", paddingTop: 40, display: "flex", justifyContent: "space-between", gap: 16 }}>
                        <button 
                            disabled={isFirstPart}
                            onClick={() => setCurrentPartIndex(prev => prev - 1)}
                            style={{ 
                                padding: "12px 28px", borderRadius: 10, background: isFirstPart ? "#e2e8f0" : "#fff", 
                                border: "1px solid #cbd5e1", color: isFirstPart ? "#94a3b8" : "#475569", 
                                fontWeight: 700, cursor: isFirstPart ? "not-allowed" : "pointer", fontSize: 14,
                                flex: 1
                            }}
                        >
                            ← Phần trước
                        </button>
                        <button 
                            disabled={isLastPart}
                            onClick={() => setCurrentPartIndex(prev => prev + 1)}
                            style={{ 
                                padding: "12px 28px", borderRadius: 10, background: isLastPart ? "#e2e8f0" : "#3b82f6", 
                                border: "none", color: "#fff", fontWeight: 700, 
                                cursor: isLastPart ? "not-allowed" : "pointer", fontSize: 14,
                                flex: 1
                            }}
                        >
                            Phần tiếp theo →
                        </button>
                    </div>
                </div>

            </main>
        </div>
    );
}
