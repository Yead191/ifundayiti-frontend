"use client";

import { useFormContext } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/components/providers/translation-provider";

export function StepId() {
  const dict = useTranslation();
  const t = dict.ApplyPage.Step3;

  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="nationalId" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-forest">
          {t.IdLabel}
        </Label>
        <Input
          id="nationalId"
          {...register("nationalId")}
          className="h-12 rounded-xl border-hairline bg-sand-soft/20 text-forest-deep focus:bg-white focus:border-forest focus:ring-2 focus:ring-forest/15"
          placeholder={t.IdPlaceholder}
        />
        {errors.nationalId && (
          <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.nationalId.message as string}</span>
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="passport" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-forest">
          {t.PassportLabel} <span className="font-normal text-mist">{t.Optional}</span>
        </Label>
        <Input
          id="passport"
          {...register("passport")}
          className="h-12 rounded-xl border-hairline bg-sand-soft/20 text-forest-deep focus:bg-white focus:border-forest focus:ring-2 focus:ring-forest/15"
          placeholder={t.PassportPlaceholder}
        />
      </div>
    </div>
  );
}
