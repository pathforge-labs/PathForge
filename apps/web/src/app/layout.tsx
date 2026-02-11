import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "PathForge — AI-Powered Career Intelligence",
    template: "%s | PathForge",
  },
  description:
    "Career Intelligence Platform with Career DNA™ technology. " +
    "Semantic job matching, CV tailoring, skill gap analysis, and career threat detection. " +
    "Built in the EU, GDPR-native.",
  keywords: [
    "career intelligence",
    "career DNA",
    "AI job matching",
    "semantic resume",
    "skill gap analysis",
    "career threat detection",
    "salary intelligence",
    "career simulation",
    "GDPR career tool",
    "EU career platform",
  ],
  authors: [{ name: "BesyncLabs", url: "https://pathforge.eu" }],
  creator: "PathForge by BesyncLabs",
  metadataBase: new URL("https://pathforge.eu"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pathforge.eu",
    siteName: "PathForge",
    title: "PathForge — AI-Powered Career Intelligence",
    description:
      "Your Career, Intelligently Forged. Career DNA™ technology for semantic job matching, " +
      "CV tailoring, and career strategy. Built in the EU.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PathForge — Career Intelligence for Everyone",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PathForge — AI-Powered Career Intelligence",
    description:
      "Your Career, Intelligently Forged. Career DNA™ technology for semantic job matching, " +
      "CV tailoring, and career strategy.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${plusJakartaSans.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
