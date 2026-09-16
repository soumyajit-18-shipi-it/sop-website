import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Question Paper Intelligence",
  description: "Faculty decision support and next question paper preparation platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" class="light">
      <body class="bg-background text-on-background min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
