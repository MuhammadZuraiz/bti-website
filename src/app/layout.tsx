import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AnalyticsScripts } from "@/components/seo/analytics-scripts";
import { siteConfig } from "@/config/site";
import { buildRobotsMetadata } from "@/lib/seo";

const bodyFont = localFont({
  src: "./fonts/geist-latin.woff2",
  variable: "--font-body",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default:
      "British Training Institute Sharjah | English, IELTS & Professional Courses",
    template: "%s | British Training Institute Sharjah"
  },
  description:
    "Explore English, IELTS preparation, business, accounting, HR and professional training options at British Training Institute in Sharjah.",
  applicationName: "British Training Institute Sharjah",
  robots: buildRobotsMetadata(),
  icons: {
    icon: siteConfig.metadataImages.icon,
    apple: siteConfig.metadataImages.apple
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={bodyFont.variable}>
        {children}
        <AnalyticsScripts />
      </body>
    </html>
  );
}
