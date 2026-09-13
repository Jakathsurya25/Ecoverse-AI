import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EcoVerse AI | Autonomous Sustainability OS",
  description: "The world's first autonomous sustainability operating system. Intelligently tracking emissions, waste, energy, and water through AI and receipt intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
