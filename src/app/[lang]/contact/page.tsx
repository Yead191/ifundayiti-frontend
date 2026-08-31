"use client";

import * as React from "react";
import Link from "next/link";
import { z } from "zod";
import { toast } from "sonner";
import { useParams } from "next/navigation";
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
import { useTranslation } from "@/components/providers/translation-provider";

export default function ContactPage() {
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const dict = useTranslation();
  const t = dict.ContactPage;

  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [topic, setTopic] = React.useState("grants");
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const schema = React.useMemo(() => {
    return z.object({
      name: z.string().min(2, t.Form.ErrName),
      email: z.string().email(t.Form.ErrEmail),
      topic: z.string().min(1, t.Form.ErrTopic),
      message: z.string().min(10, t.Form.ErrMessage),
    });
  }, [t]);

  const TOPICS = React.useMemo(() => [
    { id: "grants", label: t.Form.TopicGrants, icon: Sparkles },
    { id: "donations", label: t.Form.TopicDonations, icon: MessageSquare },
    { id: "merch", label: t.Form.TopicMerch, icon: Send },
    { id: "general", label: t.Form.TopicGeneral, icon: HelpCircle },
  ], [t]);

  const FAQS_QUICK = React.useMemo(() => [
    {
      q: t.FAQ.Q1,
      a: t.FAQ.A1,
    },
    {
      q: t.FAQ.Q2,
      a: t.FAQ.A2,
      href: `/${lang}/track-application`,
      linkText: t.FAQ.LinkText2,
    },
    {
      q: t.FAQ.Q3,
      a: t.FAQ.A3,
      href: `/${lang}/checkout`,
      linkText: t.FAQ.LinkText3,
    },
  ], [t, lang]);

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
    toast.success(lang === "ht" ? "Mesaj ou a voye avèk siksè!" : "Your message has been sent successfully!");
  }

  // Split success message for dynamic HTML styling
  const topicLabel = TOPICS.find((t) => t.id === topic)?.label || "";
  const emailLabel = form.email;
  const partsTopic = t.Success.Body.split("[topic]");
  const partBeforeTopic = partsTopic[0];
  const partsEmail = partsTopic[1]?.split("[email]") || [""];
  const partBetween = partsEmail[0];
  const partAfterEmail = partsEmail[1];

  return (
    <div className="bg-cream min-h-screen">
      {/* Page Hero */}
      <PageHero
        eyebrow={t.Hero.Eyebrow}
        title={t.Hero.Title}
        subtitle={t.Hero.Subtitle}
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
                  {t.Direct.Eyebrow}
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-forest-deep">
                  {t.Direct.Title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-mist">
                  {t.Direct.Body}
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
                        {t.Direct.EmailLabel}
                      </p>
                      <p className="text-sm font-semibold text-forest-deep group-hover:text-forest">
                        {SITE.email}
                      </p>
                      <p className="text-xs text-mist mt-0.5">{t.Direct.EmailDesc}</p>
                    </div>
                  </a>

                  {/* Phone */}
                  <div className="flex items-start gap-4 rounded-2xl border border-hairline bg-sand-soft/40 p-4">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-forest text-white">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-forest">
                        {t.Direct.PhoneLabel}
                      </p>
                      <p className="text-sm font-semibold text-forest-deep">
                        {SITE.phone}
                      </p>
                      <p className="text-xs text-mist mt-0.5">{t.Direct.PhoneDesc}</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-4 rounded-2xl border border-hairline bg-sand-soft/40 p-4">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-forest text-white">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-forest">
                        {t.Direct.LocationLabel}
                      </p>
                      <p className="text-sm font-semibold text-forest-deep">
                        {SITE.location}
                      </p>
                      <p className="text-xs text-mist mt-0.5">{t.Direct.LocationDesc}</p>
                    </div>
                  </div>
                </div>

                {/* Hours Indicator */}
                <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-hairline bg-sand-soft/60 px-4 py-3 text-xs text-mist">
                  <Clock className="h-4 w-4 text-forest shrink-0" />
                  <span>
                    {t.Direct.Responds.split("[time]")[0]}
                    <strong className="text-forest-deep font-semibold">
                      {lang === "ht" ? "24 èdtan" : "24 hours"}
                    </strong>
                    {t.Direct.Responds.split("[time]")[1]}
                  </span>
                </div>
              </div>

              {/* Quick FAQ Link Card */}
              <div className="rounded-3xl border border-hairline bg-sand-soft/60 p-6 sm:p-8">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-forest" />
                  <h3 className="font-display text-lg font-semibold text-forest-deep">
                    {t.QuickFAQ.Title}
                  </h3>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-mist">
                  {t.QuickFAQ.Body}
                </p>
                <Button asChild variant="outline" size="sm" className="mt-4 rounded-xl">
                  <Link href={`/${lang}/faq`}>
                    {t.QuickFAQ.LinkBtn}
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
                      {t.Success.Eyebrow}
                    </p>
                    <h2 className="mt-2 font-display text-3xl font-semibold text-forest-deep">
                      {t.Success.Title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-mist max-w-md mx-auto">
                      {partBeforeTopic}
                      <strong className="text-forest-deep">{topicLabel}</strong>
                      {partBetween}
                      <span className="font-semibold text-forest-deep">{emailLabel}</span>
                      {partAfterEmail}
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
                        {t.Success.AgainBtn}
                      </Button>
                      <Button asChild className="rounded-xl px-6 w-full sm:w-auto">
                        <Link href={`/${lang}`}>{t.Success.HomeBtn}</Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* CONTACT FORM */
                  <form onSubmit={(e) => void onSubmit(e)} className="space-y-6">
                    <div>
                      <h2 className="font-display text-2xl font-semibold text-forest-deep">
                        {t.Form.Title}
                      </h2>
                      <p className="mt-1 text-sm text-mist">
                        {t.Form.Subtitle}
                      </p>
                    </div>

                    {/* TOPIC SELECTOR PILLS */}
                    <div>
                      <Label className="mb-2.5 block text-xs font-semibold uppercase tracking-wider text-forest">
                        {t.Form.TopicLabel}
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
                          {t.Form.NameLabel}
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
                          {t.Form.EmailLabel}
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
                        {t.Form.SubjectLabel}
                      </Label>
                      <Input
                        id="c-subject"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        placeholder={t.Form.SubjectPlaceholder}
                        className="h-12 rounded-xl border-hairline bg-sand-soft/20 focus:bg-white"
                      />
                    </div>

                    {/* MESSAGE */}
                    <div>
                      <Label htmlFor="c-msg" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-forest">
                        {t.Form.MessageLabel}
                      </Label>
                      <Textarea
                        id="c-msg"
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder={t.Form.MessagePlaceholder}
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
                          {t.Form.SendingBtn}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          {t.Form.SendBtn}
                        </span>
                      )}
                    </Button>

                    <p className="text-center text-xs text-mist">
                      {t.Form.PrivacyNote}
                    </p>
                  </form>
                )}

              </div>
            </div>

          </div>

          {/* FAQS QUICK ANSWERS SECTION */}
          <div className="mt-20 border-t border-hairline pt-16">
            <div className="text-center max-w-2xl mx-auto">
              <p className="eyebrow">{t.FAQ.Eyebrow}</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-forest-deep">
                {t.FAQ.Title}
              </h2>
              <p className="mt-2 text-sm text-mist">
                {t.FAQ.Subtitle}
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
