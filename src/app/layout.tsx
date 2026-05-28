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
        <div className="relative flex min-h-screen w-full flex-col px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </body>
    </html>
  );
}
