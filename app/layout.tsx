import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Secretly — Secure Digital Legacy Platform",
  description:
    "Protect your digital legacy with military-grade encryption. Store secrets, schedule messages, and ensure your loved ones are never left without answers.",
  keywords: [
    "digital legacy",
    "encrypted vault",
    "dead man switch",
    "secure messages",
    "password manager",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
