"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Award,
  Calendar,
  MapPin,
  User,
  Tag,
  Share2,
  Check,
  Heart,
  ExternalLink,
  Layers,
} from "lucide-react";
import { FaFacebook, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { formatPrice } from "@/lib/utils";
import type { Project } from "@/helpers/next-fetch/projectActions";

interface ProjectSidebarProps {
  project: Project;
  lang: string;
  dict: any;
}

export function ProjectSidebar({ project, lang, dict }: ProjectSidebarProps) {
  const [copied, setCopied] = useState(false);
  const t = dict.ProjectsPage;

  const cycleTitle =
    typeof project.applicationPeriod === "object" && project.applicationPeriod !== null
      ? project.applicationPeriod.title
      : null;

  const cycleStatus =
    typeof project.applicationPeriod === "object" && project.applicationPeriod !== null
      ? project.applicationPeriod.status
      : null;

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = encodeURIComponent(`${project.name} on IFundAyiti`);

  return (
    <div className="space-y-6 lg:sticky lg:top-28">
      {/* Quick Facts Card */}
      <div className="rounded-3xl border border-hairline bg-white p-6 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2 border-b border-hairline pb-4">
          <Layers className="h-4 w-4 text-forest" />
          <h3 className="font-display text-base font-bold text-forest-deep">
            {t.QuickFacts}
          </h3>
        </div>

        <dl className="mt-4 space-y-3.5 text-xs sm:text-sm">
          {project.grantAmount ? (
            <div className="flex items-center justify-between py-1">
              <dt className="text-mist font-medium flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-forest" />
                {t.Grant}
              </dt>
              <dd className="font-display font-bold text-forest-deep text-base">
                {formatPrice(project.grantAmount)}
              </dd>
            </div>
          ) : null}

          {project.founder && (
            <div className="flex items-center justify-between py-1 border-t border-hairline/60">
              <dt className="text-mist font-medium flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-forest" />
                {t.Lead}
              </dt>
              <dd className="font-semibold text-forest-deep truncate max-w-44 text-right">
                {project.founder}
              </dd>
            </div>
          )}

          {project.location && (
            <div className="flex items-center justify-between py-1 border-t border-hairline/60">
              <dt className="text-mist font-medium flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-forest" />
                {t.Location}
              </dt>
              <dd className="font-medium text-forest-deep truncate max-w-44 text-right">
                {project.location}
              </dd>
            </div>
          )}

          {project.year && (
            <div className="flex items-center justify-between py-1 border-t border-hairline/60">
              <dt className="text-mist font-medium flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-forest" />
                {t.Year}
              </dt>
              <dd className="font-medium text-forest-deep">{project.year}</dd>
            </div>
          )}

          <div className="flex items-center justify-between py-1 border-t border-hairline/60">
            <dt className="text-mist font-medium flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-forest" />
              {t.Category}
            </dt>
            <dd className="font-semibold text-forest">
              {((t?.Categories || {}) as Record<string, string>)[project.category] || project.category}
            </dd>
          </div>
        </dl>
      </div>

      {/* Grant Cycle Card if associated */}
      {cycleTitle && (
        <div className="rounded-3xl border border-violet-200/80 bg-violet-50/50 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700">
              {t.Cycle}
            </span>
            {cycleStatus && (
              <span className="rounded-full bg-violet-200/80 px-2 py-0.5 text-[10px] font-bold text-violet-900 capitalize">
                {cycleStatus}
              </span>
            )}
          </div>
          <h4 className="font-display text-base font-bold text-violet-950">
            {cycleTitle}
          </h4>
          <p className="mt-1 text-xs text-violet-800/80">
            {lang === "ht"
              ? "Pwojè sa a te verifye ak sipòte anba sik sibvansyon sa a."
              : "This project was vetted and funded under this official grant cycle."}
          </p>
        </div>
      )}

      {/* Support Similar Projects CTA */}
      <div className="rounded-3xl border border-sand bg-sand-soft/70 p-6 text-center shadow-xs">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-forest/10 text-forest mb-3">
          <Heart className="h-5 w-5 fill-forest/10" />
        </div>
        <h4 className="font-display text-base font-bold text-forest-deep">
          {t.SupportFund}
        </h4>
        <p className="mt-1.5 text-xs text-mist leading-relaxed">
          {t.SupportFundBody}
        </p>
        <Link
          href={`/${lang}/donate`}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-forest-bright transition-colors"
        >
          <span>{lang === "ht" ? "Fè yon Don nan Fon an" : "Donate to the Fund"}</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Social Share Buttons */}
      <div className="rounded-3xl border border-hairline bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <Share2 className="h-4 w-4 text-forest" />
          <h4 className="font-display text-xs font-bold uppercase tracking-wider text-forest-deep">
            {t.ShareStory}
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on X / Twitter"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-hairline text-mist hover:bg-black hover:text-white transition-colors"
          >
            <FaXTwitter className="h-4 w-4" />
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on LinkedIn"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-hairline text-mist hover:bg-[#0A66C2] hover:text-white transition-colors"
          >
            <FaLinkedin className="h-4 w-4" />
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Facebook"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-hairline text-mist hover:bg-[#1877F2] hover:text-white transition-colors"
          >
            <FaFacebook className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-hairline bg-sand-soft/50 py-2.5 px-3 text-xs font-bold text-forest-deep hover:bg-sand transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-forest" />
                <span>{t.LinkCopied}</span>
              </>
            ) : (
              <span>{lang === "ht" ? "Kopye lyen" : "Copy link"}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
