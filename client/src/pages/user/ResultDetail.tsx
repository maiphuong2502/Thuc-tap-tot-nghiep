import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

const ResultDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const response: any = await axiosClient.get(`/results/${id}`);
                // axiosClient returns response.data directly
                const resultData = response.data || response;
                setResult(resultData);
            } catch (error) {
                console.error("Lỗi lấy kết quả:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchResult();
    }, [id]);

    if (loading) return <div style={{ padding: 40, textAlign: "center", fontSize: 18, color: "#64748b" }}>Đang tính toán kết quả...</div>;
    if (!result) return <div style={{ padding: 40, textAlign: "center", color: "#ef4444" }}>Không tìm thấy thông tin kết quả bài thi.</div>;

    const correctRate = Math.round((result.correct_count / result.total_questions) * 100) || 0;

    return (
        <div style={{ minHeight: '100vh', background: '#f1f5f9', padding: '40px 20px', fontFamily: "'DM Sans', sans-serif" }}>
            <div style={{ maxWidth: 800, margin: '0 auto', background: '#fff', borderRadius: 24, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                
                {/* Header Section */}
                <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', padding: '48px 32px', textAlign: 'center', color: '#fff' }}>
                    <div style={{ marginBottom: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}>
                        <span style={{ fontSize: 32 }}>🏆</span>
                    </div>
                    <h1 style={{ fontSize: 28, margin: '0 0 8px', fontWeight: 800 }}>Kết Quả Bài Thi</h1>
                    <p style={{ margin: 0, opacity: 0.8, fontSize: 16 }}>{result.test?.test_name || "IELTS Practice Test"}</p>
                </div>

                <div style={{ padding: '40px 48px' }}>
                    {/* Score Highlights */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 40 }}>
                        <div style={{ textAlign: 'center', padding: 24, background: '#f8fafc', borderRadius: 16, border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>Số câu đúng</div>
                            <div style={{ fontSize: 32, fontWeight: 800, color: '#10b981' }}>{result.correct_count}<span style={{ fontSize: 16, color: '#94a3b8', marginLeft: 4 }}>/{result.total_questions}</span></div>
                        </div>
                        <div style={{ textAlign: 'center', padding: 24, background: '#eff6ff', borderRadius: 16, border: '1px solid #dbeafe' }}>
                            <div style={{ fontSize: 13, color: '#1e40af', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>Band Score</div>
                            <div style={{ fontSize: 32, fontWeight: 800, color: '#2563eb' }}>{result.band_score}</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: 24, background: '#f8fafc', borderRadius: 16, border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>Tỷ lệ chính xác</div>
                            <div style={{ fontSize: 32, fontWeight: 800, color: '#f59e0b' }}>{correctRate}%</div>
                        </div>
                    </div>

                    {/* Detailed Stats */}
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden', marginBottom: 40 }}>
                        <div style={{ padding: '16px 24px', background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', fontWeight: 700, color: '#334155' }}>Thông số chi tiết</div>
                        <div style={{ padding: '12px 0' }}>
                            {[
                                { label: 'Tổng số câu hỏi', value: result.total_questions, color: '#1e293b' },
                                { label: 'Số câu đúng', value: result.correct_count, color: '#10b981' },
                                { label: 'Số câu sai', value: result.wrong_count, color: '#ef4444' },
                                { label: 'Số câu bỏ trống', value: result.skipped_count, color: '#94a3b8' },
                            ].map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 24px', borderBottom: idx === 3 ? 'none' : '1px solid #f1f5f9' }}>
                                    <span style={{ color: '#64748b', fontSize: 15 }}>{item.label}</span>
                                    <span style={{ color: item.color, fontWeight: 700, fontSize: 15 }}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Skill Breakdown */}
                    <div style={{ marginBottom: 40 }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#334155', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 20 }}>📊</span> Bảng điểm thành phần
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                            {[
                                { label: 'Listening', value: result.listening_band, icon: '🎧', color: '#3b82f6' },
                                { label: 'Reading', value: result.reading_band, icon: '📖', color: '#10b981' },
                                { label: 'Writing', value: result.writing_band, icon: '✍️', color: '#f59e0b' },
                                { label: 'Speaking', value: result.speaking_band, icon: '🗣️', color: '#8b5cf6' },
                            ].map((skill, idx) => (
                                <div key={idx} style={{ padding: '16px 20px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <span style={{ fontSize: 20 }}>{skill.icon}</span>
                                        <span style={{ fontWeight: 600, color: '#475569' }}>{skill.label}</span>
                                    </div>
                                    <div style={{ fontSize: 20, fontWeight: 800, color: skill.color }}>
                                        {Number(skill.value) > 0 ? Number(skill.value).toFixed(1) : (skill.label === 'Writing' || skill.label === 'Speaking' ? 'P' : '0.0')}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p style={{ marginTop: 12, fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>* P: Pending (Đang chờ chấm điểm tự luận)</p>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginTop: 32 }}>
                        <button 
                            id="btn-back-to-exams"
                            onClick={() => navigate('/user/exams')}
                            style={{ padding: '12px 24px', borderRadius: 12, background: '#fff', border: '1px solid #cbd5e1', color: '#475569', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontSize: 14 }}
                        >
                            Về danh sách đề
                        </button>
                        <button 
                            id="btn-review-test"
                            onClick={() => navigate(`/user/results/${id}/review`)}
                            style={{ padding: '12px 24px', borderRadius: 12, background: '#10b981', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(16,185,129,0.3)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}
                        >
                            <span>🔍</span> Xem lại bài làm
                        </button>
                        <button 
                            id="btn-back-to-dashboard"
                            onClick={() => navigate('/user/dashboard')}
                            style={{ padding: '12px 24px', borderRadius: 12, background: '#3b82f6', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(59,130,246,0.3)', fontSize: 14 }}
                        >
                            Về trang cá nhân
                        </button>
                    </div>
                </div>

                {/* Footer Message */}
                <div style={{ padding: '24px', textAlign: 'center', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                    <p style={{ margin: 0, fontSize: 14, color: '#64748b' }}>
                        {result.band_score >= 7.0 ? '🌟 Tuyệt vời! Bạn đang ở trình độ rất cao.' : 
                         result.band_score >= 5.0 ? '👍 Khá tốt. Hãy cố gắng luyện tập thêm để bứt phá nhé!' : 
                         '📖 Đừng nản lòng, hãy tập trung cải thiện vốn từ vựng và thử lại.'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResultDetail;
