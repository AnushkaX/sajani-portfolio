"use client";

import { Instagram, Linkedin } from "lucide-react";
import { BehanceIcon } from "@/components/icons/behance-icon";
import { Badge } from "../ui/badge";

export default function Contact() {
  return (
    <section id="contact" className="py-16 md:py-24 lg:py-32 bg-secondary">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
            <Badge>Contact</Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mt-4">Get In Touch</h2>
          <p className="text-muted-foreground mt-4 mb-8">
            Have a question, a project proposal, or just want to say hello? I'd love to hear from you through my social media channels.
          </p>
          <div className="mt-8 flex justify-center space-x-6">
             <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors">
               <Instagram className="h-8 w-8" />
             </a>
             <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors">
               <Linkedin className="h-8 w-8" />
             </a>
             <a href="https://behance.net" target="_blank" rel="noopener noreferrer" aria-label="Behance" className="text-muted-foreground hover:text-primary transition-colors">
               <BehanceIcon className="h-8 w-8" />
             </a>
          </div>
        </div>
      </div>
    </section>
  );
}
