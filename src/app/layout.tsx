import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Glacier",
  description: "Glacier layered posts experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <div className="relative min-h-screen overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(123,209,250,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(214,173,255,0.15),transparent_32%),radial-gradient(circle_at_bottom,rgba(255,255,255,0.5),transparent_42%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-white/35 to-transparent"
          />
          <main className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
