import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import { Inter, Playfair_Display } from "next/font/google"
import './globals.css';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: "Sajani Muthusinghe",
  description: 'Portfolio of fashion designer Sajani Muthusinghe.',
};

const fontDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
})

const fontSans = Inter({
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
          fontSans.variable,
          fontDisplay.variable
        )}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
