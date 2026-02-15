import styles from "./Footer.module.css";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.top}>
                    <div className={styles.brand}>
                        <span className={styles.logo}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }}>
                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                            </svg>
                            Summarize<span className={styles.logoAccent}>AI</span>
                        </span>
                        <p className={styles.brandDesc}>
                            Intelligent text summarization powered by fine-tuned Transformer models.
                        </p>
                    </div>

                    <div className={styles.linksGroup}>
                        <h4 className={styles.linksTitle}>Product</h4>
                        <Link href="/summarize" className={styles.footerLink}>Summarizer</Link>
                        <Link href="/#features" className={styles.footerLink}>Features</Link>
                        <Link href="/#how-it-works" className={styles.footerLink}>How It Works</Link>
                    </div>

                    <div className={styles.linksGroup}>
                        <h4 className={styles.linksTitle}>Stack</h4>
                        <span className={styles.footerLink}>T5 Transformer</span>
                        <span className={styles.footerLink}>FastAPI</span>
                        <span className={styles.footerLink}>Next.js</span>
                    </div>

                    <div className={styles.linksGroup}>
                        <h4 className={styles.linksTitle}>Resources</h4>
                        <a href="https://github.com/samarthFTR/Summarize-AI-Transformer" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>GitHub</a>
                        <Link href="/#architecture" className={styles.footerLink}>Architecture</Link>
                        <span className={styles.footerLink}>API Docs</span>
                    </div>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.bottom}>
                    <p className={styles.copyright}>
                        &copy; {new Date().getFullYear()} Summarize AI. All rights reserved.
                    </p>
                    <p className={styles.tech}>
                        T5-Small &middot; PyTorch &middot; HuggingFace
                    </p>
                </div>
            </div>
        </footer>
    );
}
