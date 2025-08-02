export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} AtelierFlow. All rights reserved.</p>
      </div>
    </footer>
  );
}
