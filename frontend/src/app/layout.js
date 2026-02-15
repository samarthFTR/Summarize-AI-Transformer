import "./globals.css";

export const metadata = {
  title: "Summarize AI — Intelligent Text Summarization",
  description:
    "Transform lengthy text into concise, meaningful summaries using a fine-tuned T5 Transformer model. Powered by state-of-the-art NLP.",
  keywords: ["AI", "Summarization", "Transformer", "T5", "NLP", "Machine Learning"],
  authors: [{ name: "Summarize AI Team" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-noise">{children}</body>
    </html>
  );
}
