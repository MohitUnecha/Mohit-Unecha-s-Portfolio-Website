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
  title: "Mohit Unecha — SWE/PM Intern @ Microsoft | CS & Econ @ Rutgers",
  description:
    "Software engineer & product manager building AI-powered products. SWE/PM Intern at Microsoft (M365 Core), Break Through Tech AI Fellow at Cornell Tech, hackathon winner, and nonprofit technology lead.",
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
    title: "Mohit Unecha — SWE/PM Intern @ Microsoft",
    description:
      "Software engineer & product manager building AI-powered products at Microsoft, with a passion for fintech, F1 analytics, and tech for social impact.",
    url: "https://mohitunecha.com",
    siteName: "Mohit Unecha Portfolio",
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
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta name="theme-color" content="#0f172a" />
        <script
          src="https://www.google.com/recaptcha/api.js?render=explicit"
          async
          defer
        ></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
