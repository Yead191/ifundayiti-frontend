"use client";

import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";

export function StepAgreement() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="border border-hairline p-5 rounded-2xl bg-sand-soft/50 text-xs text-mist leading-relaxed">
        <span className="block font-semibold text-forest-deep mb-1 uppercase tracking-wide">
          Declarations & Terms
        </span>
        By submitting this application, you confirm that all information provided is accurate and truthful to the best of your knowledge. Selections are conducted by our reviewing committee based on merit, project viability, and community impact.
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
            I certify that all information provided in this application is accurate and matches my official documentation.
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
            I understand that submitting an application does not guarantee selection for funding.
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
            I understand that providing false or misleading details will result in immediate disqualification.
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
