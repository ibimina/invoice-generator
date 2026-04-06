import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Invoice Generator - Create Professional Invoices & Quotations Free",
  description:
    "Free online invoice and quotation generator. Create professional invoices, download as PDF. No signup required, no data stored.",
  keywords: [
    "invoice generator",
    "quotation generator",
    "free invoice",
    "PDF invoice",
    "invoice template",
  ],
  authors: [{ name: "Invoice Generator" }],
  openGraph: {
    title: "Invoice Generator - Free Professional Invoices",
    description: "Create professional invoices and quotations in seconds. Free, no signup required.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
