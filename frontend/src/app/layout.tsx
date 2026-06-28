import type { Metadata } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import { AppShell } from "@/components/layout/app-shell";
import { siteConfig } from "@/config/site";
import { AppProviders } from "@/providers/app-providers";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const outfitFont = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${outfitFont.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
