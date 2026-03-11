import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Río Texas Resolutions",
  description:
    "Resolution submission and tracking system for the Río Texas Annual Conference",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
