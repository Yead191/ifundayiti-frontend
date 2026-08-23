"use client";

import { useFormContext } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function StepGrant() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-4 items-end">
        <div className="sm:col-span-3">
          <Label htmlFor="projectName" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-forest">
            Business / Project Name *
          </Label>
          <Input
            id="projectName"
            {...register("projectName")}
            className="h-12 rounded-xl border-hairline bg-sand-soft/20 text-forest-deep focus:bg-white focus:border-forest focus:ring-2 focus:ring-forest/15"
            placeholder="e.g. Cap-Haïtien Solar Kiosk"
          />
          {errors.projectName && (
            <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.projectName.message as string}</span>
            </p>
          )}
        </div>

        <div className="sm:col-span-1">
          <Label htmlFor="requestedAmount" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-forest">
            Requested ($) *
          </Label>
          <Input
            id="requestedAmount"
            type="number"
            {...register("requestedAmount", { valueAsNumber: true })}
            className="h-12 rounded-xl border-hairline bg-sand-soft/20 text-forest-deep focus:bg-white focus:border-forest focus:ring-2 focus:ring-forest/15"
          />
        </div>
        {errors.requestedAmount && (
          <p className="col-span-full mt-1 flex items-center gap-1 text-xs font-medium text-red-600">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.requestedAmount.message as string}</span>
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="projectDescription" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-forest">
          Project Description & Story *
        </Label>
        <Textarea
          id="projectDescription"
          {...register("projectDescription")}
          rows={3}
          className="rounded-xl border-hairline bg-sand-soft/20 p-3.5 text-sm text-forest-deep focus:bg-white focus:border-forest focus:ring-2 focus:ring-forest/15"
          placeholder="Explain what your business is and the story behind it..."
        />
        {errors.projectDescription && (
          <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.projectDescription.message as string}</span>
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="fundUsage" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-forest">
          How the money will be used *
        </Label>
        <Textarea
          id="fundUsage"
          {...register("fundUsage")}
          rows={3}
          className="rounded-xl border-hairline bg-sand-soft/20 p-3.5 text-sm text-forest-deep focus:bg-white focus:border-forest focus:ring-2 focus:ring-forest/15"
          placeholder="Detailed breakdown: e.g. solar panels, battery, cables..."
        />
        {errors.fundUsage && (
          <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.fundUsage.message as string}</span>
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="expectedImpact" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-forest">
          Expected Community Impact *
        </Label>
        <Textarea
          id="expectedImpact"
          {...register("expectedImpact")}
          rows={3}
          className="rounded-xl border-hairline bg-sand-soft/20 p-3.5 text-sm text-forest-deep focus:bg-white focus:border-forest focus:ring-2 focus:ring-forest/15"
          placeholder="How will this support your neighbors or city?..."
        />
        {errors.expectedImpact && (
          <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.expectedImpact.message as string}</span>
          </p>
        )}
      </div>
    </div>
  );
}
