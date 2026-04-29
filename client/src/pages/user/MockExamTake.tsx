import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import userExamService from "../../services/userExamService";
import QuestionRenderer from "../../components/exam/QuestionRenderer";
import HighlightablePassage from "../../components/exam/HighlightablePassage";
import VoiceRecorder from "../../components/exam/VoiceRecorder";
import MockAudioPlayer from "../../components/exam/MockAudioPlayer";

export default function MockExamTake() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [test, setTest] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentPartIndex, setCurrentPartIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Timer state
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const timerRef = useRef<any>(null);

    // Mock specific states
    const [testStartTime] = useState<string>(new Date().toISOString());
    const [submittedSkills, setSubmittedSkills] = useState<string[]>([]);
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
            alert("Đã hết thời gian làm bài kỹ năng này!");
            handleNextSkill();
        }
        return () => clearInterval(timerRef.current);
    }, [timeLeft]);

    const fetchTestStructure = async (testId: string) => {
        try {
            const res = await userExamService.getFullStructure(testId);
            const data = res.data;
            setTest(data);

            const skillMap = new Map();
            data.parts?.forEach((p: any, idx: number) => {
                const s = p.skill;
                if (s && !skillMap.has(s.id)) {
                    skillMap.set(s.id, { ...s, firstPartIndex: idx });
                }
            });
            const skillsArr = Array.from(skillMap.values());
            setUniqueSkills(skillsArr);

            // Set initial timer for the first skill
            if (skillsArr.length > 0) {
                const firstSkill = skillsArr[0];
                setTimeLeft(parseInt(firstSkill.time_limit || "60", 10) * 60);
            }

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

    const handleFinalSubmit = async () => {
        if (!window.confirm("Xác nhận nộp toàn bộ bài thi thử?")) return;
        
        setIsSubmitting(true);
        try {
            const res: any = await userExamService.submitExam({
                test_id: id,
                answers: answers,
                start_time: testStartTime
            });

            const resultData = res.data || res;
            const resultId = resultData.result_id || resultData.data?.result_id;

            if (resultId) {
                alert("Chúc mừng bạn đã hoàn thành bài thi thử!");
                navigate(`/user/results/${resultId}`);
            } else {
                alert("Nộp bài thành công nhưng không tìm thấy ID kết quả.");
                navigate("/user/results");
            }
        } catch (err) {
            alert("Lỗi khi nộp bài. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNextSkill = async () => {
        const currentPart = test?.parts[currentPartIndex];
        const currentSkillId = currentPart?.skill?.id;
        if (!currentSkillId) return;

        const currentSkillIdx = uniqueSkills.findIndex(s => s.id === currentSkillId);
        const isLastSkill = currentSkillIdx === uniqueSkills.length - 1;

        if (isLastSkill) {
            await handleFinalSubmit();
        } else {
            if (timeLeft !== 0) { // Don't ask if time already up
                if (!window.confirm("Bạn có chắc chắn muốn nộp kỹ năng này? Bạn sẽ không thể quay lại sửa bài.")) return;
            }
            
            setSubmittedSkills(prev => [...prev, currentSkillId]);
            const nextSkill = uniqueSkills[currentSkillIdx + 1];
            setCurrentPartIndex(nextSkill.firstPartIndex);
            
            // Reset timer for next skill
            setTimeLeft(parseInt(nextSkill.time_limit || "60", 10) * 60);
        }
    };

    if (loading) return <div style={{ padding: 100, textAlign: "center", fontSize: 20, fontWeight: 700, color: "#64748b" }}>🎬 Đang chuẩn bị phòng thi thử...</div>;
    if (!test || !test.parts) return <div style={{ padding: 100, textAlign: "center" }}>Không tìm thấy dữ liệu đề thi.</div>;

    const currentPart = test.parts[currentPartIndex];
    const currentSkillId = currentPart?.skill?.id;
    const currentSkillName = currentPart?.skill?.skill_name || "";
    const currentSkillIdx = uniqueSkills.findIndex(s => s.id === currentSkillId);
    const isLastSkill = currentSkillIdx === uniqueSkills.length - 1;

    const formatTime = (secs: number) => {
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = secs % 60;
        if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#f8fafc", fontFamily: "'DM Sans', sans-serif" }}>
            
            <header style={{ background: "#0f172a", color: "#fff", display: "flex", flexDirection: "column", zIndex: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ background: "#ef4444", color: "#fff", padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>MOCK TEST MODE</div>
                        <h1 style={{ fontSize: 18, margin: 0, fontWeight: 700 }}>{test.test_name}</h1>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                        <div style={{ background: "rgba(255,255,255,0.1)", padding: "8px 16px", borderRadius: 8, display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontSize: 12, color: "#94a3b8" }}>THỜI GIAN CÒN LẠI (KỸ NĂNG):</span>
                            <span style={{ fontSize: 20, fontWeight: 800, color: (timeLeft && timeLeft < 300) ? "#ef4444" : "#4ade80", fontFamily: "monospace" }}>
                                {timeLeft !== null ? formatTime(timeLeft) : "--:--"}
                            </span>
                        </div>
                        <button 
                            onClick={handleNextSkill} 
                            disabled={isSubmitting}
                            style={{ 
                                background: isLastSkill ? "#10b981" : "#3b82f6", color: "#fff", border: "none", 
                                padding: "10px 24px", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 15 
                            }}
                        >
                            {isSubmitting ? "Đang xử lý..." : (isLastSkill ? "Nộp bài & Kết thúc" : "Nộp kỹ năng & Tiếp theo")}
                        </button>
                    </div>
                </div>

                <div style={{ display: "flex", background: "#1e293b", padding: "0 24px", gap: 24 }}>
                    {uniqueSkills.map((s, idx) => {
                        const isSubmitted = submittedSkills.includes(s.id);
                        const isActive = s.id === currentSkillId;
                        const isLocked = !isActive && !isSubmitted && idx > currentSkillIdx;

                        return (
                            <div 
                                key={s.id}
                                style={{
                                    padding: "16px 4px", fontSize: 15, fontWeight: isActive ? 700 : 500,
                                    color: isActive ? "#60a5fa" : isSubmitted ? "#10b981" : "#475569",
                                    borderBottom: isActive ? "3px solid #60a5fa" : "3px solid transparent",
                                    cursor: "default", opacity: isLocked ? 0.5 : 1,
                                    display: "flex", alignItems: "center", gap: 8
                                }}
                            >
                                {isSubmitted ? "✅" : isLocked ? "🔒" : idx + 1 + "."} {s.skill_name}
                            </div>
                        );
                    })}
                </div>
            </header>

            <main style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                <div style={{ flex: 5, background: "#fff", borderRight: "2px solid #e2e8f0", overflowY: "auto", padding: "32px" }}>
                    <div style={{ background: "#f1f5f9", padding: "12px 20px", borderRadius: 12, marginBottom: 24, fontWeight: 700, color: "#475569" }}>
                        📍 {currentSkillName} - {currentPart?.part_name || `Phần ${currentPartIndex + 1}`}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                        {currentPart?.question_groups?.map((group: any) => (
                            <div key={group.group_id} style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: 24 }}>
                                {group.title && <h3 style={{ fontSize: 16, color: "#1e293b", marginBottom: 16 }}>{group.title}</h3>}
                                
                                {group.audio && (
                                    <div style={{ marginBottom: 20 }}>
                                        <MockAudioPlayer 
                                            src={`http://localhost:8000${group.audio.audio_file}`} 
                                            title={group.audio.title} 
                                        />
                                    </div>
                                )}

                                {group.passage && (
                                    <HighlightablePassage 
                                        content={group.passage.content} 
                                        autoHighlight={true} 
                                        disableTranslation={true} 
                                    />
                                )}

                                {group.passage?.img && (
                                    <img src={`http://localhost:8000${group.passage.img}`} alt="task" style={{ width: "100%", marginTop: 16, borderRadius: 12 }} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ flex: 6, background: "#f8fafc", overflowY: "auto", padding: "32px", display: "flex", flexDirection: "column", gap: 24 }}>
                    {currentPart?.question_groups?.map((group: any) => {
                        const groupAnswerKey = `GROUP_${group.group_id}`;
                        const isWriting = currentSkillName.toLowerCase().includes("writing");
                        const isSpeaking = currentSkillName.toLowerCase().includes("speaking");

                        return (
                            <div key={`ans-${group.group_id}`} style={{ background: "#fff", padding: 24, borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                                {isWriting ? (
                                    <textarea 
                                        style={{ width: "100%", minHeight: 400, padding: 20, borderRadius: 12, border: "1px solid #e2e8f0", outline: "none", fontSize: 15, lineHeight: 1.6 }}
                                        placeholder="Nhập bài viết của bạn tại đây..."
                                        value={answers[groupAnswerKey] || ""}
                                        onChange={(e) => handleAnswerChange(groupAnswerKey, e.target.value)}
                                    />
                                ) : isSpeaking ? (
                                    <VoiceRecorder 
                                        onUploadSuccess={(url) => handleAnswerChange(`SPEECH_${group.group_id}`, url)}
                                        initialAudioUrl={answers[`SPEECH_${group.group_id}`]}
                                        readOnly={true}
                                    />
                                ) : (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                        {group.questions?.map((q: any, i: number) => (
                                            <QuestionRenderer 
                                                key={q.question_id}
                                                question={q} 
                                                index={i}
                                                value={answers[q.question_id] || ""} 
                                                onChange={(val) => handleAnswerChange(q.question_id, val)} 
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    
                    {/* Navigation inside skill parts */}
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
                         <button 
                            disabled={currentPartIndex === 0 || uniqueSkills.find(s => s.id === currentSkillId)?.firstPartIndex === currentPartIndex}
                            onClick={() => setCurrentPartIndex(prev => prev - 1)}
                            style={{ padding: "10px 20px", borderRadius: 8, background: "#fff", border: "1px solid #e2e8f0", cursor: "pointer" }}
                         >
                            ← Phần trước
                         </button>
                         <button 
                            disabled={currentPartIndex === test.parts.length - 1 || (test.parts[currentPartIndex + 1]?.skill?.id !== currentSkillId)}
                            onClick={() => setCurrentPartIndex(prev => prev + 1)}
                            style={{ padding: "10px 20px", borderRadius: 8, background: "#fff", border: "1px solid #e2e8f0", cursor: "pointer" }}
                         >
                            Phần tiếp theo →
                         </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
