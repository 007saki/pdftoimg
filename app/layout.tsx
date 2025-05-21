


import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@radix-ui/themes/styles.css";
import "./globals.css";
import { Theme } from "@radix-ui/themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PDF to Image Converter – Fast, Free & Secure",
  description: "Convert PDF files to high-quality images instantly. Free, secure, and easy-to-use online PDF to image converter.",
  metadataBase: new URL("https:/www.suggeelson.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "PDF to Image Converter – Fast, Free & Secure",
    description: "Convert PDF files to high-quality images instantly. Free, secure, and easy-to-use online PDF to image converter.",
    url: "https://www.suggeelson.com",
    siteName: "PDF to Image Converter",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "PDF to Image Converter",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Theme>
          {children}
        </Theme>
      </body>
    </html>
  );
}


