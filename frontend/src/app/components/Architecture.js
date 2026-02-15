"use client";
import styles from "./Architecture.module.css";

const layers = [
    {
        label: "Frontend",
        tech: "Next.js",
        items: ["Landing Page", "Summarizer UI", "Real-time Results"],
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
        ),
    },
    {
        label: "API Layer",
        tech: "FastAPI",
        items: ["/api/summarize", "/api/health", "CORS Middleware"],
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
        ),
    },
    {
        label: "ML Engine",
        tech: "HuggingFace",
        items: ["T5Tokenizer", "T5ForConditionalGeneration", "Beam Search"],
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a4 4 0 0 1 4 4v1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2V6a4 4 0 0 1 4-4z" />
                <path d="M9 14v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-4" />
            </svg>
        ),
    },
    {
        label: "Training",
        tech: "PyTorch",
        items: ["Seq2SeqTrainer", "ROUGE Evaluation", "Model Checkpoints"],
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
            </svg>
        ),
    },
];

const techStack = [
    { name: "Python 3.8+", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a8 8 0 0 1 0 20 8 8 0 0 1 0-20" strokeDasharray="4 2" /></svg> },
    { name: "PyTorch", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 2v4" /><path d="M12 18v4" /><path d="M4.93 4.93l2.83 2.83" /><path d="M16.24 16.24l2.83 2.83" /><path d="M2 12h4" /><path d="M18 12h4" /></svg> },
    { name: "Transformers", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 9h6" /><path d="M9 13h6" /><path d="M9 17h4" /></svg> },
    { name: "FastAPI", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg> },
    { name: "Next.js", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 15V9l7.745 10.65A9 9 0 1 1 19 17.657" /><path d="M15 2.4A9 9 0 0 1 21 12h-6" /></svg> },
    { name: "T5-Small", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 1 4 4v1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2V6a4 4 0 0 1 4-4z" /><path d="M9 14v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-4" /></svg> },
];

export default function Architecture() {
    return (
        <section className={styles.section} id="architecture">
            <div className={styles.container}>
                <div className={styles.header}>
                    <span className={styles.tag}>System Design</span>
                    <h2 className={styles.title}>
                        Project <span className={styles.accent}>Architecture</span>
                    </h2>
                    <p className={styles.subtitle}>
                        A clean, layered architecture — from the browser to the model.
                    </p>
                </div>

                <div className={styles.stack}>
                    {layers.map((layer, index) => (
                        <div key={index} className={styles.layer}>
                            <div className={styles.layerHeader}>
                                <div className={styles.layerLeft}>
                                    <span className={styles.layerIcon}>{layer.icon}</span>
                                    <span className={styles.layerLabel}>{layer.label}</span>
                                </div>
                                <span className={styles.layerTech}>{layer.tech}</span>
                            </div>
                            <div className={styles.layerItems}>
                                {layer.items.map((item, i) => (
                                    <span key={i} className={styles.item}>
                                        {item}
                                    </span>
                                ))}
                            </div>
                            {index < layers.length - 1 && (
                                <div className={styles.arrow}>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M10 4v12M6 12l4 4 4-4" stroke="var(--color-text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Tech Stack */}
                <div className={styles.techStack}>
                    <h3 className={styles.techTitle}>Technology Stack</h3>
                    <div className={styles.techGrid}>
                        {techStack.map((tech, i) => (
                            <div key={i} className={styles.techItem}>
                                <span className={styles.techIcon}>{tech.icon}</span>
                                <span className={styles.techName}>{tech.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
