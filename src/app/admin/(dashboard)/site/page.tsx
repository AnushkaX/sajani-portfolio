import Link from 'next/link';
import { SiteEditor } from './site-editor';

export default function SiteDetailsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="text-muted-foreground hover:text-foreground">← Back</Link>
        <h1 className="text-2xl font-bold">Site details</h1>
      </div>
      <SiteEditor />
    </div>
  );
}
