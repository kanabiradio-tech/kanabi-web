import type { Metadata } from "next";
import { Noto_Serif_TC, Inter } from "next/font/google";
import "./globals.css";
import "./journal.css";
import { QueueProvider } from "@/src/components/QueueProvider";
import GlobalPlayer from "@/src/components/GlobalPlayer";
import { ENABLE_AUDIO_FEATURES } from "@/src/lib/features";

const notoSerifTC = Noto_Serif_TC({
  variable: "--font-noto-serif-tc",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kanabi.live"),
  title: "Kanabi｜沈以晨的日常與故事",
  description: "跟著沈以晨吃東西、去旅行、散散步。在 Kanabi，把生活慢慢寫成故事。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-Hant"
      className={`${notoSerifTC.variable} ${inter.variable} antialiased`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body bg-surface text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
        <QueueProvider>
          {children}
          {ENABLE_AUDIO_FEATURES && <GlobalPlayer />}
        </QueueProvider>
      </body>
    </html>
  );
}
