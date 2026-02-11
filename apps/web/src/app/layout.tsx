import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PathForge — AI-Powered Career Intelligence",
    template: "%s | PathForge",
  },
  description:
    "Career Intelligence Platform with Career DNA™ technology. " +
    "Semantic job matching, CV tailoring, skill gap analysis, and career threat detection.",
  keywords: [
    "career intelligence",
    "job matching",
    "AI resume",
    "skill gap analysis",
    "career DNA",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
