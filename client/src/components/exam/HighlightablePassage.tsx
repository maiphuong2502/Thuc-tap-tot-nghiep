import React, { useRef, useState, useEffect } from 'react';

interface HighlightablePassageProps {
    content: string;
    autoHighlight?: boolean;
    autoTranslate?: boolean;
}

const HighlightablePassage: React.FC<HighlightablePassageProps> = ({ content, autoHighlight, autoTranslate }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [htmlContent, setHtmlContent] = useState(content);
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    
    // Translation state
    const [selectedWord, setSelectedWord] = useState("");
    const [translation, setTranslation] = useState<{ word: string, result: string } | null>(null);
    const [isTranslating, setIsTranslating] = useState(false);

    // Sync with prop when content changes (e.g. switching parts)
    useEffect(() => {
        setHtmlContent(content);
        setTranslation(null);
    }, [content]);

    const handleContextMenu = (e: React.MouseEvent) => {
        const selection = window.getSelection();
        const text = (selection?.toString() || "").trim();
        if (text.length > 0) {
            e.preventDefault();
            setMenuPosition({ x: e.pageX, y: e.pageY });
            setMenuVisible(true);
            setTranslation(null); 
            setSelectedWord(text);
        } else {
            setMenuVisible(false);
        }
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        const selection = window.getSelection();
        const selectedText = (selection?.toString() || "").trim();

        if (selectedText.length > 0) {
            let shouldShowMenu = false;

            if (autoTranslate) {
                // Check if it's 1 word (after cleaning punctuation)
                const cleaned = selectedText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").trim();
                if (cleaned && !cleaned.includes(" ") && !cleaned.includes("\n")) {
                    setMenuPosition({ x: e.pageX, y: e.pageY });
                    setMenuVisible(true);
                    setSelectedWord(cleaned);
                    fetchTranslation(cleaned);
                    shouldShowMenu = true;
                }
            }
            
            if (autoHighlight) {
                // Apply highlight directly
                document.execCommand('hiliteColor', false, 'yellow');
                if (containerRef.current) {
                    setHtmlContent(containerRef.current.innerHTML);
                }
                
                // If we're not translating, we can clear the selection and hide menu
                if (!shouldShowMenu) {
                    setMenuVisible(false);
                    window.getSelection()?.removeAllRanges();
                }
            }
        }

        if (!selectedText || selectedText.length === 0) {
            if (!translation) setMenuVisible(false);
        }
    };

    const fetchTranslation = async (wordToTranslate?: string) => {
        // Use provided word, or the one stored in state, or the current selection
        let word = wordToTranslate || selectedWord || (window.getSelection()?.toString() || "").trim();
        
        // Final cleaning
        word = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").trim();

        if (!word) return;

        // Validation: Only one word (no spaces inside)
        if (word.includes(" ") || word.includes("\n")) {
            alert("Vui lòng chỉ chọn 1 từ để dịch.");
            return;
        }

        setIsTranslating(true);
        try {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURIComponent(word)}`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data && data[0] && data[0][0] && data[0][0][0]) {
                setTranslation({
                    word: word,
                    result: data[0][0][0]
                });
            } else {
                setTranslation({ word, result: "Không tìm thấy nghĩa." });
            }
        } catch (error) {
            console.error("Translation error:", error);
            setTranslation({ word, result: "Lỗi kết nối dịch thuật." });
        } finally {
            setIsTranslating(false);
        }
    };

    const applyHighlight = () => {
        document.execCommand('hiliteColor', false, 'yellow');
        setMenuVisible(false);
        
        // Persist the changes to local state
        if (containerRef.current) {
            setHtmlContent(containerRef.current.innerHTML);
        }

        if (autoHighlight) {
             window.getSelection()?.removeAllRanges();
        }
    };

    const clearHighlight = () => {
        document.execCommand('removeFormat', false, undefined);
        setMenuVisible(false);

        // Persist the changes to local state
        if (containerRef.current) {
            setHtmlContent(containerRef.current.innerHTML);
        }

        window.getSelection()?.removeAllRanges();
    };

    // Close menu on click elsewhere
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setMenuVisible(false);
            }
        };
        window.addEventListener('mousedown', handleClick); // Use mousedown for faster/more reliable outside click detection
        return () => window.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <div style={{ position: 'relative' }}>
            <div
                ref={containerRef}
                contentEditable={true}
                suppressContentEditableWarning={true}
                onContextMenu={handleContextMenu}
                onMouseUp={handleMouseUp}
                onKeyDown={(e) => {
                    // Prevent any typing/editing
                    if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                    }
                    // Allow Ctrl+C
                    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
                        return;
                    }
                    e.preventDefault();
                }}
                style={{
                    fontSize: 15,
                    lineHeight: 1.8,
                    color: "#334155",
                    textAlign: "justify",
                    whiteSpace: "pre-wrap",
                    outline: 'none',
                    userSelect: 'text',
                }}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {menuVisible && (
                <div
                    style={{
                        position: 'absolute',
                        top: menuPosition.y - (containerRef.current?.getBoundingClientRect().top || 0) - window.scrollY,
                        left: menuPosition.x - (containerRef.current?.getBoundingClientRect().left || 0) - window.scrollX,
                        background: '#fff',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        borderRadius: 8,
                        zIndex: 1000,
                        overflow: 'hidden',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 160
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {!translation && (
                        <>
                            <button
                                onClick={fetchTranslation}
                                disabled={isTranslating}
                                style={{
                                    padding: '10px 16px', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer',
                                    fontSize: 14, fontWeight: 600, color: '#3b82f6', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.2s'
                                }}
                                onMouseOver={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                                onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                            >
                                <span>🌐</span>
                                {isTranslating ? "Translating..." : "Translate Word"}
                            </button>
                            <button
                                onClick={applyHighlight}
                                style={{
                                    padding: '10px 16px', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer',
                                    fontSize: 14, fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.2s',
                                    borderTop: '1px solid #f1f5f9'
                                }}
                                onMouseOver={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                                onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                            >
                                <span style={{ width: 14, height: 14, background: 'yellow', border: '1px solid #e2e8f0', borderRadius: 2 }}></span>
                                Highlight
                            </button>
                            <button
                                onClick={clearHighlight}
                                style={{
                                    padding: '10px 16px', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer',
                                    fontSize: 14, fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.2s',
                                    borderTop: '1px solid #f1f5f9'
                                }}
                                onMouseOver={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                                onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                            >
                                <span>✕</span>
                                Clear
                            </button>
                        </>
                    )}

                    {translation && (
                        <div style={{ padding: '12px 16px', maxWidth: 220 }}>
                            <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>Translation</div>
                            <div style={{ fontSize: 16, fontWeight: 800, color: '#1e293b', marginBottom: 2 }}>{translation.word}</div>
                            <div style={{ fontSize: 15, color: '#3b82f6', fontWeight: 600, lineHeight: 1.4 }}>{translation.result}</div>
                            <button 
                                onClick={() => setMenuVisible(false)}
                                style={{ marginTop: 12, width: '100%', padding: '6px', fontSize: 12, background: '#f1f5f9', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
            )}
            
            <style>{`
                [contenteditable] mark {
                    background-color: yellow;
                    color: inherit;
                }
            `}</style>
        </div>
    );
};

export default HighlightablePassage;
