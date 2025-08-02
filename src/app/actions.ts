"use server";

import { z } from "zod";
import { contactFormSchema } from "@/lib/schemas";

export async function handleContactSubmit(values: z.infer<typeof contactFormSchema>) {
  const parsed = contactFormSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, message: "Invalid form data." };
  }

  console.log("Received contact form submission:", parsed.data);

  // Here you would typically integrate with a backend service to send an email
  // or save the submission to a database (e.g., Firestore).

  // For this example, we'll just simulate a success response.
  await new Promise(resolve => setTimeout(resolve, 1000));

  return { success: true, message: "Form submitted successfully." };
}
