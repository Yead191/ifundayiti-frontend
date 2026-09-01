"use client";

import { useFormContext } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/components/providers/translation-provider";

export function StepBackground() {
  const dict = useTranslation();
  const t = dict.ApplyPage.Step5;

  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="occupation" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-forest">
          {t.OccupationLabel}
        </Label>
        <Input
          id="occupation"
          {...register("occupation")}
          className="h-12 rounded-xl border-hairline bg-sand-soft/20 text-forest-deep focus:bg-white focus:border-forest focus:ring-2 focus:ring-forest/15"
          placeholder={t.OccupationPlaceholder}
        />
        {errors.occupation && (
          <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.occupation.message as string}</span>
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="financialBackground" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-forest">
          {t.FinancialLabel}
        </Label>
        <Textarea
          id="financialBackground"
          {...register("financialBackground")}
          rows={4}
          className="rounded-xl border-hairline bg-sand-soft/20 p-3.5 text-sm text-forest-deep focus:bg-white focus:border-forest focus:ring-2 focus:ring-forest/15"
          placeholder={t.FinancialPlaceholder}
        />
        {errors.financialBackground && (
          <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.financialBackground.message as string}</span>
          </p>
        )}
      </div>
    </div>
  );
}
