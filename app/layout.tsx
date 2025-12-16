import type React from "react";
import type { Metadata } from "next";
import { Faculty_Glyphic, Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { cn } from "@/lib/utils";
import Provider from "./_trpc/Provider";

const _geist = Geist({ subsets: ["latin"] });
const _facultyGlyphic = Faculty_Glyphic({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          `font-sans antialiased`,
          _geist.className,
          _facultyGlyphic.variable,
        )}
      >
        <Provider>{children}</Provider>
        <Analytics />
      </body>
    </html>
  );
}
