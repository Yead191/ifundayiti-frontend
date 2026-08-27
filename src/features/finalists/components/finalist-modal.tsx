import Image from "next/image";
import { MapPin, User, Rocket, Sparkles, X } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { getImageUrl } from "@/lib/getImageUrl";

interface FinalistModalProps {
  open: boolean;
  onClose: () => void;
  finalist: any | null;
}

export function FinalistModal({ open, onClose, finalist }: FinalistModalProps) {
  if (!finalist) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      hideCloseButton={true}
      className="max-w-2xl bg-white p-0!"
    >
      <div className="relative mb-8 h-48 sm:h-56">
        {/* Background gradient/pattern with overflow-hidden just for the background */}
        <div className="absolute inset-0 overflow-hidden rounded-t-3xl">
          <div className="absolute inset-0 bg-linear-to-br from-forest-deep via-forest to-forest-deep opacity-90" />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <span className="absolute -bottom-4 right-2 font-display text-[6rem] sm:text-[8rem] font-bold text-white/5 tracking-tighter select-none pointer-events-none leading-none">
            FINALIST
          </span>
        </div>

        {/* Custom close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-50 grid h-10 w-10 place-items-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-all hover:bg-black/40 hover:scale-105"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Profile Picture overlapping - now outside overflow-hidden */}
        <div className="absolute -bottom-6 left-6 h-28 w-28 rounded-2xl border-4 border-white bg-sand-soft overflow-hidden shadow-lg z-10">
          <Image
            src={getImageUrl(finalist.personal?.image) || ""}
            alt={finalist.personal?.name || "Finalist"}
            fill
            className="object-cover"
            sizes="112px"
          />
        </div>
      </div>

      <div className="px-6 pb-6 pt-2 sm:px-8 sm:pb-8">
        <h2 className="font-display text-3xl font-semibold text-forest-deep mb-1">
          {finalist.personal?.name}
        </h2>
        <p className="text-lg font-medium text-mist mb-6">
          {finalist.grant?.projectName}
        </p>

        <div className="flex flex-wrap gap-4 border-b border-hairline pb-6 mb-6">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-forest/10 flex items-center justify-center text-forest">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-mist uppercase tracking-wider">
                Location
              </p>
              <p className="text-sm font-medium text-forest-deep">
                {finalist.personal?.location}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-forest/10 flex items-center justify-center text-forest">
              <User className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-mist uppercase tracking-wider">
                Occupation
              </p>
              <p className="text-sm font-medium text-forest-deep">
                {finalist.background?.occupation}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Rocket className="h-4 w-4 text-forest" />
              <h3 className="font-semibold text-forest-deep uppercase tracking-wider text-xs">
                Proposed Fund Usage
              </h3>
            </div>
            <p className="text-mist text-sm leading-relaxed">
              {finalist.grant?.fundUsage}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-forest" />
              <h3 className="font-semibold text-forest-deep uppercase tracking-wider text-xs">
                Expected Impact
              </h3>
            </div>
            <p className="text-mist text-sm leading-relaxed">
              {finalist.grant?.expectedImpact}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
