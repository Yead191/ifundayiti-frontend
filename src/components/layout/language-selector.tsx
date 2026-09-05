"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Globe, ChevronDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function LanguageSelector() {
  const pathname = usePathname();
  const router = useRouter();

  // Determine current locale from pathname
  const segments = pathname.split("/");
  const currentLocale = segments[1] === "ht" ? "ht" : "en";

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale === currentLocale) return;

    if (typeof document !== "undefined") {
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    }

    const newSegments = [...segments];
    if (newSegments[1] === "en" || newSegments[1] === "ht") {
      newSegments[1] = newLocale;
    } else {
      newSegments.splice(1, 0, newLocale);
    }

    router.push(newSegments.join("/"));
  };

  const languages = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "ht", label: "Kreyòl Ayisyen", flag: "🇭🇹" },
  ];

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "group flex items-center gap-1.5 rounded-xl border border-white/80 bg-white/40 px-3 py-2 text-sm font-semibold tracking-tight text-forest-deep outline-none backdrop-blur-md transition-all duration-200",
            "hover:border-forest/30 hover:bg-white hover:text-forest shadow-xs",
          )}
        >
          <Globe className="h-4 w-4 opacity-70 group-hover:text-forest transition-colors hidden md:flex" />
          <span className="uppercase text-xs font-bold tracking-wider">
            {currentLocale}
          </span>
          <ChevronDown className="h-3 w-3 opacity-50 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 p-1.5 rounded-2xl border-hairline shadow-xl bg-white/95 backdrop-blur-xl"
      >
        {languages.map((lang) => {
          const active = currentLocale === lang.code;
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLocaleChange(lang.code)}
              className={cn(
                "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold cursor-pointer transition-colors",
                active
                  ? "bg-forest/5 text-forest font-bold"
                  : "text-forest-deep hover:bg-sand-soft hover:text-forest",
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-base leading-none">{lang.flag}</span>
                <span>{lang.label}</span>
              </div>
              {active && <Check className="h-4 w-4 text-forest" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
