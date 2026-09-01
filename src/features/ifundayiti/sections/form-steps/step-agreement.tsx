"use client";

import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/components/providers/translation-provider";

export function StepAgreement() {
  const dict = useTranslation();
  const t = dict.ApplyPage.Step7;

  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="border border-hairline p-5 rounded-2xl bg-sand-soft/50 text-xs text-mist leading-relaxed">
        <span className="block font-semibold text-forest-deep mb-1 uppercase tracking-wide">
          {t.TermsTitle}
        </span>
        {t.TermsBody}
      </div>

      <div className="space-y-4">
        {/* Checkbox 1 */}
        <div className="flex items-start gap-3">
          <input
            id="certifyAccurate"
            type="checkbox"
            {...register("certifyAccurate")}
            className="h-4 w-4 rounded border-hairline accent-forest mt-0.5 cursor-pointer"
          />
          <Label htmlFor="certifyAccurate" className="text-xs text-forest-deep leading-normal select-none cursor-pointer">
            {t.Check1}
          </Label>
        </div>
        {errors.certifyAccurate && (
          <p className="text-xs font-medium text-red-600 pl-7">
            {errors.certifyAccurate.message as string}
          </p>
        )}

        {/* Checkbox 2 */}
        <div className="flex items-start gap-3">
          <input
            id="noGuarantee"
            type="checkbox"
            {...register("noGuarantee")}
            className="h-4 w-4 rounded border-hairline accent-forest mt-0.5 cursor-pointer"
          />
          <Label htmlFor="noGuarantee" className="text-xs text-forest-deep leading-normal select-none cursor-pointer">
            {t.Check2}
          </Label>
        </div>
        {errors.noGuarantee && (
          <p className="text-xs font-medium text-red-600 pl-7">
            {errors.noGuarantee.message as string}
          </p>
        )}

        {/* Checkbox 3 */}
        <div className="flex items-start gap-3">
          <input
            id="disqualification"
            type="checkbox"
            {...register("disqualification")}
            className="h-4 w-4 rounded border-hairline accent-forest mt-0.5 cursor-pointer"
          />
          <Label htmlFor="disqualification" className="text-xs text-forest-deep leading-normal select-none cursor-pointer">
            {t.Check3}
          </Label>
        </div>
        {errors.disqualification && (
          <p className="text-xs font-medium text-red-600 pl-7">
            {errors.disqualification.message as string}
          </p>
        )}
      </div>
    </div>
  );
}
