import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import userExamService from "../../services/userExamService";
import QuestionRenderer from "../../components/exam/QuestionRenderer";
import HighlightablePassage from "../../components/exam/HighlightablePassage";

export default function ExamTake() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [test, setTest] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentPartIndex, setCurrentPartIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isHighlighterActive, setIsHighlighterActive] = useState(false);
    const [isTranslatorActive, setIsTranslatorActive] = useState(false);
    
    // Timer state in seconds
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const timerRef = useRef<any>(null);

    // Derived states
    const [uniqueSkills, setUniqueSkills] = useState<any[]>([]);

    useEffect(() => {
        if (id) fetchTestStructure(id);
        return () => clearInterval(timerRef.current);
    }, [id]);

    useEffect(() => {
        if (timeLeft !== null && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => (prev && prev > 0 ? prev - 1 : 0));
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(timerRef.current);
            alert("Đã hết thời gian làm bài!");
            handleSubmit();
        }
        return () => clearInterval(timerRef.current);
    }, [timeLeft]);

    const fetchTestStructure = async (testId: string) => {
        try {
            const res = await userExamService.getFullStructure(testId);
            const data = res.data;
            setTest(data);

            // 1. Phân tách danh sách các Kỹ Năng từ mảng Parts để làm Menu Tab
            const skillMap = new Map();
            data.parts?.forEach((p: any, idx: number) => {
                const s = p.skill;
                if (s && !skillMap.has(s.id)) {
                    skillMap.set(s.id, { ...s, firstPartIndex: idx });
                }
            });
            const skillsArr = Array.from(skillMap.values());
            setUniqueSkills(skillsArr);

            // 2. Tính tổng thời gian = Tổng time_limit của các Kỹ Năng Độc lập
            let totalMins = 0;
            skillsArr.forEach((s: any) => {
                if (s.time_limit) totalMins += parseInt(s.time_limit, 10);
            });

            if (totalMins === 0) totalMins = 60; // fallback 60 mins nếu không cấu hình
            setTimeLeft(totalMins * 60);

        } catch (err: any) {
            alert("Lỗi tải đề thi!");
            navigate("/user/exams");
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionId: string, value: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        // 1. Kiểm tra các câu chưa trả lời
        const allQuestionIds: string[] = [];
        test.parts.forEach((p: any) => {
            p.question_groups?.forEach((g: any) => {
                g.questions?.forEach((q: any) => allQuestionIds.push(q.question_id));
            });
        });

        const answeredCount = Object.keys(answers).filter(id => answers[id] && answers[id] !== "" && answers[id] !== "{}" && answers[id] !== "[]").length;
        const remainingCount = allQuestionIds.length - answeredCount;

        let confirmMsg = "Bạn có chắc chắn muốn nộp bài không?";
        if (remainingCount > 0) {
            confirmMsg = `Bạn còn ${remainingCount} câu hỏi chưa hoàn thành. Bạn vẫn muốn nộp bài chứ?`;
        }

        if (!window.confirm(confirmMsg)) return;

        setIsSubmitting(true);
        try {
            const payload = {
                test_id: test.test_id,
                answers: answers,
                start_time: new Date().toISOString()
            };

            const response: any = await axiosClient.post("/submit-test", payload);
            
            // Theo axiosClient.ts, response.data đã được trả về trực tiếp
            const resultData = response.data || response;
            const resultId = resultData.result_id || resultData.data?.result_id;

            if (resultId) {
                alert("Nộp bài thành công!");
                navigate(`/user/results/${resultId}`);
            } else {
                alert("Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.");
            }
        } catch (error: any) {
            console.error("Submission error:", error);
            alert("Lỗi kết nối: " + (error.response?.data?.message || error.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Đang tải bài thi...</div>;
    if (!test || !test.parts || test.parts.length === 0) return <div style={{ padding: 40, textAlign: "center" }}>Bài thi không hợp lệ.</div>;

    const currentPart = test.parts[currentPartIndex];
    if (!currentPart) return <div style={{ padding: 40, textAlign: "center" }}>Lỗi render Part.</div>;

    const currentSkillId = currentPart.skill?.id;
    const currentSkillName = currentPart.skill?.skill_name || "Bài thi";

    // Phân trang
    const isFirstPart = currentPartIndex === 0;
    const isLastPart = currentPartIndex === test.parts.length - 1;

    // Xem nút "Kế tiếp" là sang Part khác hay sang Skill khác?
    const nextPart = !isLastPart ? test.parts[currentPartIndex + 1] : null;
    const isNextPartDifferentSkill = nextPart && nextPart.skill?.id !== currentSkillId;
    const nextButtonLabel = isLastPart 
        ? "Nộp Bài Ngay" 
        : (isNextPartDifferentSkill ? `Sang ${nextPart.skill?.skill_name || 'kỹ năng khác'}` : "Phần tiếp theo →");

    // Format timer
    const formatTime = (secs: number) => {
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = secs % 60;
        if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#f8fafc", fontFamily: "'DM Sans', sans-serif" }}>
            
            {/* HEADBAR */}
            <header style={{ 
                background: "#1e293b", color: "#fff", display: "flex", flexDirection: "column",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", zIndex: 10
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <button onClick={() => navigate("/user/exams")} style={{ background: "transparent", border: "1px solid #475569", color: "#cbd5e1", borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}>Thoát</button>
                        <div>
                            <h1 style={{ fontSize: 18, margin: 0, fontWeight: 700 }}>{test.test_name}</h1>
                        </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
                        <div style={{ background: "rgba(0,0,0,0.3)", padding: "8px 16px", borderRadius: 8, display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontSize: 14, color: "#94a3b8" }}>THỜI GIAN:</span>
                            <span style={{ fontSize: 20, fontWeight: 800, color: (timeLeft && timeLeft < 300) ? "#ef4444" : "#4ade80", fontFamily: "monospace" }}>
                                {timeLeft !== null ? formatTime(timeLeft) : "--:--"}
                            </span>
                        </div>
                        <button onClick={handleSubmit} style={{ background: "#3b82f6", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 15 }}>
                            Nộp Bài
                        </button>
                    </div>
                </div>

                {/* SKILLS TAB NAVIGATION */}
                <div style={{ display: "flex", background: "#0f172a", padding: "0 24px", gap: 24, borderTop: "1px solid #334155" }}>
                    {uniqueSkills.map((s, idx) => {
                        const isActive = s.id === currentSkillId;
                        return (
                            <button 
                                key={s.id}
                                onClick={() => setCurrentPartIndex(s.firstPartIndex)}
                                style={{
                                    background: "transparent", border: "none", color: isActive ? "#60a5fa" : "#94a3b8",
                                    padding: "16px 4px", fontSize: 16, fontWeight: isActive ? 700 : 500,
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
                
                {/* TRÁI: PASSAGE / AUDIO */}
                <div style={{ flex: 4, background: "#fff", borderRight: "2px solid #e2e8f0", overflowY: "auto", padding: "32px", display: "flex", flexDirection: "column", gap: 32 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div style={{ background: "#e0f2fe", color: "#0369a1", padding: "8px 16px", borderRadius: 8, alignSelf: "flex-start", fontWeight: 700, fontSize: 14 }}>
                            {currentSkillName} - {currentPart.part_name || `Phần ${currentPartIndex + 1}`}
                        </div>
                        {currentSkillName.toLowerCase().includes("reading") && (
                            <div style={{ display: "flex", gap: 10 }}>
                                <button
                                    onClick={() => setIsHighlighterActive(!isHighlighterActive)}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 8, background: isHighlighterActive ? "#312e81" : "#fff",
                                        color: isHighlighterActive ? "#fff" : "#1e293b", border: "1px solid #e2e8f0", padding: "6px 14px",
                                        borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700, transition: "all 0.2s",
                                        boxShadow: isHighlighterActive ? "0 0 10px rgba(79, 70, 229, 0.3)" : "none"
                                    }}
                                >
                                    <span>✏️</span>
                                    {isHighlighterActive ? "Highlight: ON" : "Highlight Tool"}
                                </button>
                                <button
                                    onClick={() => setIsTranslatorActive(!isTranslatorActive)}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 8, background: isTranslatorActive ? "#0369a1" : "#fff",
                                        color: isTranslatorActive ? "#fff" : "#1e293b", border: "1px solid #e2e8f0", padding: "6px 14px",
                                        borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700, transition: "all 0.2s",
                                        boxShadow: isTranslatorActive ? "0 0 10px rgba(3, 105, 161, 0.3)" : "none"
                                    }}
                                >
                                    <span>🌐</span>
                                    {isTranslatorActive ? "Dict: ON" : "Dict Tool"}
                                </button>
                            </div>
                        )}
                    </div>


                    {currentPart?.question_groups?.map((group: any, gIdx: number) => (
                        <div key={group.group_id} style={{ background: "#f8fafc", padding: 24, borderRadius: 16 }}>
                            <h3 style={{ fontSize: 16, color: "#3b82f6", marginTop: 0 }}>{group.title}</h3>
                            {group.audio && (
                                <div style={{ marginTop: 16, marginBottom: 16 }}>
                                    <div style={{ marginBottom: 8, fontSize: 13, color: "#64748b", fontWeight: 600 }}>
                                        🎧 {group.audio.title}
                                    </div>
                                    <audio 
                                        controls 
                                        src={`http://localhost:8000${group.audio.audio_file}`} 
                                        style={{ width: "100%", borderRadius: 8 }} 
                                    />
                                </div>
                            )}
                            {group.passage && (
                                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                    <HighlightablePassage 
                                        content={group.passage.content} 
                                        autoHighlight={isHighlighterActive} 
                                        autoTranslate={isTranslatorActive}
                                    />
                                    {group.passage.img && (
                                        <div style={{ 
                                            marginTop: 16, borderRadius: 12, overflow: "hidden", 
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
                            {!group.passage && !group.audio && (
                                <p style={{ color: "#94a3b8", fontStyle: "italic" }}>Ghi chú: Nhóm câu hỏi không có đoạn văn/audio.</p>
                            )}
                        </div>
                    ))}
                </div>

                {/* PHẢI: QUESTIONS */}
                <div style={{ flex: 6, background: "#f1f5f9", overflowY: "auto", padding: "32px", display: "flex", flexDirection: "column", gap: 24 }}>
                    <h2 style={{ fontSize: 22, color: "#0f172a", margin: 0 }}>Câu trả lời của bạn</h2>
                    {currentPart?.question_groups?.map((group: any) => {
                        const isWriting = currentPart.skill?.id === 'SK03' || currentPart.skill_id === 'SK03';
                        const groupAnswerKey = `GROUP_${group.group_id}`;
                        const writingValue = answers[groupAnswerKey] || "";
                        const wordCount = writingValue.trim() === "" ? 0 : writingValue.trim().split(/\s+/).length;

                        return (
                            <div key={`qg-${group.group_id}`} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                {isWriting ? (
                                    <div style={{ 
                                        background: "#fff", padding: 24, borderRadius: 12, 
                                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" 
                                    }}>
                                        <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <span style={{ fontSize: 14, fontWeight: 700, color: "#64748b" }}>Nhập bài viết của bạn tại đây:</span>
                                            <span style={{ 
                                                fontSize: 13, fontWeight: 800, padding: "4px 12px", 
                                                borderRadius: 20, background: "#f1f5f9", color: "#3b82f6" 
                                            }}>
                                                Số từ: {wordCount}
                                            </span>
                                        </div>
                                        <textarea
                                            value={writingValue}
                                            onChange={(e) => handleAnswerChange(groupAnswerKey, e.target.value)}
                                            placeholder="Write your response here..."
                                            style={{
                                                width: "100%", height: "400px", padding: 20, borderRadius: 12,
                                                border: "2px solid #e2e8f0", outline: "none", fontSize: 16,
                                                lineHeight: 1.6, fontFamily: "inherit", transition: "border-color 0.2s",
                                                resize: "vertical"
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                                            onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                                        />
                                    </div>
                                ) : (
                                    group.questions?.map((q: any, i: number) => (
                                        <QuestionRenderer 
                                            key={q.question_id} 
                                            question={q} 
                                            index={i}
                                            value={answers[q.question_id] || ""} 
                                            onChange={(val) => handleAnswerChange(q.question_id, val)}
                                        />
                                    ))
                                )}
                            </div>
                        );
                    })}

                    <div style={{ marginTop: "auto", paddingTop: 40, display: "flex", justifyContent: "space-between" }}>
                        <button 
                            disabled={isFirstPart}
                            onClick={() => setCurrentPartIndex(prev => prev - 1)}
                            style={{ padding: "12px 24px", borderRadius: 8, background: isFirstPart ? "#cbd5e1" : "#fff", border: "1px solid #cbd5e1", color: isFirstPart ? "#fff" : "#475569", fontWeight: 600, cursor: isFirstPart ? "not-allowed" : "pointer" }}
                        >
                            ← Quay lại
                        </button>
                        <button 
                            onClick={() => isLastPart ? handleSubmit() : setCurrentPartIndex(prev => prev + 1)}
                            style={{ padding: "12px 24px", borderRadius: 8, background: isLastPart ? "#10b981" : "#3b82f6", border: "none", color: "#fff", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
                        >
                            {nextButtonLabel}
                        </button>
                    </div>
                </div>

            </main>
        </div>
    );
}
