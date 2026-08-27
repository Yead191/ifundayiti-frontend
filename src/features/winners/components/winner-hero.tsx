import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/shared/container";

export function WinnerHero() {
  return (
    <div className="relative h-[40vh] min-h-87.5 w-full bg-forest-deep flex items-center justify-center overflow-hidden">
      {/* Gradient and Pattern */}
      <div className="absolute inset-0 bg-linear-to-br from-forest-deep via-forest to-forest-deep opacity-60" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Massive WINNER text */}
      <div className="relative z-10 font-display font-black text-[18vw] leading-none text-white/25 select-none tracking-tighter mix-blend-overlay">
        WINNER
      </div>

      <Container className="absolute inset-x-0 top-0 pt-10 h-full flex flex-col z-20">
        <Link
          href="/winners"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors uppercase tracking-wider text-xs font-semibold self-start bg-white/10 px-4 py-2 rounded-full backdrop-blur-md"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Winners
        </Link>
      </Container>
    </div>
  );
}
