"use client";
import styles from "./HowItWorks.module.css";

const steps = [
    {
        number: "01",
        title: "Input Text",
        description:
            "Paste any paragraph, article, or document. The system accepts text up to 512 tokens with automatic truncation for longer inputs.",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
            </svg>
        ),
    },
    {
        number: "02",
        title: "Tokenization & Encoding",
        description:
            'The T5 tokenizer converts your text into numerical tokens with the "summarize:" prefix, preparing it for the model.',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
                <line x1="14" y1="4" x2="10" y2="20" />
            </svg>
        ),
    },
    {
        number: "03",
        title: "Transformer Inference",
        description:
            "The fine-tuned T5 model processes the encoded input through its encoder-decoder architecture with beam search (k=4).",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
        ),
    },
    {
        number: "04",
        title: "Decoded Summary",
        description:
            "The generated token IDs are decoded back into natural language, producing a concise and coherent summary.",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
            </svg>
        ),
    },
];

export default function HowItWorks() {
    return (
        <section className={styles.section} id="how-it-works">
            <div className={styles.container}>
                <div className={styles.header}>
                    <span className={styles.tag}>Pipeline</span>
                    <h2 className={styles.title}>
                        How It <span className={styles.accent}>Works</span>
                    </h2>
                    <p className={styles.subtitle}>
                        From raw text to intelligent summary in four simple steps.
                    </p>
                </div>

                <div className={styles.timeline}>
                    {steps.map((step, index) => (
                        <div key={index} className={styles.step}>
                            <div className={styles.stepLeft}>
                                <div className={styles.numberCircle}>
                                    <span className={styles.number}>{step.number}</span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={styles.connector}></div>
                                )}
                            </div>
                            <div className={styles.stepContent}>
                                <div className={styles.visual}>{step.icon}</div>
                                <h3 className={styles.stepTitle}>{step.title}</h3>
                                <p className={styles.stepDesc}>{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
