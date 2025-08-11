import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { League_Spartan } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import AuthGuard from "@/components/routes/AuthGuard";

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  variable: "--font-league", // optional for CSS variable
  weight: ["400", "500", "600", "700"], // pick needed weights
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Maldives Admin Dashboard",
  description: "Admin dashboard for managing Maldives properties",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${leagueSpartan.variable} antialiased`}
      >
        <Toaster position="bottom-right" />
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}
