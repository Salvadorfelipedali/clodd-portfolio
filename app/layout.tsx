import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Clodd — AI Visual Agency",
  description: "Создаём визуальный контент с помощью AI. Реклама, анимация, творческие проекты.",
  openGraph: {
    title: "Clodd — AI Visual Agency",
    description: "Создаём визуальный контент с помощью AI. Реклама, анимация, творческие проекты.",
    url: "https://clodd.ru",
    siteName: "Clodd",
    images: [
      {
        url: "https://clodd.ru/og-image-clodd.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning className={inter.variable}>
      <body style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
