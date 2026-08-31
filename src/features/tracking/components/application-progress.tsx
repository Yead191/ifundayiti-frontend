import { useTranslation } from "@/components/providers/translation-provider";
import { CheckCircle2 } from "lucide-react";
import { TApplicationStatus, POSITIVE_STEPS } from "../types";

interface ApplicationProgressProps {
  status: TApplicationStatus;
  lang?: string;
}

export function ApplicationProgress({ status, lang }: ApplicationProgressProps) {
  const dict = useTranslation();
  const t = dict.TrackingPage.Progress;

  const isRejected = status === "rejected";
  const isArchived = status === "archived";

  const currentIndex = Math.max(
    0,
    POSITIVE_STEPS.findIndex((s) => s.key === status)
  );

  const stepLabels: Record<string, string> = {
    submitted: t.StepSubmitted,
    underReview: t.StepUnderReview,
    approved: t.StepApproved,
    finalist: t.StepFinalist,
    winner: t.StepWinner,
  };

  return (
    <div className="block">
      <h3 className="text-sm font-semibold text-forest-deep uppercase tracking-wider mb-6">
        {t.Title}
      </h3>
      <div className="relative">
        {/* Background Line */}
        <div className="absolute left-4 top-0 h-full w-0.5 bg-sand-soft/80 sm:left-0 sm:top-4 sm:h-0.5 sm:w-full" />

        <div className="relative flex flex-col sm:flex-row sm:justify-between gap-8 sm:gap-4">
          {POSITIVE_STEPS.map((step, i) => {
            const isCompleted = i < currentIndex;
            const isActive = i === currentIndex && !isRejected && !isArchived;

            return (
              <div
                key={step.key}
                className="relative flex items-center gap-4 sm:flex-col sm:gap-3 group"
              >
                <div
                  className={`
                    flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500 bg-white z-10
                    ${
                      isActive
                        ? "border-forest ring-4 ring-forest/10 scale-110"
                        : isCompleted
                          ? "border-forest bg-forest"
                          : "border-sand-soft/80"
                    }
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  ) : isActive ? (
                    <div className="h-2 w-2 rounded-full bg-forest animate-pulse" />
                  ) : null}
                </div>
                <div className="flex-1 sm:text-center sm:absolute sm:top-12 sm:w-24 sm:-ml-8">
                  <p
                    className={`text-sm font-semibold transition-colors ${
                      isActive || isCompleted ? "text-forest-deep" : "text-mist/70"
                    }`}
                  >
                    {stepLabels[step.key] || step.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
