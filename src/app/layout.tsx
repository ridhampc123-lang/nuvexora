import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { siteMetadata } from "@/config/metadata";
import { Providers } from "@/providers/providers";
import { SeoSchema } from "@/components/layout/seo-schema";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jakartaSans.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased w-full overflow-x-clip`}
    >
      <body
        className="min-h-screen w-full flex flex-col bg-background text-foreground overflow-x-hidden font-sans tracking-tight"
        suppressHydrationWarning
      >
        <SeoSchema />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}