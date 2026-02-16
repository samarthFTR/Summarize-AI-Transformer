"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "./page.module.css";

const Dither = dynamic(() => import("../components/Dither/Dither"), { ssr: false });

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const sampleTexts = [
    {
        label: "Transformers",
        text: "The Transformer is a deep learning model introduced in 2017 by Google researchers in the paper 'Attention is All You Need'. It is primarily used in the field of natural language processing (NLP) and has since become the foundation for many state-of-the-art models. Unlike recurrent neural networks (RNNs), Transformers process the entire input sequence all at once rather than sequentially. This parallelization leads to significantly faster training times and better handling of long-range dependencies. The attention mechanism, specifically the self-attention mechanism, allows the model to weigh the influence of different parts of the input data when producing each part of the output. This has led to breakthroughs in machine translation, text summarization, question answering, and many other NLP tasks.",
    },
    {
        label: "Machine Learning",
        text: "Machine learning is a subset of artificial intelligence that provides systems the ability to automatically learn and improve from experience without being explicitly programmed. Machine learning focuses on the development of computer programs that can access data and use it to learn for themselves. The process of learning begins with observations or data, such as examples, direct experience, or instruction, in order to look for patterns in data and make better decisions in the future based on the examples that we provide. The primary aim is to allow the computers to learn automatically without human intervention or assistance and adjust actions accordingly. Machine learning algorithms are often categorized as supervised, unsupervised, or reinforcement learning.",
    },
    {
        label: "Climate Change",
        text: "Climate change refers to long-term shifts in temperatures and weather patterns. These shifts may be natural, such as through variations in the solar cycle, but since the 1800s, human activities have been the main driver of climate change, primarily due to burning fossil fuels like coal, oil and gas. Burning fossil fuels generates greenhouse gas emissions that act like a blanket wrapped around the Earth, trapping the sun's heat and raising temperatures. Examples of greenhouse gas emissions that are causing climate change include carbon dioxide and methane. These come from using gasoline for driving a car or coal for heating a building, for example. Clearing land and forests can also release carbon dioxide. Landfills for garbage are a major source of methane emissions. Energy, industry, transport, buildings, agriculture and land use are among the main emitters.",
    },
];

export default function SummarizePage() {
    const [inputText, setInputText] = useState("");
    const [summary, setSummary] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [stats, setStats] = useState(null);
    const [maxLength, setMaxLength] = useState(128);
    const [numBeams, setNumBeams] = useState(4);
    const [copied, setCopied] = useState(false);
    const [apiStatus, setApiStatus] = useState("checking");
    const textareaRef = useRef(null);

    useEffect(() => {
        fetch(`${API_BASE}/api/health`)
            .then((res) => res.json())
            .then((data) => {
                setApiStatus(data.model_loaded ? "online" : "no-model");
            })
            .catch(() => setApiStatus("offline"));
    }, []);

    const handleSummarize = async () => {
        if (!inputText.trim() || inputText.trim().length < 10) {
            setError("Please enter at least 10 characters of text.");
            return;
        }

        setIsLoading(true);
        setError("");
        setSummary("");
        setStats(null);

        try {
            const res = await fetch(`${API_BASE}/api/summarize`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: inputText,
                    max_length: maxLength,
                    num_beams: numBeams,
                }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.detail || "Summarization failed.");
            }

            const data = await res.json();
            setSummary(data.summary);
            setStats({
                inputWords: data.input_length,
                outputWords: data.output_length,
                time: data.processing_time,
                compressionRatio: Math.round(
                    (1 - data.output_length / data.input_length) * 100
                ),
            });
        } catch (err) {
            setError(err.message || "Something went wrong. Is the API running?");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(summary);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setInputText("");
        setSummary("");
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
                    waveColor={[0.32, 0.15, 1]}
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
                            ? "Model Ready"
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
                        Text <span className={styles.titleGradient}>Summarizer</span>
                    </h1>
                    <p className={styles.pageSubtitle}>
                        Paste your text below and let the AI generate a concise summary.
                    </p>
                </div>

                {/* Sample Texts */}
                <div className={styles.samples}>
                    <span className={styles.samplesLabel}>Try a sample:</span>
                    {sampleTexts.map((s, i) => (
                        <button
                            key={i}
                            className={styles.sampleBtn}
                            onClick={() => {
                                setInputText(s.text);
                                setSummary("");
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
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                </svg>
                                <span>Input Text</span>
                            </div>
                            <span className={styles.wordCount}>{wordCount} words</span>
                        </div>
                        <textarea
                            ref={textareaRef}
                            className={styles.textarea}
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Paste your article, paragraph, or any text here..."
                            rows={12}
                        ></textarea>
                    </div>

                    {/* Output Panel */}
                    <div className={styles.panel}>
                        <div className={styles.panelHeader}>
                            <div className={styles.panelTitle}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span>Summary</span>
                            </div>
                            {summary && (
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
                                    <span>Generating summary...</span>
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
                            ) : summary ? (
                                <p className={styles.summaryText}>{summary}</p>
                            ) : (
                                <div className={styles.emptyState}>
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.2 }}>
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                        <line x1="16" y1="13" x2="8" y2="13" />
                                        <line x1="16" y1="17" x2="8" y2="17" />
                                    </svg>
                                    <span>Your summary will appear here</span>
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
                                min="30"
                                max="256"
                                value={maxLength}
                                onChange={(e) => setMaxLength(Number(e.target.value))}
                                className={styles.slider}
                            />
                            <span className={styles.settingValue}>{maxLength}</span>
                        </div>
                        <div className={styles.settingItem}>
                            <label className={styles.settingLabel}>Beams</label>
                            <input
                                type="range"
                                min="1"
                                max="8"
                                value={numBeams}
                                onChange={(e) => setNumBeams(Number(e.target.value))}
                                className={styles.slider}
                            />
                            <span className={styles.settingValue}>{numBeams}</span>
                        </div>
                    </div>

                    <div className={styles.actionBtns}>
                        <button className={styles.clearBtn} onClick={handleClear}>
                            Clear All
                        </button>
                        <button
                            className={styles.summarizeBtn}
                            onClick={handleSummarize}
                            disabled={isLoading || !inputText.trim()}
                        >
                            {isLoading ? (
                                <>
                                    <span className={styles.btnSpinner}></span>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                    </svg>
                                    Summarize
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
                                {stats.compressionRatio}%
                            </span>
                            <span className={styles.statCardLabel}>Compression</span>
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
