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
    <section id="contact" className="section scroll-mt-24 border-t border-foreground/10">
      <div className="container">
        <SectionHeading
          eyebrow={contact.eyebrow}
          title={contact.title}
          description={contact.description}
        />
        <div className="mx-auto grid max-w-content gap-16 lg:grid-cols-12 lg:gap-20">
          <div className="reveal-on-scroll lg:col-span-7">
            {sent ? (
              <div className="flex min-h-64 flex-col justify-center">
                <p className="eyebrow">Sent</p>
                <h3 className="mt-5 text-4xl">Thank you, {name.split(" ")[0]}.</h3>
                <p className="mt-4 text-muted-foreground">Your note is saved. I'll reply from the studio.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <input type="text" name="company" value={company} onChange={(event) => setCompany(event.target.value)} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                <div className="space-y-2">
                  <Label htmlFor="name" className="eyebrow">Name</Label>
                  <Input id="name" value={name} onChange={(event) => setName(event.target.value)} required disabled={loading} className="h-12 rounded-none border-0 border-b border-foreground/20 bg-transparent px-0 text-base shadow-none focus-visible:ring-0 focus-visible:border-foreground" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="eyebrow">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={loading} className="h-12 rounded-none border-0 border-b border-foreground/20 bg-transparent px-0 text-base shadow-none focus-visible:ring-0 focus-visible:border-foreground" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="eyebrow">Message</Label>
                  <Textarea id="message" rows={5} value={message} onChange={(event) => setMessage(event.target.value)} required disabled={loading} className="rounded-none border-0 border-b border-foreground/20 bg-transparent px-0 text-base shadow-none focus-visible:ring-0 focus-visible:border-foreground" />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="h-12 rounded-none px-8 font-sans text-[0.7rem] uppercase tracking-[0.22em]" disabled={loading}>
                  {loading ? "Sending…" : "Send message"}
                </Button>
              </form>
            )}
          </div>
          <div className="reveal-on-scroll flex flex-col justify-end gap-0 lg:col-span-4 lg:col-start-9">
            {socials.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between border-t border-foreground/15 py-6 transition duration-editorial ease-editorial last:border-b hover:text-foreground"
              >
                <span className="text-sm uppercase tracking-[0.22em]">{label}</span>
                <Icon className="h-4 w-4 text-muted-foreground transition-colors duration-editorial group-hover:text-foreground" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
