"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Instagram, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { BehanceIcon } from '@/components/icons/behance-icon';
import { siteConfig } from '@/lib/site-config';
import type { SiteContent } from '@/lib/site-content';

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#resume', label: 'Resume' },
  { href: '#contact', label: 'Contact' },
];

export default function Header({ social = siteConfig.social }: { social?: SiteContent['social'] }) {
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-background/75 backdrop-blur-md">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="#home" className="font-display text-2xl tracking-[0.18em]">
          SAJANI
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative text-sm tracking-wide text-foreground/70 transition-colors hover:text-foreground"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-1 md:flex">
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
            <SheetContent side="right" className="w-[80vw]">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between pb-8">
                  <Link href="#home" className="font-display text-2xl tracking-[0.18em]" onClick={() => setMenuOpen(false)}>
                    SAJANI
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setMenuOpen(false)}>
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </div>
                <nav className="flex flex-col items-start gap-5">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-2xl tracking-wide transition-colors hover:text-primary"
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto flex gap-5 pb-4">
                  <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-primary">
                    <Instagram className="h-6 w-6" />
                  </a>
                  <a href={social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary">
                    <Linkedin className="h-6 w-6" />
                  </a>
                  <a href={social.behance} target="_blank" rel="noopener noreferrer" aria-label="Behance" className="text-muted-foreground hover:text-primary">
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
