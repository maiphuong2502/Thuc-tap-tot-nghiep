import React, { useState, useRef, useEffect } from "react";
import axiosClient from "../../api/axiosClient";

interface VoiceRecorderProps {
    onUploadSuccess: (url: string) => void;
    initialAudioUrl?: string;
    hidePlayer?: boolean;
    readOnly?: boolean;
}

export default function VoiceRecorder({ onUploadSuccess, initialAudioUrl, hidePlayer = false, readOnly = false }: VoiceRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(initialAudioUrl || null);
    const [recordingTime, setRecordingTime] = useState(0);
    
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<any>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(audioBlob);
                setAudioUrl(url);
                
                // Tự động upload ngay sau khi dừng
                await uploadAudio(audioBlob);
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Không thể truy cập Microphone. Vui lòng kiểm tra quyền trình duyệt.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
            
            // Tắt các track để giải phóng micro
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const uploadAudio = async (blob: Blob) => {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("audio", blob, "recording.webm");

        try {
            const response: any = await axiosClient.post("/speaking/upload-audio", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            
            if (response.file_path) {
                onUploadSuccess(response.file_path);
            }
        } catch (err) {
            console.error("Upload error:", err);
            alert("Lỗi khi tải tệp ghi âm lên server.");
        } finally {
            setIsUploading(false);
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div style={{ 
            background: "#fff", padding: 24, borderRadius: 16, border: "2px solid #e2e8f0",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 20
        }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1e293b" }}>
                Ghi âm câu trả lời của bạn
            </div>

            {isRecording && (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="pulse-red" style={{ 
                        width: 12, height: 12, borderRadius: "50%", background: "#ef4444" 
                    }} />
                    <span style={{ fontSize: 24, fontWeight: 800, fontFamily: "monospace" }}>
                        {formatTime(recordingTime)}
                    </span>
                </div>
            )}

            <div style={{ display: "flex", gap: 16 }}>
                {!isRecording ? (
                    <button 
                        onClick={startRecording}
                        disabled={isUploading || (readOnly && !!audioUrl)}
                        style={{
                            background: (readOnly && !!audioUrl) ? "#94a3b8" : "#3b82f6", 
                            color: "#fff", border: "none",
                            padding: "12px 24px", borderRadius: 50, fontWeight: 700,
                            cursor: (readOnly && !!audioUrl) ? "not-allowed" : "pointer", 
                            display: "flex", alignItems: "center", gap: 8
                        }}
                    >
                        <span>🎤</span> 
                        {(readOnly && !!audioUrl) ? "Chỉ được ghi âm 1 lần" : (audioUrl ? "Ghi âm lại" : "Bắt đầu ghi âm")}
                    </button>
                ) : (
                    <button 
                        onClick={stopRecording}
                        style={{
                            background: "#ef4444", color: "#fff", border: "none",
                            padding: "12px 24px", borderRadius: 50, fontWeight: 700,
                            cursor: "pointer", display: "flex", alignItems: "center", gap: 8
                        }}
                    >
                        <span>⏹️</span> Dừng ghi âm
                    </button>
                )}
            </div>

            {audioUrl && !isRecording && (
                <div style={{ width: "100%", marginTop: 10 }}>
                    {isUploading ? (
                        <div style={{ fontSize: 13, color: "#64748b", textAlign: "center" }}>
                            🚀 Đang tải lên server...
                        </div>
                    ) : (
                        !hidePlayer && (
                            <>
                                <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8, textAlign: "center" }}>
                                    ✅ Đã ghi âm xong. Bạn có thể nghe lại bên dưới:
                                </div>
                                <audio src={audioUrl} controls style={{ width: "100%" }} />
                            </>
                        )
                    )}
                </div>
            )}

            <style>{`
                .pulse-red {
                    animation: pulse 1.5s infinite;
                }
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.3); opacity: 0.5; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
