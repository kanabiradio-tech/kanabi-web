import type { Metadata } from "next";
import { Noto_Serif_TC, Inter } from "next/font/google";
import "./globals.css";
import { QueueProvider } from "@/src/components/QueueProvider";
import GlobalPlayer from "@/src/components/GlobalPlayer";

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
  title: "kanabi.live - 晨曦將至，萬年已過。",
  description: "kanabi.live 為你策展每日晨讀",
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
          <GlobalPlayer />
        </QueueProvider>
      </body>
    </html>
  );
}
