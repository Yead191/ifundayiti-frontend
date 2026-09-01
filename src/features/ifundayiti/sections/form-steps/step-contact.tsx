"use client";

import { useFormContext } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/components/providers/translation-provider";

export function StepContact() {
  const dict = useTranslation();
  const t = dict.ApplyPage.Step2;

  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-forest">
          {t.EmailLabel}
        </Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          className="h-12 rounded-xl border-hairline bg-sand-soft/20 text-forest-deep focus:bg-white focus:border-forest focus:ring-2 focus:ring-forest/15"
          placeholder={t.EmailPlaceholder}
        />
        {errors.email && (
          <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.email.message as string}</span>
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="phone" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-forest">
          {t.PhoneLabel}
        </Label>
        <Input
          id="phone"
          {...register("phone")}
          className="h-12 rounded-xl border-hairline bg-sand-soft/20 text-forest-deep focus:bg-white focus:border-forest focus:ring-2 focus:ring-forest/15"
          placeholder={t.PhonePlaceholder}
        />
        {errors.phone && (
          <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.phone.message as string}</span>
          </p>
        )}
      </div>
    </div>
  );
}
