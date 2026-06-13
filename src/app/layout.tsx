import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  ThemeProvider,
  themeInitScript,
} from "@/components/theme/ThemeProvider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SEGENTIX - AI agent permission and risk analysis",
  description:
    "Discover AI agents, map connected tools and available actions, identify excessive privileges, and reduce AI attack surface risk.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen bg-bg text-fg">
        <ThemeProvider>
          <div className="fixed right-4 top-4 z-[100]">
            <ThemeToggle />
          </div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
