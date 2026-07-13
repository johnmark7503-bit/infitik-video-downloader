import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://infitik-video-downloader.johnmark7503.chatgpt.site"),
  title: {
    default: "Free Online Video Downloader — InfiTik",
    template: "%s | InfiTik Video Downloader",
  },
  description:
    "Download public videos online from TikTok, Instagram, Facebook, X, Pinterest and more. Paste a link, choose an available format, and save your video with InfiTik.",
  keywords: [
    "free online video downloader",
    "social media video downloader",
    "TikTok video downloader",
    "Instagram video downloader",
    "Facebook video downloader",
    "Pinterest video downloader",
    "X video downloader",
    "video downloader",
    "Android video downloader",
    "InfiTik",
    "download videos",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Free Online Video Downloader — InfiTik",
    description: "Paste a public social video link and download the available format in seconds.",
    type: "website",
    url: "/",
    siteName: "InfiTik Video Downloader",
    images: [{ url: "/assets/infitik-logo.webp", width: 720, height: 720, alt: "InfiTik Video Downloader" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Video Downloader — InfiTik",
    description: "Download public social videos online with InfiTik.",
    images: ["/assets/infitik-logo.webp"],
  },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Script src="/adsterra-config.js" strategy="beforeInteractive" />
        <Script src="/firebase-config.js" type="module" strategy="afterInteractive" />
      </body>
    </html>
  );
}
