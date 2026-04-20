import React from "react";

interface QuestionRendererProps {
    question: any;
    index: number;
    value: string;
    onChange: (val: string) => void;
    mode?: 'exam' | 'review';
}

export default function QuestionRenderer({ question, index, value, onChange, mode = 'exam' }: QuestionRendererProps) {
    const qType = (question.question_type || "").toUpperCase();

    return (
        <div style={{ background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" }}>
            <div style={{ flex: 1 }}>
                {/* RENDERING SPECIFIC TYPES */}
                {qType === "MCQ" && <McqExamUI question={question} value={value} onChange={onChange} mode={mode} index={index} />}
                {qType === "TFNG" && <TfngExamUI question={question} value={value} onChange={onChange} mode={mode} index={index} />}
                {qType === "FILL" && <FillExamUI question={question} value={value} onChange={onChange} mode={mode} index={index} />}
                {qType === "DROPDOWN" && <DropdownExamUI question={question} value={value} onChange={onChange} mode={mode} index={index} />}
                {qType === "MATCHING" && <MatchingExamUI question={question} value={value} onChange={onChange} mode={mode} index={index} />}
                
                {!["MCQ", "TFNG", "FILL", "DROPDOWN", "MATCHING"].includes(qType) && (
                    <div style={{ color: "#ef4444", fontStyle: "italic" }}>Chưa hỗ trợ định dạng câu hỏi này.</div>
                )}
            </div>
        </div>
    );
}

// --- Specific UI Components ---

function McqExamUI({ question, value, onChange, mode, index }: any) {
    const mcq = question.mcq_question || question.mcqQuestion;
    if (!mcq) return <div style={{ color: "red" }}>Dữ liệu MCQ lỗi</div>;

    const options = mcq.options || [];
    const isMultiple = options.length > 4;
    const isReview = mode === 'review';

    // Phân tích giá trị đã chọn
    let selectedIds: string[] = [];
    if (isMultiple) {
        try {
            const parsed = JSON.parse(value);
            selectedIds = Array.isArray(parsed) ? parsed : (value ? [value] : []);
        } catch {
            selectedIds = value ? [value] : [];
        }
    } else {
        selectedIds = value ? [value] : [];
    }

    const handleSelect = (optionId: string) => {
        if (isReview) return;
        if (isMultiple) {
            let next: string[];
            if (selectedIds.includes(optionId)) {
                next = selectedIds.filter(id => id !== optionId);
            } else {
                if (selectedIds.length >= 2) return; 
                next = [...selectedIds, optionId];
            }
            onChange(JSON.stringify(next));
        } else {
            onChange(optionId);
        }
    };

    return (
        <div style={{ padding: "0 10px" }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                <div style={{ 
                    fontSize: 18, fontWeight: 800, 
                    color: isReview ? (options.some((o: any) => selectedIds.includes(o.option_id) && o.is_correct) ? "#22c55e" : (selectedIds.length > 0 ? "#ef4444" : "#94a3b8")) : "#1e293b" 
                }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: isReview ? (options.some((o: any) => selectedIds.includes(o.option_id) && o.is_correct) ? "#dcfce7" : (selectedIds.length > 0 ? "#fee2e2" : "#f1f5f9")) : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {index + 1}
                    </div>
                </div>
                <div style={{ fontSize: 16, color: "#1e293b", lineHeight: 2.5, fontWeight: 600 }} dangerouslySetInnerHTML={{ __html: mcq.content || "" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingLeft: 30 }}>
                {options.map((opt: any, idx: number) => {
                    const isSelected = selectedIds.includes(opt.option_id);
                    const isCorrect = opt.is_correct;
                    const letter = String.fromCharCode(65 + idx); // A, B, C, D...
                    
                    let color = "#1e293b";
                    let circleBorder = "#cbd5e1";
                    let circleBg = "transparent";
                    let circleColor = "#64748b";

                    if (isReview) {
                        if (isCorrect) {
                            color = "#16a34a";
                            circleBorder = "#22c55e";
                            circleColor = "#16a34a";
                            // IF correct answer was unselected, we still want a green circle bg to stand out? Standard is just green text/border. Let's stick to green border/text.
                        } else if (isSelected && !isCorrect) {
                            color = "#dc2626";
                            circleBorder = "#ef4444";
                            circleColor = "#dc2626";
                        }
                    } else if (isSelected) {
                        circleBorder = "#14b8a6";
                        circleColor = "#14b8a6";
                        circleBg = "#f0fdfa";
                        color = "#14b8a6";
                    }

                    return (
                        <div key={opt.option_id} style={{
                            display: "flex", alignItems: "center", gap: 16, cursor: isReview ? "default" : "pointer",
                            transition: "all 0.2s"
                        }}
                        onClick={() => handleSelect(opt.option_id)}
                        >
                            <span style={{ fontSize: 16, color: color, fontWeight: 400, width: 20 }}>{letter}</span>
                            <div style={{
                                width: 24, height: 24, borderRadius: "50%", border: `1.5px solid ${circleBorder}`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                background: circleBg,
                                flexShrink: 0, position: 'relative'
                            }}>
                                {isSelected && isReview && !isCorrect && (
                                     <div style={{ position: 'absolute', width: 14, height: 14, background: '#ef4444', borderRadius: '50%' }} />
                                )}
                                {isSelected && isReview && isCorrect && (
                                     <div style={{ position: 'absolute', width: 14, height: 14, background: '#22c55e', borderRadius: '50%' }} />
                                )}
                                {isSelected && !isReview && (
                                     <div style={{ position: 'absolute', width: 14, height: 14, background: '#14b8a6', borderRadius: '50%' }} />
                                )}
                            </div>

                            <span style={{ fontSize: 15, color: color, lineHeight: 1.5, flex: 1, fontWeight: 400 }}>
                                {opt.content}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function TfngExamUI({ question, value, onChange, mode, index }: any) {
    const tfng = question.tfng_question || question.tfngQuestion;
    if (!tfng) return <div style={{ color: "red" }}>Dữ liệu TFNG lỗi</div>;

    const isReview = mode === 'review';
    const correctAns = tfng.answers && tfng.answers.length > 0 ? tfng.answers[0].correct_answer : null;
    const isCorrect = value === correctAns;

    const options = [
        { val: "TRUE", color: "#10b981" },
        { val: "FALSE", color: "#ef4444" },
        { val: "NOT GIVEN", color: "#64748b" }
    ];

    return (
        <div>
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                <div style={{ 
                    fontSize: 18, fontWeight: 800, 
                    color: isReview ? (isCorrect ? "#22c55e" : (value ? "#ef4444" : "#94a3b8")) : "#1e293b" 
                }}>
                    {index + 1}
                </div>
                <div style={{ fontSize: 16, color: "#1e293b", fontWeight: 700 }} dangerouslySetInnerHTML={{ __html: tfng.content || "" }} />
            </div>
            <div style={{ display: "flex", gap: 16, paddingLeft: 30 }}>
                {options.map(opt => {
                    const isSelected = value === opt.val;
                    const isSystemCorrect = correctAns === opt.val;
                    
                    let background = "#fff";
                    let textColor = "#475569";
                    let borderColor = "#cbd5e1";

                    if (isReview) {
                        if (isSystemCorrect) {
                            background = "#22c55e";
                            textColor = "#fff";
                            borderColor = "#16a34a";
                        } else if (isSelected && !isSystemCorrect) {
                            background = "#ef4444";
                            textColor = "#fff";
                            borderColor = "#dc2626";
                        }
                    } else if (isSelected) {
                        background = opt.color;
                        textColor = "#fff";
                        borderColor = opt.color;
                    }

                    return (
                        <label key={opt.val} style={{ flex: 1, display: "flex", justifyContent: "center", cursor: isReview ? "default" : "pointer" }}>
                            <input
                                type="radio"
                                checked={isSelected}
                                onChange={() => !isReview && onChange(opt.val)}
                                style={{ display: "none" }}
                            />
                            <div style={{
                                width: "100%", textAlign: "center", padding: "12px 0", borderRadius: 12, fontWeight: 800, fontSize: 14,
                                background: background, color: textColor, border: `2px solid ${borderColor}`, transition: "all 0.2s",
                                position: 'relative'
                            }}>
                                {opt.val}
                                {isReview && isSystemCorrect && <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}>✅</span>}
                                {isReview && isSelected && !isSystemCorrect && <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}>❌</span>}
                            </div>
                        </label>
                    );
                })}
            </div>
            {isReview && value === "" && (
                <div style={{ marginTop: 12, fontSize: 13, color: "#94a3b8", fontWeight: 700, padding: "6px 16px", background: "#f1f5f9", borderRadius: 8, display: "inline-block" }}>
                    ⚠️ Bạn chưa trả lời câu này
                </div>
            )}
        </div>
    );
}

function FillExamUI({ question, value, onChange, mode, index }: any) {
    const fill = question.fill_question || question.fillQuestion;
    if (!fill) return <div style={{ color: "red" }}>Dữ liệu FILL lỗi</div>;

    const isReview = mode === 'review';
    const content = fill.content || "";
    const blanks = content.split("____");

    let answersArr: string[] = [];
    try { 
        const parsed = JSON.parse(value); 
        answersArr = Array.isArray(parsed) ? parsed : [value];
    } catch { 
        answersArr = value ? [value] : []; 
    }

    const correctAnswers = (fill.answers || []).map((a: any) => a.correct_answer);
    
    // Check if an answer is correct considering alternative answers split by '/'
    const checkIsCorrect = (userAns: string, sysAns: string) => {
        if (!userAns || !sysAns) return false;
        const alternatives = sysAns.split('/').map(s => s.trim().toLowerCase());
        return alternatives.includes(userAns.trim().toLowerCase());
    };

    const isAllCorrect = blanks.length > 1 && answersArr.every((ans, idx) => checkIsCorrect(ans || "", correctAnswers[idx] || ""));

    const handleBlankChange = (idx: number, val: string) => {
        if (isReview) return;
        const arr = [...answersArr];
        arr[idx] = val;
        onChange(JSON.stringify(arr));
    };

    return (
        <div>
             <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <div style={{ 
                    fontSize: 18, fontWeight: 800, 
                    color: isReview ? (isAllCorrect ? "#22c55e" : (answersArr.some(a => a) ? "#ef4444" : "#94a3b8")) : "#1e293b" 
                }}>
                    {index + 1}
                </div>
                <div style={{ fontSize: 15, color: "#334155", lineHeight: 2.2, whiteSpace: "pre-wrap", flex: 1 }}>
                    {blanks.map((part: string, i: number) => {
                        const userAns = (answersArr[i] || "").trim();
                        const sysAns = (correctAnswers[i] || "").trim();
                        const isBlankCorrect = checkIsCorrect(userAns, sysAns);

                        return (
                            <React.Fragment key={i}>
                                <span dangerouslySetInnerHTML={{ __html: part }} />
                                {i < blanks.length - 1 && (
                                    <span style={{ display: 'inline-block', verticalAlign: 'middle', margin: '0 4px' }}>
                                        {isReview ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: isBlankCorrect ? '#f0fdf4' : '#fef2f2', padding: '2px 8px', borderRadius: 6, border: isBlankCorrect ? '1px solid #bcf0da' : '1px solid #fecaca' }}>
                                                 <span style={{ color: isBlankCorrect ? '#16a34a' : '#dc2626', fontWeight: 800 }}>{userAns || "(Bỏ trống)"}</span>
                                                 {!isBlankCorrect && (
                                                     <>
                                                        <span style={{ color: '#94a3b8' }}>→</span>
                                                        <span style={{ color: '#16a34a', fontWeight: 800 }}>{sysAns}</span>
                                                     </>
                                                 )}
                                                 <span style={{ marginLeft: 4 }}>{isBlankCorrect ? '✅' : '❌'}</span>
                                            </div>
                                        ) : (
                                            <input
                                                type="text"
                                                value={userAns}
                                                onChange={(e) => handleBlankChange(i, e.target.value)}
                                                placeholder={`${i + 1}`}
                                                style={{
                                                    width: 140, padding: "2px 8px", borderRadius: 4,
                                                    border: "none", borderBottom: "2px solid #3b82f6", 
                                                    outline: "none", background: "transparent", 
                                                    textAlign: "center", fontWeight: 700,
                                                    color: "#1e40af", fontSize: 14
                                                }}
                                            />
                                        )}
                                    </span>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function DropdownExamUI({ question, value, onChange, mode, index }: any) {
    const dropdown = question.dropdown_question || question.dropdownQuestion;
    if (!dropdown) return <div style={{ color: "red" }}>Dữ liệu DROPDOWN lỗi</div>;

    const isReview = mode === 'review';
    const options = dropdown.options || [];
    const content = dropdown.content || "";
    const parts = content.split("[dropdown]");
    const correctOption = options.find((o: any) => o.is_correct);
    const isCorrect = value === correctOption?.option_text;

    return (
        <div>
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <div style={{ 
                    fontSize: 18, fontWeight: 800, 
                    color: isReview ? (isCorrect ? "#22c55e" : (value ? "#ef4444" : "#94a3b8")) : "#1e293b" 
                }}>
                    {index + 1}
                </div>
                <div style={{ fontSize: 15, color: "#334155", lineHeight: 1.8, flex: 1 }}>
                    {parts.map((part: string, i: number) => (
                <React.Fragment key={i}>
                    <span dangerouslySetInnerHTML={{ __html: part }} />
                    {i < parts.length - 1 && (
                        <span style={{ display: 'inline-block', verticalAlign: 'middle', margin: '0 4px' }}>
                             {isReview ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: isCorrect ? '#f0fdf4' : '#fef2f2', padding: '4px 12px', borderRadius: 8, border: isCorrect ? '1px solid #bcf0da' : '1px solid #fecaca' }}>
                                     <span style={{ color: isCorrect ? '#16a34a' : '#dc2626', fontWeight: 800 }}>{value || "(Bỏ trống)"}</span>
                                     {!isCorrect && (
                                         <>
                                            <span style={{ color: '#94a3b8' }}>→</span>
                                            <span style={{ color: '#16a34a', fontWeight: 800 }}>{correctOption?.option_text}</span>
                                         </>
                                     )}
                                     <span>{isCorrect ? '✅' : '❌'}</span>
                                </div>
                             ) : (
                                <select
                                    value={value}
                                    onChange={(e) => onChange(e.target.value)}
                                    style={{
                                        padding: "4px 32px 4px 12px", borderRadius: 6, 
                                        border: "1px solid #cbd5e1", 
                                        outline: "none", background: "#f8fafc", 
                                        fontWeight: 600, color: "#0f172a", 
                                        cursor: "pointer", fontSize: 14
                                    }}
                                >
                                    <option value="" disabled>--- Chọn ---</option>
                                    <option value={value}>{value || ""}</option>
                                </select>
                             )}
                        </span>
                    )}
                </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}

function MatchingExamUI({ question, value, onChange, mode, index }: any) {
    const matching = question.matching_question || question.matchingQuestion;
    if (!matching) return <div style={{ color: "#ef4444", padding: 10 }}>⚠️ Dữ liệu Matching lỗi</div>;

    const isReview = mode === 'review';
    const pairs: any[] = matching.answers || [];

    let selectedMap: Record<string, string> = {};
    try { selectedMap = JSON.parse(value); } catch { selectedMap = {}; }

    // Check if all pairs are correct
    const isAllCorrect = pairs.length > 0 && pairs.every(p => (selectedMap[p.answer_id] || "").toLowerCase() === (p.right_item || "").toLowerCase());

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", gap: 12 }}>
                <div style={{ 
                    fontSize: 18, fontWeight: 800, 
                    color: isReview ? (isAllCorrect ? "#22c55e" : (value !== "{}" ? "#ef4444" : "#94a3b8")) : "#1e293b" 
                }}>
                    {index + 1}
                </div>
                <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, whiteSpace: "pre-wrap", background: "#f8fafc", padding: "14px 18px", borderRadius: 12, border: "1px solid #e2e8f0", borderLeft: "4px solid #22c55e", flex: 1 }}>
                    {matching.content}
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {pairs.map((pair: any, idx: number) => {
                    const chosen = selectedMap[pair.answer_id] || "";
                    const correct = pair.right_item;
                    const isCorrect = (chosen || "").toLowerCase() === (correct || "").toLowerCase();
                    
                    return (
                        <div key={pair.answer_id} style={{
                            display: "flex", alignItems: "center", gap: 16, padding: "12px 20px",
                            background: isReview 
                                ? (chosen === "" ? "#f1f5f9" : (isCorrect ? "#f0fdf4" : "#fef2f2")) 
                                : (chosen ? "#eff6ff" : "#fff"),
                            border: isReview 
                                ? (chosen === "" ? "2px solid #94a3b8" : (isCorrect ? "2px solid #22c55e" : "2px solid #ef4444")) 
                                : (chosen ? "2px solid #3b82f6" : "1px dashed #cbd5e1"),
                            borderRadius: 16
                        }}>
                            <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#475569", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13 }}>
                                {idx + 1}
                            </span>
                            <div style={{ flex: 1, fontSize: 14, color: "#1e293b", fontWeight: 500 }}>
                                {pair.left_item}
                            </div>
                            <div style={{ fontSize: 20, color: "#94a3b8" }}>→</div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ minWidth: 140, padding: "8px 16px", background: "#fff", borderRadius: 8, border: "1px solid #e2e8f0", fontWeight: 700, color: isReview ? (chosen === "" ? "#64748b" : (isCorrect ? "#15803d" : "#ef4444")) : "#1e40af", textAlign: "center" }}>
                                    {chosen || (isReview ? "(Bỏ trống)" : "...")}
                                </div>
                                
                                {isReview && !isCorrect && (
                                    <>
                                        <div style={{ color: '#94a3b8' }}>→</div>
                                        <div style={{ minWidth: 140, padding: "8px 16px", background: "#dcfce7", borderRadius: 8, border: "2px solid #22c55e", color: "#15803d", fontWeight: 700, textAlign: "center" }}>
                                            {correct}
                                        </div>
                                    </>
                                )}
                                {isReview && (<span>{isCorrect ? '✅' : '❌'}</span>)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

