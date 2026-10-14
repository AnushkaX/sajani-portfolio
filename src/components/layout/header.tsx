"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Instagram, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { BehanceIcon } from '@/components/icons/behance-icon';
import type { SiteContent } from '@/lib/site-content';

const navLinks = [
  { href: '/#about', label: 'About' },
  { href: '/#portfolio', label: 'Portfolio' },
  { href: '/#resume', label: 'Resume' },
  { href: '/#contact', label: 'Contact' },
];

export default function Header({ social }: { social: SiteContent['social'] }) {
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-foreground/10 bg-background/80 backdrop-blur-md">
      <div className="container flex h-20 max-w-wide items-center justify-between">
        <Link href="/" className="font-display text-xl tracking-[0.28em]">
          SAJANI
        </Link>
        <nav className="hidden items-center gap-6 lg:gap-10 md:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="editorial-link font-sans text-[0.7rem] uppercase tracking-[0.28em] text-muted-foreground transition-colors duration-editorial ease-editorial hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-1 lg:flex">
          <Button variant="ghost" size="icon" asChild>
            <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href={social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href={social.behance} target="_blank" rel="noopener noreferrer" aria-label="Behance">
              <BehanceIcon className="h-5 w-5" />
            </a>
          </Button>
        </div>
        <div className="md:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="mobile-menu-panel w-[min(24rem,88vw)] border-l border-foreground/10 bg-background shadow-none [&>button:last-child]:hidden" aria-describedby={undefined}>
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between pb-8">
                  <Link href="/" className="font-display text-xl tracking-[0.28em]" onClick={() => setMenuOpen(false)}>
                    SAJANI
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setMenuOpen(false)}>
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </div>
                <nav className="flex flex-col items-start gap-5" aria-label="Mobile">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="mobile-menu-item editorial-link font-display text-4xl tracking-tight transition-colors duration-editorial ease-editorial hover:text-accent"
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto flex gap-5 pb-4">
                  <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground transition-colors duration-300 hover:text-primary">
                    <Instagram className="h-6 w-6" />
                  </a>
                  <a href={social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-foreground transition-colors duration-300 hover:text-primary">
                    <Linkedin className="h-6 w-6" />
                  </a>
                  <a href={social.behance} target="_blank" rel="noopener noreferrer" aria-label="Behance" className="text-muted-foreground transition-colors duration-300 hover:text-primary">
                    <BehanceIcon className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
