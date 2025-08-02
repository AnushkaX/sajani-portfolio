import { Wind } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col md:flex-row items-center justify-between py-6 gap-4">
        <div className="flex items-center gap-2">
            <Wind className="h-6 w-6" />
            <span className="font-bold">AtelierFlow</span>
        </div>
        <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} AtelierFlow. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
