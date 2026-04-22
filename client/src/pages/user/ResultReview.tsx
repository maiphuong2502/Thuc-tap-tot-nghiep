import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userExamService from "../../services/userExamService";
import QuestionRenderer from "../../components/exam/QuestionRenderer";
import HighlightablePassage from "../../components/exam/HighlightablePassage";

export default function ResultReview() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentPartIndex, setCurrentPartIndex] = useState(0);
    const [unifiedAnswers, setUnifiedAnswers] = useState<Record<string, string>>({});
    const [uniqueSkills, setUniqueSkills] = useState<any[]>([]);
    const [isHighlighterActive, setIsHighlighterActive] = useState(false);
    const [isTranslatorActive, setIsTranslatorActive] = useState(false);

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
            
            // FILL - Group many rows per question by question_id and sort by blank_index
            const fillAnswersRaw = testResult.fillUserAnswers || testResult.fill_user_answers || [];
            const fillGrouped: Record<string, string[]> = {};
            
            // Sort to ensure blanks appear in correct order
            [...fillAnswersRaw].sort((a, b) => (a.blank_index || 0) - (b.blank_index || 0)).forEach((a: any) => {
                if (!fillGrouped[a.question_id]) fillGrouped[a.question_id] = [];
                fillGrouped[a.question_id].push(a.user_answer ?? '');
            });

            Object.entries(fillGrouped).forEach(([qId, arr]) => {
                answers[qId] = arr.length === 1 ? arr[0] : JSON.stringify(arr);
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

            // WRITING (Group-based)
            (testResult.writingSubmissions || testResult.writing_submissions)?.forEach((s: any) => {
                answers[`GROUP_${s.group_id}`] = s.content;
            });

            // SPEAKING (Group-based)
            (testResult.speakingSubmissions || testResult.speaking_submissions)?.forEach((s: any) => {
                answers[`SPEECH_${s.group_id}`] = s.audio_url;
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
    
    // Calculate Score for the badge
    const correctCount = data.correct_count || 0;
    const totalCount = data.total_questions || 0;

    return (
        <div style={{ display: "flex", flex: 1, height: "100vh", background: "#f1f5f9", fontFamily: "'Inter', sans-serif", overflow: "hidden" }}>
            
            {/* SIDEBAR TOOLS */}
            <aside style={{ 
                width: 70, background: "#fff", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 0", gap: 20, zIndex: 100
            }}>
                <div style={{ color: "#64748b", fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>Công cụ</div>
                <button
                    onClick={() => setIsHighlighterActive(!isHighlighterActive)}
                    title="Highlight Tool"
                    style={{
                        width: 48, height: 48, borderRadius: 12, border: "none", cursor: "pointer",
                        background: isHighlighterActive ? "#22c55e" : "#f1f5f9",
                        color: isHighlighterActive ? "#fff" : "#64748b",
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
                        transition: "all 0.2s", boxShadow: isHighlighterActive ? "0 4px 12px rgba(34, 197, 94, 0.3)" : "none"
                    }}
                >
                    <span style={{ fontSize: 20 }}>✏️</span>
                    <span style={{ fontSize: 9, fontWeight: 700 }}>Highlight</span>
                </button>
            </aside>

            {/* MAIN AREA */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
                
                {/* HEADBAR */}
                <header style={{ 
                    height: 64, background: "#fff", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", zIndex: 90
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <button 
                            onClick={() => navigate(`/user/results/${id}`)} 
                            style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#64748b", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
                        >
                            ← Quay lại
                        </button>
                        <h1 style={{ fontSize: 16, margin: 0, fontWeight: 800, color: "#0f172a" }}>{test.test_name}</h1>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f0fdf4", border: "1px solid #bcf0da", padding: "8px 16px", borderRadius: 12 }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: "#16a34a" }}>{correctCount}/{totalCount} câu đúng</span>
                            <div style={{ width: 100, height: 6, background: "#dcfce7", borderRadius: 3, overflow: "hidden" }}>
                                <div style={{ height: "100%", background: "#22c55e", width: `${(correctCount/totalCount)*100}%` }} />
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                           <button style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer" }}>⚙️</button>
                           <button style={{ padding: "8px 16px", borderRadius: 8, background: "#22c55e", border: "none", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Chia sẻ bài làm</button>
                        </div>
                    </div>
                </header>

                {/* TABS OVERLAY */}
                <div style={{ height: 48, background: "#f8fafc", borderBottom: "1px solid #e2e8f0", display: "flex", padding: "0 24px", gap: 32 }}>
                    {uniqueSkills.map((s, idx) => {
                        const isActive = s.id === currentSkillId;
                        return (
                            <button 
                                key={s.id}
                                onClick={() => setCurrentPartIndex(s.firstPartIndex)}
                                style={{
                                    background: "transparent", border: "none", color: isActive ? "#22c55e" : "#64748b",
                                    padding: "0 4px", fontSize: 13, fontWeight: isActive ? 800 : 500,
                                    borderBottom: isActive ? "3px solid #22c55e" : "3px solid transparent",
                                    cursor: "pointer", transition: "all 0.2s"
                                }}
                            >
                                {idx + 1}. {s.skill_name}
                            </button>
                        );
                    })}
                </div>

                {/* CONTENT AREA */}
                <main style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                    
                    {/* LEFT: PASSAGE / AUDIO */}
                    <div style={{ flex: 4.5, background: "#fff", borderRight: "1px solid #e2e8f0", overflowY: "auto", padding: "40px", display: "flex", flexDirection: "column", gap: 40 }}>
                        {groups.map((group: any) => (
                            <div key={group.group_id}>
                                {group.passage && (
                                    <div style={{ marginBottom: 32 }}>
                                        <h3 style={{ fontSize: 20, fontWeight: 800, color: "#1e293b", marginBottom: 24, paddingLeft: 16, borderLeft: "4px solid #22c55e" }}>
                                            {group.title || "Reading Passage"}
                                        </h3>
                                        <HighlightablePassage 
                                            content={group.passage.content} 
                                            autoHighlight={isHighlighterActive} 
                                            autoTranslate={isTranslatorActive}
                                        />
                                        {group.passage.img && (
                                            <div style={{ 
                                                marginTop: 24, borderRadius: 12, overflow: "hidden", 
                                                border: "1px solid #e2e8f0", background: "#f8fafc",
                                                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)"
                                            }}>
                                                <img 
                                                    src={`http://localhost:8000${group.passage.img}`} 
                                                    alt="Writing Task"
                                                    style={{ width: "100%", maxHeight: 500, objectFit: "contain", display: "block" }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                                {group.audio && (
                                    <div style={{ background: "#f8fafc", padding: "24px", borderRadius: 20, border: "1px solid #e2e8f0" }}>
                                        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>🎧 {group.audio.title}</div>
                                        <audio controls src={`http://localhost:8000${group.audio.audio_file}`} style={{ width: "100%" }} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* RIGHT: QUESTIONS */}
                    <div id="review-question-container" style={{ flex: 5.5, background: "#f8fafc", overflowY: "auto", padding: "40px", display: "flex", flexDirection: "column", gap: 24 }}>
                        {groups.map((group: any) => {
                            const isWriting = currentSkillId === 'SK03';
                            const isSpeaking = currentSkillId === 'SK04';
                            
                            const groupAnswerKey = `GROUP_${group.group_id}`;
                            const speechAnswerKey = `SPEECH_${group.group_id}`;
                            
                            const essayContent = unifiedAnswers[groupAnswerKey] || "";
                            const speechUrl = unifiedAnswers[speechAnswerKey] || "";

                            return (
                                <div key={`qg-rev-${group.group_id}`}>
                                    <h4 style={{ fontSize: 16, fontWeight: 800, color: "#475569", marginBottom: 20 }}>{group.title || "Questions"}</h4>
                                    
                                    {isWriting ? (
                                        <div style={{ 
                                            background: "#fff", padding: 32, borderRadius: 16, 
                                            border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" 
                                        }}>
                                            <div style={{ marginBottom: 16, fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Bài viết của bạn:</div>
                                            <div style={{ 
                                                fontSize: 16, lineHeight: 1.8, color: "#334155", whiteSpace: "pre-wrap",
                                                fontFamily: "inherit"
                                            }}>
                                                {essayContent || <span style={{ fontStyle: "italic", color: "#94a3b8" }}>(Học sinh không nộp bài viết này)</span>}
                                            </div>
                                            {essayContent && (
                                                <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end" }}>
                                                    <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", background: "#f8fafc", padding: "4px 12px", borderRadius: 12 }}>
                                                        Số từ: {essayContent.trim().split(/\s+/).length}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ) : isSpeaking ? (
                                        <div style={{ 
                                            background: "#fff", padding: 32, borderRadius: 16, 
                                            border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                                            display: "flex", flexDirection: "column", gap: 16
                                        }}>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Bài nói của bạn:</div>
                                            {speechUrl ? (
                                                <div style={{ background: "#f8fafc", padding: 20, borderRadius: 12, border: "1px solid #e2e8f0" }}>
                                                    <audio controls src={`http://localhost:8000${speechUrl}`} style={{ width: "100%" }} />
                                                    <div style={{ marginTop: 12, fontSize: 12, color: "#64748b", textAlign: "center" }}>
                                                        File: {speechUrl.split('/').pop()}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div style={{ fontStyle: "italic", color: "#94a3b8", textAlign: "center", padding: 20 }}>
                                                    (Học sinh không thực hiện bài nói này)
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                            {group.questions?.map((q: any, i: number) => (
                                                <div key={q.question_id} id={`q-idx-${q.question_id}`}>
                                                    <QuestionRenderer 
                                                        question={q} 
                                                        index={i}
                                                        value={unifiedAnswers[q.question_id] || ""} 
                                                        onChange={() => {}} 
                                                        mode="review"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        
                        {/* PART NAVIGATION BUUTONS */}
                        <div style={{ marginTop: "auto", paddingTop: 40, display: "flex", justifyContent: "space-between", paddingBottom: 40 }}>
                            <button 
                                disabled={isFirstPart}
                                onClick={() => setCurrentPartIndex(prev => prev - 1)}
                                style={{ padding: "12px 24px", borderRadius: 8, background: isFirstPart ? "#f1f5f9" : "#fff", border: "1px solid #cbd5e1", color: isFirstPart ? "#94a3b8" : "#475569", fontWeight: 600, cursor: isFirstPart ? "not-allowed" : "pointer" }}
                            >
                                ← Phần trước
                            </button>
                            <button 
                                disabled={isLastPart}
                                onClick={() => setCurrentPartIndex(prev => prev + 1)}
                                style={{ padding: "12px 24px", borderRadius: 8, background: isLastPart ? "#f1f5f9" : "#3b82f6", border: isLastPart ? "1px solid #cbd5e1" : "none", color: isLastPart ? "#94a3b8" : "#fff", fontWeight: 600, cursor: isLastPart ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8 }}
                            >
                                Phần tiếp theo →
                            </button>
                        </div>
                        
                        <div style={{ height: 100 }} /> {/* Spacer for footer */}
                    </div>
                </main>

                {/* FOOTER: QUESTION MAP */}
                <footer style={{ 
                    height: 80, background: "#fff", borderTop: "2px solid #e2e8f0", display: "flex", alignItems: "center", padding: "0 32px", justifyContent: "space-between", zIndex: 100
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, overflowX: "auto", paddingBottom: 4 }}>
                        {/* Summary of groups */}
                        {groups.map((g: any) => 
                            g.questions?.map((q: any, idx: number) => {
                                const userAns = unifiedAnswers[q.question_id] || "";
                                // Simplistic correctness check (can be improved)
                                let statusColor = "#e2e8f0";
                                if (userAns) {
                                   // In a real app we'd check correctness here too, but for UI we assume data processed
                                   statusColor = "#22c55e"; // Simplified for mockup
                                }
                                return (
                                    <button 
                                        key={q.question_id}
                                        onClick={() => document.getElementById(`q-idx-${q.question_id}`)?.scrollIntoView({ behavior: 'smooth'})}
                                        style={{
                                            width: 32, height: 32, borderRadius: "50%", border: "none", background: statusColor, color: "#fff",
                                            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, cursor: "pointer"
                                        }}
                                    >
                                        {idx + 1}
                                    </button>
                                );
                            })
                        )}
                    </div>
                    
                    <div style={{ display: "flex", gap: 12 }}>
                        <button
                            onClick={() => navigate('/user/exams')}
                            style={{ padding: "10px 24px", borderRadius: 12, background: "#f1f5f9", border: "1px solid #cbd5e1", color: "#475569", fontWeight: 700, cursor: "pointer" }}
                        >
                            Về danh sách đề
                        </button>
                        <button 
                            onClick={() => navigate(`/user/exam/${test.test_id}/take`)}
                            style={{ padding: "10px 24px", borderRadius: 12, background: "#f59e0b", border: "none", color: "#fff", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
                        >
                            <span>🔄</span> Thi lại
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
}
