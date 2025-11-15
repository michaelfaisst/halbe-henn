import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Halbe Henn - Vorarlberg",
  description: "Find portable food stands selling roasted chickens in Vorarlberg, Austria",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}

