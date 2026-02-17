"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "./page.module.css";

const Dither = dynamic(() => import("../components/Dither/Dither"), { ssr: false });

const API_BASE = process.env.NEXT_PUBLIC_GENERATOR_API_URL || "http://localhost:8001";

const samplePrompts = [
    {
        label: "Health Study",
        text: "A new study has found that regular exercise can significantly reduce the risk of heart disease in middle-aged adults.",
    },
    {
        label: "Tech Innovation",
        text: "Researchers have developed a new type of battery that can charge in under five minutes and last for several days.",
    },
    {
        label: "Space Discovery",
        text: "NASA has confirmed the discovery of water ice on the surface of Mars, raising hopes for future human colonization.",
    },
];

export default function GeneratePage() {
    const [inputText, setInputText] = useState("");
    const [generatedText, setGeneratedText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [stats, setStats] = useState(null);
    const [maxLength, setMaxLength] = useState(200);
    const [temperature, setTemperature] = useState(0.7);
    const [topK, setTopK] = useState(40);
    const [copied, setCopied] = useState(false);
    const [apiStatus, setApiStatus] = useState("checking");
    const textareaRef = useRef(null);

    useEffect(() => {
        fetch(`${API_BASE}/api/generate/health`)
            .then((res) => res.json())
            .then((data) => {
                setApiStatus(data.model_loaded ? "online" : "no-model");
            })
            .catch(() => setApiStatus("offline"));
    }, []);

    const handleGenerate = async () => {
        if (!inputText.trim() || inputText.trim().length < 5) {
            setError("Please enter at least 5 characters of text.");
            return;
        }

        setIsLoading(true);
        setError("");
        setGeneratedText("");
        setStats(null);

        try {
            const res = await fetch(`${API_BASE}/api/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    summary: inputText,
                    max_length: maxLength,
                    temperature: temperature,
                    top_k: topK,
                }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.detail || "Text generation failed.");
            }

            const data = await res.json();
            setGeneratedText(data.generated_text);
            setStats({
                inputWords: data.input_length,
                outputWords: data.output_length,
                time: data.processing_time,
                expansionRatio: data.output_length > 0 && data.input_length > 0
                    ? Math.round((data.output_length / data.input_length) * 100) / 100
                    : 0,
            });
        } catch (err) {
            setError(err.message || "Something went wrong. Is the API running?");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setInputText("");
        setGeneratedText("");
        setError("");
        setStats(null);
        textareaRef.current?.focus();
    };

    const wordCount = inputText.trim()
        ? inputText.trim().split(/\s+/).length
        : 0;

    return (
        <div className={styles.page}>
            {/* Dither WebGL Background */}
            <div className={styles.ditherBg}>
                <Dither
                    waveColor={[0.15, 0.32, 1]}
                    disableAnimation={false}
                    enableMouseInteraction
                    mouseRadius={1}
                    colorNum={4}
                    pixelSize={2}
                    waveAmplitude={0.3}
                    waveFrequency={3}
                    waveSpeed={0.05}
                />
            </div>

            {/* Header */}
            <header className={styles.header}>
                <Link href="/" className={styles.logo}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    Summarize<span className={styles.logoAccent}>AI</span>
                </Link>

                <div className={styles.headerRight}>
                    <div
                        className={`${styles.statusBadge} ${apiStatus === "online"
                            ? styles.online
                            : apiStatus === "offline"
                                ? styles.offline
                                : styles.checking
                            }`}
                    >
                        <span className={styles.statusDot}></span>
                        {apiStatus === "online"
                            ? "GPT-2 Ready"
                            : apiStatus === "offline"
                                ? "API Offline"
                                : apiStatus === "no-model"
                                    ? "No Model"
                                    : "Checking..."}
                    </div>
                    <Link href="/" className={styles.backLink}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className={styles.main}>
                <div className={styles.titleBlock}>
                    <h1 className={styles.pageTitle}>
                        Text <span className={styles.titleGradient}>Generator</span>
                    </h1>
                    <p className={styles.pageSubtitle}>
                        Enter a brief summary and let GPT-2 expand it into a full-length article.
                    </p>
                </div>

                {/* Sample Prompts */}
                <div className={styles.samples}>
                    <span className={styles.samplesLabel}>Try a sample:</span>
                    {samplePrompts.map((s, i) => (
                        <button
                            key={i}
                            className={styles.sampleBtn}
                            onClick={() => {
                                setInputText(s.text);
                                setGeneratedText("");
                                setError("");
                                setStats(null);
                            }}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>

                {/* Panels */}
                <div className={styles.panels}>
                    {/* Input Panel */}
                    <div className={styles.panel}>
                        <div className={styles.panelHeader}>
                            <div className={styles.panelTitle}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                                <span>Summary Prompt</span>
                            </div>
                            <span className={styles.wordCount}>{wordCount} words</span>
                        </div>
                        <textarea
                            ref={textareaRef}
                            className={styles.textarea}
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Enter a brief summary or headline to expand into a full article..."
                            rows={12}
                        ></textarea>
                    </div>

                    {/* Output Panel */}
                    <div className={styles.panel}>
                        <div className={styles.panelHeader}>
                            <div className={styles.panelTitle}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                </svg>
                                <span>Generated Text</span>
                            </div>
                            {generatedText && (
                                <button className={styles.copyBtn} onClick={handleCopy}>
                                    {copied ? (
                                        <>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                                            Copy
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                        <div className={styles.outputArea}>
                            {isLoading ? (
                                <div className={styles.loadingState}>
                                    <div className={styles.spinner}></div>
                                    <span>Generating text...</span>
                                </div>
                            ) : error ? (
                                <div className={styles.errorState}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                    <span>{error}</span>
                                </div>
                            ) : generatedText ? (
                                <p className={styles.generatedText}>{generatedText}</p>
                            ) : (
                                <div className={styles.emptyState}>
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.2 }}>
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                    </svg>
                                    <span>Your generated article will appear here</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Controls Row */}
                <div className={styles.controls}>
                    <div className={styles.settings}>
                        <div className={styles.settingItem}>
                            <label className={styles.settingLabel}>Max Length</label>
                            <input
                                type="range"
                                min="50"
                                max="512"
                                value={maxLength}
                                onChange={(e) => setMaxLength(Number(e.target.value))}
                                className={styles.slider}
                            />
                            <span className={styles.settingValue}>{maxLength}</span>
                        </div>
                        <div className={styles.settingItem}>
                            <label className={styles.settingLabel}>Temperature</label>
                            <input
                                type="range"
                                min="1"
                                max="20"
                                value={Math.round(temperature * 10)}
                                onChange={(e) => setTemperature(Number(e.target.value) / 10)}
                                className={styles.slider}
                            />
                            <span className={styles.settingValue}>{temperature.toFixed(1)}</span>
                        </div>
                        <div className={styles.settingItem}>
                            <label className={styles.settingLabel}>Top-K</label>
                            <input
                                type="range"
                                min="1"
                                max="100"
                                value={topK}
                                onChange={(e) => setTopK(Number(e.target.value))}
                                className={styles.slider}
                            />
                            <span className={styles.settingValue}>{topK}</span>
                        </div>
                    </div>

                    <div className={styles.actionBtns}>
                        <button className={styles.clearBtn} onClick={handleClear}>
                            Clear All
                        </button>
                        <button
                            className={styles.generateBtn}
                            onClick={handleGenerate}
                            disabled={isLoading || !inputText.trim()}
                        >
                            {isLoading ? (
                                <>
                                    <span className={styles.btnSpinner}></span>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                    </svg>
                                    Generate
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className={styles.statsRow}>
                        <div className={styles.statCard}>
                            <span className={styles.statCardValue}>{stats.inputWords}</span>
                            <span className={styles.statCardLabel}>Input Words</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statCardValue}>{stats.outputWords}</span>
                            <span className={styles.statCardLabel}>Output Words</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statCardValue}>
                                {stats.expansionRatio}x
                            </span>
                            <span className={styles.statCardLabel}>Expansion</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statCardValue}>{stats.time}s</span>
                            <span className={styles.statCardLabel}>Processing Time</span>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
