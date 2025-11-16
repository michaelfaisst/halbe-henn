import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Righteous } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const righteous = Righteous({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-righteous",
});

export const metadata: Metadata = {
  title: "Halbe Henn - Finde den nächsten Hähnchen Stand in deiner Nähe",
  description: "Finde mobile Hähnchenstände in Vorarlberg",
  keywords: [
    "Halbe Henn",
    "Hähnchen",
    "Vorarlberg",
    "Hähnchenstand",
    "mobile Essensstände",
    "Brathendl",
    "Vorarlberg Karte",
    "Essensstände Vorarlberg",
  ],
  authors: [{ name: "Halbe Henn" }],
  creator: "Halbe Henn",
  publisher: "Halbe Henn",
  metadataBase: new URL("https://halbe-henn.at"),
  alternates: {
    canonical: "/",
    languages: {
      de: "/",
    },
  },
  openGraph: {
    title: "Halbe Henn - Finde den nächsten Hähnchen Stand in deiner Nähe",
    description: "Finde mobile Hähnchenstände in Vorarlberg",
    url: "https://halbe-henn.at",
    siteName: "Halbe Henn",
    locale: "de_AT",
    type: "website",
    countryName: "Austria",
  },
  twitter: {
    card: "summary_large_image",
    title: "Halbe Henn - Finde den nächsten Hähnchen Stand in deiner Nähe",
    description: "Finde mobile Hähnchenstände in Vorarlberg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add verification codes when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
  category: "Food & Dining",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${inter.variable} ${righteous.variable} overflow-x-hidden`}
      suppressHydrationWarning
    >
      <body className={`${inter.className} overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ErrorBoundary>{children}</ErrorBoundary>
        </ThemeProvider>
        <Script
          src="/api/umami/script.js"
          data-website-id="4461bd62-66a1-4cd2-94bf-3ddfdb1e0a14"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
