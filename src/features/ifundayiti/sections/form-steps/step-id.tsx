"use client";

import { useFormContext } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function StepId() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="nationalId" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-forest">
          National Identification ID (CIN / NIF) *
        </Label>
        <Input
          id="nationalId"
          {...register("nationalId")}
          className="h-12 rounded-xl border-hairline bg-sand-soft/20 text-forest-deep focus:bg-white focus:border-forest focus:ring-2 focus:ring-forest/15"
          placeholder="e.g. 01-01-99-1994-04-00101"
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
          Passport Number <span className="font-normal text-mist">(Optional)</span>
        </Label>
        <Input
          id="passport"
          {...register("passport")}
          className="h-12 rounded-xl border-hairline bg-sand-soft/20 text-forest-deep focus:bg-white focus:border-forest focus:ring-2 focus:ring-forest/15"
          placeholder="e.g. HH123456"
        />
      </div>
    </div>
  );
}
