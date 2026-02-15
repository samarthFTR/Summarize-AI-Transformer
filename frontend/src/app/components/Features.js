"use client";
import styles from "./Features.module.css";

const features = [
    {
        title: "T5 Transformer",
        description:
            "Built on Google's Text-to-Text Transfer Transformer architecture — one of the most versatile models in NLP.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a4 4 0 0 1 4 4v1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2V6a4 4 0 0 1 4-4z" />
                <path d="M9 14v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-4" />
                <circle cx="9" cy="9" r="1" fill="currentColor" stroke="none" />
                <circle cx="15" cy="9" r="1" fill="currentColor" stroke="none" />
            </svg>
        ),
    },
    {
        title: "Real-Time Inference",
        description:
            "Get concise summaries in seconds. Optimized beam search with configurable parameters for quality results.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
        ),
    },
    {
        title: "ROUGE Evaluation",
        description:
            "Quality validated with ROUGE-1, ROUGE-2, and ROUGE-L metrics ensuring reliable summarization performance.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="M7 17l4-8 4 4 5-10" />
            </svg>
        ),
    },
    {
        title: "Fine-Tuned Precision",
        description:
            "Custom fine-tuned on the Amazon Fine Food Reviews dataset for domain-specific accuracy and fluency.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
            </svg>
        ),
    },
    {
        title: "Modular Pipeline",
        description:
            "Clean, modular codebase with separate modules for data loading, preprocessing, training, and inference.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
        ),
    },
    {
        title: "Production Ready",
        description:
            "FastAPI backend with RESTful endpoints, CORS support, and automatic model loading at startup.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
        ),
    },
];

export default function Features() {
    return (
        <section className={styles.features} id="features">
            <div className={styles.container}>
                <div className={styles.header}>
                    <span className={styles.tag}>Core Capabilities</span>
                    <h2 className={styles.title}>
                        Everything You Need for
                        <br />
                        <span className={styles.titleAccent}>Intelligent Summarization</span>
                    </h2>
                    <p className={styles.subtitle}>
                        A complete ML pipeline from training to deployment, powered by
                        state-of-the-art Transformer architecture.
                    </p>
                </div>

                <div className={styles.grid}>
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={styles.card}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className={styles.cardLine}></div>
                            <div className={styles.iconWrap}>{feature.icon}</div>
                            <h3 className={styles.cardTitle}>{feature.title}</h3>
                            <p className={styles.cardDesc}>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
