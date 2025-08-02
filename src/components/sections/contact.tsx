"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { handleContactSubmit } from "@/app/actions";
import { contactFormSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Instagram, Linkedin } from "lucide-react";
import { BehanceIcon } from "@/components/icons/behance-icon";
import { Badge } from "../ui/badge";

export default function Contact() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof contactFormSchema>) {
    try {
      const result = await handleContactSubmit(values);
      if (result.success) {
        toast({
          title: "Message Sent!",
          description: "Thank you for reaching out. I'll get back to you soon.",
        });
        form.reset();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error instanceof Error ? error.message : "Could not send message.",
      });
    }
  }

  return (
    <section id="contact" className="py-16 md:py-24 lg:py-32 bg-secondary">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
            <Badge>Contact</Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mt-4">Get In Touch</h2>
          <p className="text-muted-foreground mt-4 mb-8">
            Have a question, a project proposal, or just want to say hello? I'd love to hear from you.
          </p>
        </div>
        <Card className="max-w-xl mx-auto">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tell me about your project or inquiry..." rows={6} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
            <div className="mt-8 flex justify-center space-x-6">
               <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors">
                 <Instagram className="h-6 w-6" />
               </a>
               <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors">
                 <Linkedin className="h-6 w-6" />
               </a>
               <a href="https://behance.net" target="_blank" rel="noopener noreferrer" aria-label="Behance" className="text-muted-foreground hover:text-primary transition-colors">
                 <BehanceIcon className="h-6 w-6" />
               </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
