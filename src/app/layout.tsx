import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Perfect 50% | Can you stop at exactly 50.000%?",
  description: "A viral reflex challenge game for AntiActivity. Stop the bar at exactly 50.000%!",
  keywords: ["anti-activity", "perfect 50", "reflex game", "timing game", "mini game"],
  openGraph: {
    title: "Perfect 50% - AntiActivity Reflex Challenge",
    description: "Can you stop at exactly 50.000%? Test your reflexes now!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body className="min-h-full bg-[#09090B] text-zinc-100 antialiased font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
