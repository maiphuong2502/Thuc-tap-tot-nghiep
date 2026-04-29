import React, { useRef, useState, useEffect } from "react";

interface MockAudioPlayerProps {
    src: string;
    title: string;
}

const MockAudioPlayer: React.FC<MockAudioPlayerProps> = ({ src, title }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isEnded, setIsEnded] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [lastValidTime, setLastValidTime] = useState(0);

    const togglePlay = () => {
        if (isEnded) return;
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            
            // Ngăn chặn việc tua: Nếu thời gian nhảy vọt quá 2 giây (trừ khi đang phát bình thường)
            if (current > lastValidTime + 2 || current < lastValidTime - 2) {
                audioRef.current.currentTime = lastValidTime;
            } else {
                setCurrentTime(current);
                setLastValidTime(current);
            }
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleEnded = () => {
        setIsPlaying(false);
        setIsEnded(true);
    };

    const formatTime = (time: number) => {
        const m = Math.floor(time / 60);
        const s = Math.floor(time % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#2563eb", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#64748b" }}>🎧</span> {title}
            </div>
            
            <div style={{ 
                background: "#f1f3f4", 
                borderRadius: "30px", 
                padding: "8px 16px", 
                display: "flex", 
                alignItems: "center", 
                gap: 12,
                width: "100%",
                maxWidth: 500,
                userSelect: "none"
            }}>
                {/* Play Button */}
                <button 
                    onClick={togglePlay}
                    disabled={isEnded}
                    style={{ 
                        background: "none", border: "none", cursor: isEnded ? "not-allowed" : "pointer",
                        fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#000", padding: 0
                    }}
                >
                    {isPlaying ? "⏸" : "▶"}
                </button>

                {/* Time Display */}
                <div style={{ fontSize: 13, color: "#3c4043", minWidth: 70, textAlign: "center" }}>
                    {formatTime(currentTime)} / {formatTime(duration)}
                </div>

                {/* Progress Bar Container */}
                <div style={{ 
                    flex: 1, height: 4, background: "#dadce0", borderRadius: 2, position: "relative",
                    cursor: "default" 
                }}>
                    {/* Played Progress */}
                    <div style={{ 
                        position: "absolute", left: 0, top: 0, height: "100%", 
                        background: "#3c4043", 
                        width: `${(currentTime / duration) * 100}%`
                    }} />
                    
                    {/* Progress Knob (Visual only) */}
                    <div style={{
                        position: "absolute",
                        left: `${(currentTime / duration) * 100}%`,
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 12,
                        height: 12,
                        background: "#3c4043",
                        borderRadius: "50%"
                    }} />
                </div>

                {/* Icons */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#3c4043" }}>
                    <span style={{ fontSize: 18 }}>🔊</span>
                    <span style={{ fontSize: 20, fontWeight: "bold", cursor: "default" }}>⋮</span>
                </div>

                <audio 
                    ref={audioRef}
                    src={src}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={handleEnded}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                />
            </div>
            
            {isEnded && (
                <div style={{ marginTop: 6, fontSize: 12, color: "#d93025", fontWeight: 500 }}>
                    ⚠️ Bạn đã nghe xong phần này.
                </div>
            )}
        </div>
    );
};

export default MockAudioPlayer;
