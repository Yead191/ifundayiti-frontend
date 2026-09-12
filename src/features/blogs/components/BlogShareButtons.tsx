"use client";

import React, { useState } from "react";
import {
  Share2,
  Check,
  Copy,
  Twitter,
  Facebook,
  Linkedin,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";

interface BlogShareButtonsProps {
  title: string;
  url?: string;
  lang?: string;
}

export function BlogShareButtons({
  title,
  url,
  lang = "en",
}: BlogShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return url || window.location.href;
    }
    return url || "";
  };

  const handleCopy = () => {
    const currentUrl = getShareUrl();
    if (!currentUrl) return;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      toast.success(
        lang === "ht"
          ? "Lyen atik la kopye nan papye-pres!"
          : "Article link copied to clipboard!"
      );
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareOnTwitter = () => {
    const currentUrl = getShareUrl();
    const shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(currentUrl)}`;
    window.open(shareLink, "_blank", "noopener,noreferrer");
  };

  const shareOnFacebook = () => {
    const currentUrl = getShareUrl();
    const shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      currentUrl
    )}`;
    window.open(shareLink, "_blank", "noopener,noreferrer");
  };

  const shareOnLinkedIn = () => {
    const currentUrl = getShareUrl();
    const shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      currentUrl
    )}`;
    window.open(shareLink, "_blank", "noopener,noreferrer");
  };

  const shareOnWhatsApp = () => {
    const currentUrl = getShareUrl();
    const shareLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `${title} ${currentUrl}`
    )}`;
    window.open(shareLink, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-mist uppercase tracking-wider mr-1">
        {lang === "ht" ? "Pataje" : "Share"}:
      </span>

      {/* Copy Link */}
      <button
        type="button"
        onClick={handleCopy}
        title={lang === "ht" ? "Kopye lyen" : "Copy link"}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-white/90 text-forest-deep shadow-2xs transition-all hover:bg-forest hover:text-white hover:border-forest cursor-pointer"
        aria-label="Copy link"
      >
        {copied ? (
          <Check className="h-4 w-4 text-emerald-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>

      {/* Twitter / X */}
      <button
        type="button"
        onClick={shareOnTwitter}
        title="Share on X / Twitter"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-white/90 text-forest-deep shadow-2xs transition-all hover:bg-forest hover:text-white hover:border-forest cursor-pointer"
        aria-label="Share on X"
      >
        <Twitter className="h-4 w-4" />
      </button>

      {/* Facebook */}
      <button
        type="button"
        onClick={shareOnFacebook}
        title="Share on Facebook"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-white/90 text-forest-deep shadow-2xs transition-all hover:bg-forest hover:text-white hover:border-forest cursor-pointer"
        aria-label="Share on Facebook"
      >
        <Facebook className="h-4 w-4" />
      </button>

      {/* LinkedIn */}
      <button
        type="button"
        onClick={shareOnLinkedIn}
        title="Share on LinkedIn"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-white/90 text-forest-deep shadow-2xs transition-all hover:bg-forest hover:text-white hover:border-forest cursor-pointer"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-4 w-4" />
      </button>

      {/* WhatsApp */}
      <button
        type="button"
        onClick={shareOnWhatsApp}
        title="Share on WhatsApp"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-white/90 text-forest-deep shadow-2xs transition-all hover:bg-forest hover:text-white hover:border-forest cursor-pointer"
        aria-label="Share on WhatsApp"
      >
        <MessageCircle className="h-4 w-4" />
      </button>
    </div>
  );
}

export default BlogShareButtons;
