import { useState, useRef, useEffect } from "react";

const LANGUAGES = [
  { code: "hi", name: "Hindi", flag: "🇮🇳", native: "हिन्दी" },
  { code: "es", name: "Spanish", flag: "🇪🇸", native: "Español" },
  { code: "fr", name: "French", flag: "🇫🇷", native: "Français" },
  { code: "de", name: "German", flag: "🇩🇪", native: "Deutsch" },
  { code: "ja", name: "Japanese", flag: "🇯🇵", native: "日本語" },
  { code: "zh", name: "Chinese", flag: "🇨🇳", native: "中文" },
  { code: "ar", name: "Arabic", flag: "🇸🇦", native: "العربية" },
  { code: "pt", name: "Portuguese", flag: "🇧🇷", native: "Português" },
  { code: "ru", name: "Russian", flag: "🇷🇺", native: "Русский" },
  { code: "ko", name: "Korean", flag: "🇰🇷", native: "한국어" },
  { code: "it", name: "Italian", flag: "🇮🇹", native: "Italiano" },
  { code: "tr", name: "Turkish", flag: "🇹🇷", native: "Türkçe" },
];

const CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノ";

function MatrixRain({ active }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const cols = Math.floor(canvas.width / 14);
    const drops = Array(cols).fill(1);
    const interval = setInterval(() => {
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00ff9d";
      ctx.font = "12px monospace";
      drops.forEach((y, i) => {
        const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillText(ch, i * 14, y * 14);
        if (y * 14 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [active]);
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
      style={{ display: active ? "block" : "none" }}
    />
  );
}

export default function Translator() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const translate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setStreaming(true);
    setError("");
    setOutput("");

    try {
      const response = await fetch("http://localhost:5000/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: input,
          targetLang: selectedLang.name,
          nativeName: selectedLang.native,
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      const translated = data.translation || "";

      let i = 0;
      const reveal = setInterval(() => {
        i += 2;
        setOutput(translated.slice(0, i));
        if (i >= translated.length) {
          setOutput(translated);
          clearInterval(reveal);
          setStreaming(false);
        }
      }, 20);

    } catch (e) {
      console.log("Full error:", e);
      setError(e.message || "Translation failed.");
      setStreaming(false);
    } finally {
      setLoading(false);
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080c10",
        fontFamily: "'Courier New', monospace",
        color: "#e0ffe0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(0,255,100,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,100,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "300px",
          background: "radial-gradient(ellipse, rgba(0,255,120,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ textAlign: "center", marginBottom: "2.5rem", position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "inline-block",
            border: "1px solid rgba(0,255,100,0.3)",
            padding: "4px 16px",
            marginBottom: "12px",
            fontSize: "11px",
            letterSpacing: "4px",
            color: "#00ff9d",
            textTransform: "uppercase",
          }}
        >
          ◈ BABEL MATRIX v2.0 ◈
        </div>
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: "900",
            letterSpacing: "-1px",
            lineHeight: 1,
            background: "linear-gradient(135deg, #00ff9d 0%, #00d4ff 50%, #7b2fff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "8px",
          }}
        >
          TRANSLATE
        </h1>
        <p style={{ color: "#4a7a5a", fontSize: "13px", letterSpacing: "2px" }}>
          ENGLISH → UNIVERSE
        </p>
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "860px",
          background: "rgba(5, 15, 10, 0.85)",
          border: "1px solid rgba(0,255,100,0.15)",
          borderRadius: "4px",
          backdropFilter: "blur(20px)",
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
          boxShadow: "0 0 60px rgba(0,255,100,0.05), inset 0 0 60px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            padding: "1rem 1.5rem",
            borderBottom: "1px solid rgba(0,255,100,0.1)",
            background: "rgba(0,255,100,0.02)",
          }}
        >
          <p style={{ fontSize: "10px", letterSpacing: "3px", color: "#4a7a5a", marginBottom: "10px" }}>
            SELECT TARGET LANGUAGE
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLang(lang)}
                style={{
                  padding: "6px 14px",
                  border: `1px solid ${selectedLang.code === lang.code ? "#00ff9d" : "rgba(0,255,100,0.15)"}`,
                  background: selectedLang.code === lang.code ? "rgba(0,255,100,0.12)" : "rgba(0,255,100,0.03)",
                  color: selectedLang.code === lang.code ? "#00ff9d" : "#4a7a5a",
                  fontSize: "12px",
                  cursor: "pointer",
                  borderRadius: "2px",
                  letterSpacing: "1px",
                  transition: "all 0.2s",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "280px" }}>
          <div style={{ borderRight: "1px solid rgba(0,255,100,0.1)", display: "flex", flexDirection: "column" }}>
            <div
              style={{
                padding: "10px 16px",
                borderBottom: "1px solid rgba(0,255,100,0.08)",
                fontSize: "10px",
                letterSpacing: "3px",
                color: "#4a7a5a",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>ENGLISH INPUT</span>
              <span style={{ color: charCount > 800 ? "#ff4444" : "#4a7a5a" }}>{charCount}/1000</span>
            </div>
            <textarea
              value={input}
              onChange={(e) => {
                if (e.target.value.length <= 1000) {
                  setInput(e.target.value);
                  setCharCount(e.target.value.length);
                }
              }}
              placeholder="Type your English text here..."
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#c8ffd4",
                fontSize: "14px",
                lineHeight: "1.7",
                padding: "16px",
                resize: "none",
                fontFamily: "inherit",
                caretColor: "#00ff9d",
                minHeight: "200px",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.ctrlKey) translate();
              }}
            />
            <div style={{ padding: "10px 16px", borderTop: "1px solid rgba(0,255,100,0.08)" }}>
              <p style={{ fontSize: "10px", color: "#2a4a3a", letterSpacing: "1px" }}>Ctrl + Enter to translate</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
            <MatrixRain active={streaming} />
            <div
              style={{
                padding: "10px 16px",
                borderBottom: "1px solid rgba(0,255,100,0.08)",
                fontSize: "10px",
                letterSpacing: "3px",
                color: "#4a7a5a",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{selectedLang.flag} {selectedLang.name.toUpperCase()} OUTPUT</span>
              {output && (
                <button
                  onClick={copyOutput}
                  style={{
                    background: "none",
                    border: "1px solid rgba(0,255,100,0.2)",
                    color: copied ? "#00ff9d" : "#4a7a5a",
                    cursor: "pointer",
                    fontSize: "10px",
                    padding: "2px 8px",
                    fontFamily: "inherit",
                    letterSpacing: "1px",
                    transition: "all 0.2s",
                  }}
                >
                  {copied ? "✓ COPIED" : "⎘ COPY"}
                </button>
              )}
            </div>
            <div
              style={{
                flex: 1,
                padding: "16px",
                fontSize: "14px",
                lineHeight: "1.7",
                color: output ? "#c8ffd4" : "#2a4a3a",
                position: "relative",
                zIndex: 1,
                overflowY: "auto",
              }}
            >
              {loading && !output ? (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#00ff9d" }}>
                  <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#00ff9d", animation: "pulse 1s infinite" }} />
                  <span style={{ fontSize: "12px", letterSpacing: "2px" }}>TRANSLATING...</span>
                </div>
              ) : output ? (
                <span>
                  {output}
                  {streaming && (
                    <span style={{ display: "inline-block", width: "2px", height: "16px", background: "#00ff9d", marginLeft: "2px", verticalAlign: "middle", animation: "blink 0.7s infinite" }} />
                  )}
                </span>
              ) : (
                "Translation will appear here..."
              )}
            </div>
          </div>
        </div>

        {error && (
          <div style={{ padding: "10px 16px", borderTop: "1px solid rgba(255,50,50,0.2)", background: "rgba(255,0,0,0.05)", color: "#ff6666", fontSize: "12px", letterSpacing: "1px" }}>
            ⚠ {error}
          </div>
        )}

        <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid rgba(0,255,100,0.1)", display: "flex", justifyContent: "center" }}>
          <button
            onClick={translate}
            disabled={loading || !input.trim()}
            style={{
              background: loading ? "rgba(0,255,100,0.05)" : "linear-gradient(135deg, rgba(0,255,100,0.15), rgba(0,212,255,0.1))",
              border: `1px solid ${loading ? "rgba(0,255,100,0.1)" : "#00ff9d"}`,
              color: loading ? "#4a7a5a" : "#00ff9d",
              padding: "12px 60px",
              fontSize: "13px",
              letterSpacing: "4px",
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              transition: "all 0.3s",
              boxShadow: loading ? "none" : "0 0 20px rgba(0,255,100,0.1)",
            }}
          >
            {loading ? "◈ PROCESSING..." : `◈ TRANSLATE TO ${selectedLang.name.toUpperCase()}`}
          </button>
        </div>
      </div>

      <p style={{ marginTop: "1.5rem", fontSize: "10px", letterSpacing: "2px", color: "#2a4a3a", zIndex: 1, position: "relative" }}>
        POWERED BY CLAUDE AI · {LANGUAGES.length} LANGUAGES
      </p>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        textarea::placeholder { color: #2a4a3a; }
        button:hover:not(:disabled) { filter: brightness(1.2); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,255,100,0.2); }
      `}</style>
    </div>
  );
}