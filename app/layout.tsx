import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

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
    <html lang="de">
      <body>
        {children}
        <Script
          src="/api/umami/script.js"
          data-website-id="4461bd62-66a1-4cd2-94bf-3ddfdb1e0a14"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
