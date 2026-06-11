import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default:
      "British Training Institute Sharjah | English, IELTS & Professional Courses",
    template: "%s | British Training Institute Sharjah"
  },
  description:
    "Explore English, IELTS preparation, business, accounting, HR and professional training options at British Training Institute in Sharjah.",
  applicationName: "British Training Institute Sharjah"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
