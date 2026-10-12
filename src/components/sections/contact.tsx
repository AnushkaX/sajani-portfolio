"use client";

import { useState } from "react";
import { Instagram, Linkedin } from "lucide-react";
import { BehanceIcon } from "@/components/icons/behance-icon";
import { SectionHeading } from "./section-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { SiteContent } from "@/lib/site-content";

export default function Contact({
  contact,
  social,
}: {
  contact: SiteContent["contact"];
  social: SiteContent["social"];
}) {
  const socials = [
    { href: social.instagram, label: "Instagram", icon: Instagram },
    { href: social.linkedin, label: "LinkedIn", icon: Linkedin },
    { href: social.behance, label: "Behance", icon: BehanceIcon },
  ];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, company }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error ?? "Could not send your message");
        return;
      }
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="scroll-mt-24 bg-secondary py-20 md:py-28 lg:py-32">
      <div className="container">
        <SectionHeading
          eyebrow={contact.eyebrow}
          title={contact.title}
          description={contact.description}
        />
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="reveal-on-scroll border border-border/70 bg-background p-6 shadow-sm md:p-8">
            {sent ? (
              <div className="flex min-h-64 flex-col justify-center">
                <p className="text-xs uppercase tracking-[0.28em] text-primary">Sent</p>
                <h3 className="mt-3 text-3xl tracking-wide">Thank you, {name.split(" ")[0]}.</h3>
                <p className="mt-3 text-muted-foreground">Your note is saved. I'll reply from the studio.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <input type="text" name="company" value={company} onChange={(event) => setCompany(event.target.value)} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} onChange={(event) => setName(event.target.value)} required disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" rows={5} value={message} onChange={(event) => setMessage(event.target.value)} required disabled={loading} />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="rounded-none px-8 uppercase tracking-[0.16em]" disabled={loading}>
                  {loading ? "Sending…" : "Send message"}
                </Button>
              </form>
            )}
          </div>
          <div className="reveal-on-scroll flex flex-col justify-center gap-4">
            {socials.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between border border-border/70 bg-background px-5 py-4 transition duration-300 hover:-translate-y-0.5 hover:border-primary/40"
              >
                <span className="tracking-wide">{label}</span>
                <Icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
