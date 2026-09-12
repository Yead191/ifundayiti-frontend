"use client";

import React from "react";
import Image from "next/image";
import { ShieldCheck, Mail } from "lucide-react";
import type { IBlogAuthor } from "@/helpers/next-fetch/blogActions";
import { getImageUrl } from "@/lib/getImageUrl";

interface BlogAuthorBioProps {
  author?: IBlogAuthor | string;
  lang?: string;
}

export function BlogAuthorBio({ author, lang = "en" }: BlogAuthorBioProps) {
  const authorObj = typeof author === "object" && author ? author : null;
  const name = authorObj?.name || (typeof author === "string" ? author : "IFundAyiti Field Dispatch");
  const avatar = authorObj?.image ? getImageUrl(authorObj.image) : null;
  const email = authorObj?.email;

  return (
    <div className="rounded-3xl border border-hairline/80 bg-linear-to-br from-sand-soft/50 via-white to-white p-6 sm:p-8 shadow-xs backdrop-blur-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        {/* Author Avatar */}
        <div className="relative shrink-0">
          {avatar ? (
            <Image
              src={avatar}
              alt={name}
              width={72}
              height={72}
              className="h-16 w-16 sm:h-18 sm:w-18 rounded-full object-cover ring-2 ring-forest/20 shadow-md"
            />
          ) : (
            <div className="flex h-16 w-16 sm:h-18 sm:w-18 items-center justify-center rounded-full bg-forest text-xl font-bold text-white shadow-md">
              {name.charAt(0)}
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
            <ShieldCheck className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Bio Details */}
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-forest">
              {lang === "ht" ? "Konsènan Otè a" : "Published By"}
            </span>
          </div>

          <h3 className="font-display text-lg sm:text-xl font-bold text-forest-deep">
            {name}
          </h3>

          <p className="text-xs sm:text-sm text-mist leading-relaxed">
            {lang === "ht"
              ? "Manm ekip IFundAyiti ki travay dirèkteman sou teren an pou dokimante ak verifye pwojè kominotè, seremoni bous, ak istwa lidè lokal yo."
              : "Part of the IFundAyiti editorial and field initiatives team, dedicated to transparent reporting, grassroots verification, and amplifying community-led change across Haiti."}
          </p>

          {email && (
            <div className="pt-1 flex items-center gap-1.5 text-xs text-mist/70">
              <Mail className="h-3.5 w-3.5 text-forest" />
              <span>{email}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BlogAuthorBio;
