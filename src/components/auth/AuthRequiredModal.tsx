"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  FileText,
  Lock,
  Package,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface AuthRequiredModalProps {
  open: boolean;
  onClose: () => void;
  actionTitle?: string;
  lang?: string;
  dict?: any;
}

const MODAL_I18N = {
  en: {
    badge: "Authentication Required",
    title: "Sign In to Continue",
    subtitleAdd:
      "Please sign in to add items to your shopping bag and protect your order details.",
    subtitleBuy:
      "Please sign in to complete your purchase and protect your order details.",
    subtitleGeneric:
      "Please sign in to continue and protect your order details.",
    whyTitle: "Why an account is required:",
    benefits: [
      {
        icon: Package,
        title: "Real-Time Order Tracking",
        desc: "Get live courier delivery updates and dispatch tracking for every order.",
      },
      {
        icon: FileText,
        title: "Order History & Digital Invoices",
        desc: "Instant access to past receipts, purchase history, and exportable tax records.",
      },
      {
        icon: RotateCcw,
        title: "30-Day Exchange",
        desc: "Manage quick size or color exchanges directly inside your dashboard.",
      },
      {
        icon: Sparkles,
        title: "Grant Impact Transparency",
        desc: "Track the actual Haitian entrepreneurs and grassroots grants funded by your purchase.",
      },
    ],
    signInBtn: "Sign In to Your Account",
    registerBtn: "Don't have an account? Create one",
    secureNote: "Secure 256-bit encrypted account protection",
  },
  ht: {
    badge: "Otantifikasyon Obligatwa",
    title: "Konekte pou Kontinye",
    subtitleAdd:
      "Tanpri konekte pou mete atik nan sak acha w la epi pwoteje detay kòmand ou.",
    subtitleBuy:
      "Tanpri konekte pou konplete acha w la epi pwoteje detay kòmand ou.",
    subtitleGeneric: "Tanpri konekte pou kontinye epi pwoteje detay kòmand ou.",
    whyTitle: "Poukisa yon kont nesesè:",
    benefits: [
      {
        icon: Package,
        title: "Swiv Kòmand an Tan Reyèl",
        desc: "Resevwa mizajou livrezon an dirèk ak kòd pou swiv kòmand ou.",
      },
      {
        icon: FileText,
        title: "Istorik Kòmand ak Fakti Dijital",
        desc: "Aksè rapid nan resi pase yo, lis acha ou yo, ak dosye fakti.",
      },
      {
        icon: RotateCcw,
        title: "Echanj pandan 30 Jou",
        desc: "Fè echanj gwosè oswa koulè fasilman dirèkteman nan tablodbò ou.",
      },
      {
        icon: Sparkles,
        title: "Transparans Enpak Sibvansyon yo",
        desc: "Gade antreprenè ayisyen ak pwojè kominotè acha w la ap finanse dirèkteman.",
      },
    ],
    signInBtn: "Konekte nan Kont Ou",
    registerBtn: "Ou pa gen yon kont? Kreye youn",
    secureNote: "Pwoteksyon sekirize ak chifreman 256-bit",
  },
};

export function AuthRequiredModal({
  open,
  onClose,
  actionTitle = "add items to your shopping bag",
  lang: propLang,
  dict,
}: AuthRequiredModalProps) {
  const pathname = usePathname();
  const segments = pathname?.split("/") ?? [];
  const activeLang: "en" | "ht" = (propLang ||
    (segments[1] === "ht" ? "ht" : "en")) as "en" | "ht";
  const redirectUrl = encodeURIComponent(pathname || `/${activeLang}/shop`);

  const t = dict?.AuthRequiredModal ?? MODAL_I18N[activeLang] ?? MODAL_I18N.en;

  const isBuy =
    actionTitle?.toLowerCase().includes("buy") ||
    actionTitle?.toLowerCase().includes("purchase");
  const isAdd =
    actionTitle?.toLowerCase().includes("add") ||
    actionTitle?.toLowerCase().includes("bag");

  const subtitle = isBuy
    ? t.subtitleBuy
    : isAdd
      ? t.subtitleAdd
      : t.subtitleGeneric;

  const benefits = (MODAL_I18N[activeLang] ?? MODAL_I18N.en).benefits;

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="max-w-md bg-white/98 border border-hairline/80 p-5 sm:p-7 shadow-2xl backdrop-blur-2xl rounded-3xl max-h-[90vh] overflow-y-auto"
    >
      <div className="text-center">
        {/* Glowing Lock Badge */}
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-forest/10 text-forest shadow-inner">
          <Lock className="h-6 w-6 text-forest" />
        </div>

        <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-forest">
          {t.badge}
        </p>
        <h3 className="mt-1 font-display text-xl sm:text-2xl font-bold tracking-tight text-forest-deep">
          {t.title}
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-mist">{subtitle}</p>
      </div>

      {/* Benefits / Why Login is Necessary */}
      <div className="mt-5 rounded-2xl border border-hairline/80 bg-sand-soft/40 p-3.5 space-y-2.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-forest-deep">
          {t.whyTitle}
        </p>
        <ul className="space-y-2">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <li key={b.title} className="flex items-start gap-2.5 text-left">
                <div className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-forest/10 text-forest mt-0.5">
                  <Icon className="h-3 w-3" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-forest-deep">
                    {b.title}
                  </h4>
                  <p className="text-[11px] leading-tight text-mist">
                    {b.desc}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 space-y-2">
        <Button
          asChild
          size="lg"
          className="h-11 w-full rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all"
        >
          <Link href={`/${activeLang}/auth/login?redirect=${redirectUrl}`}>
            {t.signInBtn}
            <ArrowRight className="ml-2 h-3.5 w-3.5" />
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          size="sm"
          className="h-10 w-full rounded-xl text-xs font-semibold"
        >
          <Link href={`/${activeLang}/auth/join?redirect=${redirectUrl}`}>
            {t.registerBtn}
          </Link>
        </Button>
      </div>

      <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-mist text-center">
        <ShieldCheck className="h-3 w-3 text-forest" />
        <span>{t.secureNote}</span>
      </div>
    </Modal>
  );
}
