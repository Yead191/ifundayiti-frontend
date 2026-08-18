"use client";

import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";

import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SITE } from "@/data/site";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  message: z.string().min(10, "Please share a short message"),
});

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="We would like to hear from you."
        subtitle="Questions about grants, donations, or the shop — send a note and the team will follow up."
      />
      <section className="py-16">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="font-display text-2xl text-forest-deep">Reach us</h2>
            <ul className="mt-5 space-y-3 text-mist">
              <li>Email: {SITE.email}</li>
              <li>Phone: {SITE.phone}</li>
              <li>Location: {SITE.location}</li>
            </ul>
            <a
              href="/faq"
              className="mt-6 inline-block text-sm font-semibold text-forest hover:underline"
            >
              Browse FAQs
            </a>
          </div>
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="rounded-2xl border border-hairline bg-white px-6 py-12 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-forest" />
                <h2 className="mt-4 font-display text-2xl">Message sent</h2>
                <p className="mt-2 text-sm text-mist">
                  This is a demo confirmation. Replace with the live contact API later.
                </p>
                <Button
                  className="mt-6"
                  variant="outline"
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: "", email: "", message: "" });
                  }}
                >
                  Send another
                </Button>
              </div>
            ) : (
              <form
                onSubmit={(e) => void onSubmit(e)}
                className="space-y-4 rounded-2xl border border-hairline bg-white p-6 sm:p-8"
              >
                <div>
                  <Label htmlFor="c-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-forest">
                    Name
                  </Label>
                  <Input
                    id="c-name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="c-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-forest">
                    Email
                  </Label>
                  <Input
                    id="c-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="c-msg" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-forest">
                    Message
                  </Label>
                  <Textarea
                    id="c-msg"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : "Send message"}
                </Button>
              </form>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
