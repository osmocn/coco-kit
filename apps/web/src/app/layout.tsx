import type { Metadata } from "next";
import "./globals.css";
import { inter } from "@/lib/fonts";

export const metadata: Metadata = {
  title: {
    default: "Coco Kit",
    template: "%s | Coco Kit",
  },
  description:
    "A polished Turborepo starter with shared Biome and TypeScript foundations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-canvas antialiased">
      <body className="min-h-full font-sans text-ink" style={inter.style} >{children}</body>
    </html>
  );
}
