import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppProviders } from "@/providers/AppProviders";
import { AdminShell } from "@/components/layout/AdminShell";

const aeonik = localFont({
  src: [
    { path: "./fonts/Aeonik-Air.ttf", weight: "100", style: "normal" },
    { path: "./fonts/Aeonik-AirItalic.ttf", weight: "100", style: "italic" },
    { path: "./fonts/Aeonik-Thin.ttf", weight: "200", style: "normal" },
    { path: "./fonts/Aeonik-ThinItalic.ttf", weight: "200", style: "italic" },
    { path: "./fonts/Aeonik-Light.ttf", weight: "300", style: "normal" },
    { path: "./fonts/Aeonik-LightItalic.ttf", weight: "300", style: "italic" },
    { path: "./fonts/Aeonik-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Aeonik-RegularItalic.ttf", weight: "400", style: "italic" },
    { path: "./fonts/Aeonik-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Aeonik-MediumItalic.ttf", weight: "500", style: "italic" },
    { path: "./fonts/Aeonik-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/Aeonik-BoldItalic.ttf", weight: "700", style: "italic" },
    { path: "./fonts/Aeonik-Black.ttf", weight: "900", style: "normal" },
    { path: "./fonts/Aeonik-BlackItalic.ttf", weight: "900", style: "italic" },
  ],
  variable: "--font-aeonik",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EduPro — LMS Admin Panel",
  description: "Empower Learning. Build Skills. Grow. Next-Gen LMS Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={aeonik.variable}>
      <body className={`${aeonik.className} antialiased min-h-screen font-sans`}>
        <AppProviders>
          <AdminShell>{children}</AdminShell>
        </AppProviders>
      </body>
    </html>
  );
}
