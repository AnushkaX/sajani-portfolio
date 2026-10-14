import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LayoutDashboard } from 'lucide-react';
import { LogoutButton } from '../logout-button';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-foreground/10">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 font-sans text-xs uppercase tracking-[0.28em]">
            <LayoutDashboard className="h-5 w-5" />
            Admin
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/site">Site details</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">View site</Link>
            </Button>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="container py-8">{children}</main>
    </div>
  );
}