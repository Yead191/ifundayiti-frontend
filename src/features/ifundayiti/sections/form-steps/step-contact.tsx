"use client";

import { useFormContext } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function StepContact() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-forest">
          Email Address *
        </Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          className="h-12 rounded-xl border-hairline bg-sand-soft/20 text-forest-deep focus:bg-white focus:border-forest focus:ring-2 focus:ring-forest/15"
          placeholder="e.g. name@domain.com"
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
          Phone Number *
        </Label>
        <Input
          id="phone"
          {...register("phone")}
          className="h-12 rounded-xl border-hairline bg-sand-soft/20 text-forest-deep focus:bg-white focus:border-forest focus:ring-2 focus:ring-forest/15"
          placeholder="e.g. +509 3712-3456"
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
