import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  ThemeProvider,
  themeInitScript,
} from "@/components/theme/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ASPM — Agent governance for regulated environments",
  description:
    "Agent governance and ATO automation for environments where SaaS can't go and auditors must sign.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-sans antialiased bg-bg-base text-fg">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
