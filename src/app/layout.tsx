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
      "British Training Institute Sharjah | IELTS, Cambridge English & Professional Training",
    template: "%s | British Training Institute Sharjah"
  },
  description:
    "Established in 2002, British Training Institute in Sharjah offers IELTS and Cambridge-affiliated English programmes, professional certifications, engineering, IT, finance and corporate training — classroom and online.",
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
