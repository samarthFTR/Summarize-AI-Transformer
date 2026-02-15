"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./Hero.module.css";

export default function Hero() {
    const heroRef = useRef(null);

    useEffect(() => {
        const hero = heroRef.current;
        if (!hero) return;
        const handleMouseMove = (e) => {
            const rect = hero.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            hero.style.setProperty("--mouse-x", `${x}%`);
            hero.style.setProperty("--mouse-y", `${y}%`);
        };
        hero.addEventListener("mousemove", handleMouseMove);
        return () => hero.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <section className={styles.hero} ref={heroRef}>
            {/* Animated Background Blobs */}
            <div className={styles.blobContainer}>
                <div className={`${styles.blob} ${styles.blob1}`}></div>
                <div className={`${styles.blob} ${styles.blob2}`}></div>
            </div>

            {/* Grid overlay */}
            <div className={styles.gridOverlay}></div>

            <div className={styles.content}>
                <div className={styles.badge}>
                    <span className={styles.badgeDot}></span>
                    Powered by T5 Transformer
                </div>

                <h1 className={styles.title}>
                    Transform Text Into
                    <br />
                    <span className={styles.titleGradient}>Intelligent Summaries</span>
                </h1>

                <p className={styles.subtitle}>
                    Harness the power of a fine-tuned T5 Transformer model to distill
                    lengthy documents into clear, concise summaries — instantly.
                </p>

                <div className={styles.actions}>
                    <Link href="/summarize" className={styles.primaryBtn}>
                        <span>Start Summarizing</span>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                    <Link href="/#how-it-works" className={styles.secondaryBtn}>
                        <span>See How It Works</span>
                    </Link>
                </div>

                {/* Stats Row */}
                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <span className={styles.statValue}>T5‑Small</span>
                        <span className={styles.statLabel}>Model Architecture</span>
                    </div>
                    <div className={styles.statDivider}></div>
                    <div className={styles.stat}>
                        <span className={styles.statValue}>60M+</span>
                        <span className={styles.statLabel}>Parameters</span>
                    </div>
                    <div className={styles.statDivider}></div>
                    <div className={styles.stat}>
                        <span className={styles.statValue}>ROUGE</span>
                        <span className={styles.statLabel}>Evaluated Quality</span>
                    </div>
                </div>
            </div>

            {/* Floating Code Preview */}
            <div className={styles.codePreview}>
                <div className={styles.codeWindow}>
                    <div className={styles.codeHeader}>
                        <div className={styles.codeDots}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <span className={styles.codeTitle}>predict.py</span>
                    </div>
                    <pre className={styles.codeBody}>
                        <code>
                            <span className={styles.codeKeyword}>from</span> transformers <span className={styles.codeKeyword}>import</span> T5Tokenizer{"\n"}
                            <span className={styles.codeKeyword}>from</span> transformers <span className={styles.codeKeyword}>import</span> T5ForConditionalGeneration{"\n\n"}
                            <span className={styles.codeComment}>{"# Load fine-tuned model"}</span>{"\n"}
                            tokenizer = T5Tokenizer.<span className={styles.codeFunc}>from_pretrained</span>(<span className={styles.codeString}>&quot;models/t5-small&quot;</span>){"\n"}
                            model = T5ForConditionalGeneration.<span className={styles.codeFunc}>from_pretrained</span>(<span className={styles.codeString}>&quot;models/t5-small&quot;</span>){"\n\n"}
                            <span className={styles.codeComment}>{"# Generate summary"}</span>{"\n"}
                            summary = model.<span className={styles.codeFunc}>generate</span>(input_ids, num_beams=<span className={styles.codeNum}>4</span>){"\n"}
                            <span className={styles.codeKeyword}>print</span>(tokenizer.<span className={styles.codeFunc}>decode</span>(summary[<span className={styles.codeNum}>0</span>]))
                        </code>
                    </pre>
                </div>
            </div>
        </section>
    );
}
