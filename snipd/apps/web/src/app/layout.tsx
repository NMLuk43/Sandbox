import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Player } from "@/components/player/Player";
import { Toaster } from "@/components/ui/Toaster";

export const metadata: Metadata = {
  title: "Snipd — Your Podcast Knowledge Base",
  description: "Capture, transcribe, and summarize your favorite podcast moments with AI.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background overflow-hidden">
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
            <Player />
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
