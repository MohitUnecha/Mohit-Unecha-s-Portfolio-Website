import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
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
  metadataBase: new URL("https://mohitunecha.com"),
  title: "Mohit Unecha — Software Engineer & Product Builder",
  description:
    "CS & Economics student at Rutgers, SWE/PM intern at Microsoft, and Break Through Tech AI Fellow — building at the intersection of software, product, and finance.",
  keywords: [
    "Mohit Unecha",
    "Software Engineer",
    "Product Manager",
    "Microsoft Intern",
    "Rutgers University",
    "AI/ML",
    "Portfolio",
  ],
  openGraph: {
    title: "Mohit Unecha — Software Engineer & Product Builder",
    description:
      "CS & Economics student at Rutgers, SWE/PM intern at Microsoft, and Break Through Tech AI Fellow — building at the intersection of software, product, and finance.",
    url: "https://mohitunecha.com",
    siteName: "Mohit Unecha",
    images: [{ url: "/mohit.jpg" }],
    type: "website",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="theme-color" content="#09090b" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-zinc-950 font-sans text-zinc-400 antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
