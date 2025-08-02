import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import { Inter as FontSans } from "next/font/google"
import './globals.css';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'AtelierFlow',
  description: 'Portfolio for an emerging fashion designer.',
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
