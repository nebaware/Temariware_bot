import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Temariware — Student jobs for Ethiopian universities",
  description: "Tutoring, freelance, part-time and internship jobs for Ethiopian university students. Powered by Telegram.",
  keywords: ["Ethiopia", "university", "students", "tutoring", "jobs", "Telegram", "Harar", "Addis Ababa", "Haramaya"],
  authors: [{ name: "Temariware" }],
  openGraph: {
    title: "Temariware",
    description: "Student jobs for Ethiopian universities — tutoring, freelance & more.",
    siteName: "Temariware",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Telegram Mini App SDK */}
        <script src="https://telegram.org/js/telegram-web-app.js" async />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <ShadcnToaster />
        <SonnerToaster richColors position="top-center" />
      </body>
    </html>
  );
}
