"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, SearchX } from "lucide-react";
import { Container } from "@/components/shared/container";

export default function WinnerNotFound() {
  const pathname = usePathname();
  const lang = pathname.split("/")[1] === "ht" ? "ht" : "en";

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-sand-soft/10 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-forest/5 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-forest-deep/5 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob animation-delay-2000" />
      </div>

      <Container className="relative z-10">
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
          <div className="h-24 w-24 rounded-3xl bg-white shadow-xl border border-hairline flex items-center justify-center text-forest-deep mb-8 rotate-3 transition-transform hover:rotate-0 duration-500">
            <SearchX className="h-10 w-10" />
          </div>

          <h1 className="font-display text-5xl md:text-6xl text-forest-deep mb-6">
            {lang === "ht" ? "Laureya a pa jwenn" : "Winner Not Found"}
          </h1>
          
          <p className="text-xl text-mist mb-12 max-w-lg leading-relaxed">
            {lang === "ht" 
              ? "Nou pa t ka jwenn istwa enspiran w ap chèche a. Li posib pou yo deplase oswa retire li nan achiv nou yo."
              : "We couldn't find the inspiring story you're looking for. It might have been moved or removed from our archives."}
          </p>

          <Link
            href={`/${lang}/winners`}
            className="inline-flex items-center gap-2 bg-forest hover:bg-forest-deep text-white px-8 py-4 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <ArrowLeft className="h-5 w-5" />
            {lang === "ht" ? "Tounen nan Laureya yo" : "Return to Winners Hub"}
          </Link>
        </div>
      </Container>
    </div>
  );
}
