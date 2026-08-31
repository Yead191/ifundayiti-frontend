"use client";

import * as React from "react";
import Link from "next/link";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  HelpCircle,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SITE } from "@/data/site";

const schema = z.object({
  name: z.string().min(2, "Name is required (at least 2 characters)"),
  email: z.string().email("Enter a valid email address"),
  topic: z.string().min(1, "Please select an inquiry topic"),
  message: z.string().min(10, "Please share a message (at least 10 characters)"),
});

const TOPICS = [
  { id: "grants", label: "Grants & Apply", icon: Sparkles },
  { id: "donations", label: "Donations & Fund", icon: MessageSquare },
  { id: "merch", label: "Shop & Orders", icon: Send },
  { id: "general", label: "General Inquiry", icon: HelpCircle },
];

const FAQS_QUICK = [
  {
    q: "How fast does the IFundAyiti team respond?",
    a: "We review inquiries daily and typically respond within 24 to 48 hours.",
  },
  {
    q: "Need help tracking your grant application?",
    a: "You can track your application status anytime on our dedicated tracking page.",
    href: "/track-application",
    linkText: "Track Status",
  },
  {
    q: "Have questions about merchandise orders?",
    a: "Order updates and shipping info can be managed directly on our checkout page.",
    href: "/checkout",
    linkText: "View Checkout",
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [topic, setTopic] = React.useState("grants");
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...form, topic };
    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message);
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
    toast.success("Your message has been sent successfully!");
  }

  return (
    <div className="bg-cream min-h-screen">
      {/* Page Hero */}
      <PageHero
        eyebrow="Contact Us"
        title="We would love to hear from you."
        subtitle="Have questions about grant applications, merchandise orders, or partnerships? Reach out directly to our team."
      />

      {/* Main Section */}
      <section className="py-14 lg:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">

            {/* LEFT COLUMN: Contact Details & Help Cards */}
            <div className="space-y-8 lg:col-span-5">

              {/* Main Contact Card */}
              <div className="rounded-3xl border border-hairline bg-white p-6 shadow-xs sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest">
                  Direct Lines
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-forest-deep">
                  Reach out directly
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-mist">
                  Our team is dedicated to supporting Haitian entrepreneurs and community members.
                </p>

                <div className="mt-6 space-y-4">
                  {/* Email */}
                  <a
                    href={`mailto:${SITE.email}`}
                    className="group flex items-start gap-4 rounded-2xl border border-hairline bg-sand-soft/40 p-4 transition-all hover:border-forest/40 hover:bg-sand-soft/80"
                  >
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-forest text-white transition-transform group-hover:scale-105">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-forest">
                        Email Us
                      </p>
                      <p className="text-sm font-semibold text-forest-deep group-hover:text-forest">
                        {SITE.email}
                      </p>
                      <p className="text-xs text-mist mt-0.5">Send a message anytime</p>
                    </div>
                  </a>

                  {/* Phone */}
                  <div className="flex items-start gap-4 rounded-2xl border border-hairline bg-sand-soft/40 p-4">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-forest text-white">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-forest">
                        Phone & Support
                      </p>
                      <p className="text-sm font-semibold text-forest-deep">
                        {SITE.phone}
                      </p>
                      <p className="text-xs text-mist mt-0.5">Available Mon–Fri, 9am–5pm EST</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-4 rounded-2xl border border-hairline bg-sand-soft/40 p-4">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-forest text-white">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-forest">
                        Headquarters
                      </p>
                      <p className="text-sm font-semibold text-forest-deep">
                        {SITE.location}
                      </p>
                      <p className="text-xs text-mist mt-0.5">Community Grant Operations</p>
                    </div>
                  </div>
                </div>

                {/* Hours Indicator */}
                <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-hairline bg-sand-soft/60 px-4 py-3 text-xs text-mist">
                  <Clock className="h-4 w-4 text-forest shrink-0" />
                  <span>Typically responds within <strong className="text-forest-deep font-semibold">24 hours</strong></span>
                </div>
              </div>

              {/* Quick FAQ Link Card */}
              <div className="rounded-3xl border border-hairline bg-sand-soft/60 p-6 sm:p-8">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-forest" />
                  <h3 className="font-display text-lg font-semibold text-forest-deep">
                    Looking for instant answers?
                  </h3>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-mist">
                  Check our FAQ center for quick answers on grant eligibility, funding timelines, and donation allocations.
                </p>
                <Button asChild variant="outline" size="sm" className="mt-4 rounded-xl">
                  <Link href="/faq">
                    Browse All FAQs
                    <ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>

            </div>

            {/* RIGHT COLUMN: Premium Contact Form */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-hairline bg-white p-6 shadow-md sm:p-10">

                {submitted ? (
                  /* SUBMITTED SUCCESS VIEW */
                  <div className="py-12 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-forest/10 text-forest">
                      <CheckCircle2 className="h-10 w-10 text-forest" />
                    </div>
                    <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-forest">
                      Message Sent
                    </p>
                    <h2 className="mt-2 font-display text-3xl font-semibold text-forest-deep">
                      Thank you for contacting us!
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-mist max-w-md mx-auto">
                      We have received your message regarding <strong className="text-forest-deep">{TOPICS.find((t) => t.id === topic)?.label}</strong>. A member of the IFundAyiti team will respond to <span className="font-semibold text-forest-deep">{form.email}</span> shortly.
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <Button
                        onClick={() => {
                          setSubmitted(false);
                          setForm({ name: "", email: "", subject: "", message: "" });
                        }}
                        variant="outline"
                        className="rounded-xl px-6 w-full sm:w-auto"
                      >
                        Send Another Message
                      </Button>
                      <Button asChild className="rounded-xl px-6 w-full sm:w-auto">
                        <Link href="/">Return to Home</Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* CONTACT FORM */
                  <form onSubmit={(e) => void onSubmit(e)} className="space-y-6">
                    <div>
                      <h2 className="font-display text-2xl font-semibold text-forest-deep">
                        Send a Message
                      </h2>
                      <p className="mt-1 text-sm text-mist">
                        Fill out the form below and we will get back to you as soon as possible.
                      </p>
                    </div>

                    {/* TOPIC SELECTOR PILLS */}
                    <div>
                      <Label className="mb-2.5 block text-xs font-semibold uppercase tracking-wider text-forest">
                        Select Inquiry Topic *
                      </Label>
                      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                        {TOPICS.map((t) => {
                          const Icon = t.icon;
                          const active = topic === t.id;
                          return (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setTopic(t.id)}
                              className={cn(
                                "flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-3 text-center transition-all cursor-pointer",
                                active
                                  ? "border-forest bg-forest text-white shadow-xs font-semibold"
                                  : "border-hairline bg-sand-soft/30 text-forest-deep hover:border-forest/40 hover:bg-sand-soft/60",
                              )}
                            >
                              <Icon className={cn("h-4 w-4", active ? "text-white" : "text-forest")} />
                              <span className="text-xs">{t.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* NAME & EMAIL */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="c-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-forest">
                          Your Name *
                        </Label>
                        <Input
                          id="c-name"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="e.g. Marie Carmel"
                          className="h-12 rounded-xl border-hairline bg-sand-soft/20 focus:bg-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="c-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-forest">
                          Email Address *
                        </Label>
                        <Input
                          id="c-email"
                          required
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="marie@example.com"
                          className="h-12 rounded-xl border-hairline bg-sand-soft/20 focus:bg-white"
                        />
                      </div>
                    </div>

                    {/* SUBJECT */}
                    <div>
                      <Label htmlFor="c-subject" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-forest">
                        Subject / Brief Title (Optional)
                      </Label>
                      <Input
                        id="c-subject"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        placeholder="e.g. Question regarding grant cycle timeline"
                        className="h-12 rounded-xl border-hairline bg-sand-soft/20 focus:bg-white"
                      />
                    </div>

                    {/* MESSAGE */}
                    <div>
                      <Label htmlFor="c-msg" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-forest">
                        Message *
                      </Label>
                      <Textarea
                        id="c-msg"
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Share the details of your inquiry here..."
                        className="rounded-xl border-hairline bg-sand-soft/20 p-4 text-sm focus:bg-white"
                      />
                    </div>

                    {/* SUBMIT BUTTON */}
                    <Button
                      type="submit"
                      disabled={loading}
                      size="lg"
                      className="h-13 w-full rounded-2xl text-base font-semibold shadow-md transition-all hover:shadow-lg"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Sending Message...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          Send Message
                        </span>
                      )}
                    </Button>

                    <p className="text-center text-xs text-mist">
                      🔒 We respect your privacy. Your information will only be used to respond to your inquiry.
                    </p>
                  </form>
                )}

              </div>
            </div>

          </div>

          {/* FAQS QUICK ANSWERS SECTION */}
          <div className="mt-20 border-t border-hairline pt-16">
            <div className="text-center max-w-2xl mx-auto">
              <p className="eyebrow">Quick Help</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-forest-deep">
                Frequently Asked Questions
              </h2>
              <p className="mt-2 text-sm text-mist">
                Answers to common questions about IFundAyiti grant programs and merchandise.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {FAQS_QUICK.map((faq) => (
                <div
                  key={faq.q}
                  className="rounded-3xl border border-hairline bg-white p-6 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-display text-base font-semibold text-forest-deep">
                      {faq.q}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-mist">
                      {faq.a}
                    </p>
                  </div>
                  {faq.href && (
                    <Link
                      href={faq.href}
                      className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-forest hover:underline"
                    >
                      {faq.linkText}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
