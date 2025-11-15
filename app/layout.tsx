import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Righteous } from "next/font/google";
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
  title: "Halbe Henn - Vorarlberg",
  description:
    "Find portable food stands selling roasted chickens in Vorarlberg, Austria",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
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
