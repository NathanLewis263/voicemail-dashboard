import type { Metadata } from "next";
import { Syne, Outfit } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const syne = Syne({
  variable: "--font-display-var",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Triage — Voicemail Intelligence",
  description: "AI-powered voicemail triage for healthcare",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${syne.variable} ${outfit.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
