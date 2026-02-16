"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import DarkVeil from "./DarkVeil/DarkVeil";
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
            {/* DarkVeil WebGL Background */}
            <div className={styles.darkVeilBg}>
                <DarkVeil
                    hueShift={0}
                    noiseIntensity={0}
                    scanlineIntensity={0}
                    speed={0.5}
                    scanlineFrequency={0}
                    warpAmount={0}
                    resolutionScale={1}
                />
            </div>

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
        </section>
    );
}
