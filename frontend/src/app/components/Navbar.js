"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
            <div className={styles.inner}>
                <Link href="/" className={styles.logo}>
                    <svg className={styles.logoIcon} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    <span className={styles.logoText}>
                        Summarize<span className={styles.logoAccent}>AI</span>
                    </span>
                </Link>

                <div className={`${styles.links} ${menuOpen ? styles.open : ""}`}>
                    <Link href="/#features" className={styles.link} onClick={() => setMenuOpen(false)}>
                        Features
                    </Link>
                    <Link href="/#how-it-works" className={styles.link} onClick={() => setMenuOpen(false)}>
                        How It Works
                    </Link>
                    <Link href="/#architecture" className={styles.link} onClick={() => setMenuOpen(false)}>
                        Architecture
                    </Link>
                    <Link href="/summarize" className={styles.ctaLink} onClick={() => setMenuOpen(false)}>
                        <span>Summarizer</span>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                    <Link href="/generate" className={styles.ctaLink} onClick={() => setMenuOpen(false)}>
                        <span>Generator</span>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                </div>

                <button
                    className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ""}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </nav>
    );
}
