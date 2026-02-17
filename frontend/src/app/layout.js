import "./globals.css";

export const metadata = {
  title: "Summarize AI — Intelligent Summarization & Text Generation",
  description:
    "Summarize text with T5 and generate full articles from summaries with GPT-2. Dual Transformer AI models for complete text intelligence.",
  keywords: ["AI", "Summarization", "Text Generation", "Transformer", "T5", "GPT-2", "NLP", "Machine Learning"],
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
