"use client";

import * as React from "react";
import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { AlertCircle, Camera, Upload, User, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function StepPersonal() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const photoUrl = watch("photoUrl");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue("photoUrl", reader.result as string, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  }

  function handleRemovePhoto() {
    setValue("photoUrl", "", { shouldValidate: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-6">
      {/* PROFILE PHOTO UPLOAD SECTION */}
      <div className="rounded-2xl border border-dashed border-hairline bg-sand-soft/30 p-5 sm:p-6">
        <Label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-forest">
          Applicant Profile Photo (Recommended)
        </Label>
        <p className="mb-4 text-xs text-mist leading-relaxed">
          Upload a clear headshot or profile photo. This helps grant reviewers identify you and your team.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-5">
          {/* Avatar Preview */}
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-forest/20 bg-white shadow-xs">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt="Profile Preview"
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-sand-soft text-forest">
                <User className="h-10 w-10 text-forest/50" />
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
              className="hidden"
              id="profile-photo-input"
            />

            <div className="flex flex-wrap gap-2">
              <label
                htmlFor="profile-photo-input"
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-forest/90"
              >
                <Camera className="h-3.5 w-3.5" />
                {photoUrl ? "Change Photo" : "Upload Photo"}
              </label>

              {photoUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-hairline bg-white px-3.5 py-2.5 text-xs font-semibold text-mist hover:text-red-600 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                  Remove
                </button>
              )}
            </div>
            <span className="text-[11px] text-mist">JPEG, PNG or WebP · Max 5MB</span>
          </div>
        </div>
      </div>

      {/* FULL NAME */}
      <div>
        <Label htmlFor="name" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-forest">
          Full Name (Must match National ID) *
        </Label>
        <Input
          id="name"
          {...register("name")}
          className="h-12 rounded-xl border-hairline bg-sand-soft/20 text-forest-deep focus:bg-white focus:border-forest focus:ring-2 focus:ring-forest/15"
          placeholder="e.g. Jean-Baptiste Pierre"
        />
        {errors.name && (
          <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.name.message as string}</span>
          </p>
        )}
      </div>

      {/* DOB & NATIONALITY */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="dob" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-forest">
            Date of Birth *
          </Label>
          <Input
            id="dob"
            type="date"
            {...register("dob")}
            className="h-12 rounded-xl border-hairline bg-sand-soft/20 text-forest-deep focus:bg-white focus:border-forest focus:ring-2 focus:ring-forest/15"
          />
          {errors.dob && (
            <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.dob.message as string}</span>
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="nationality" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-forest">
            Nationality
          </Label>
          <Input
            id="nationality"
            {...register("nationality")}
            disabled
            className="h-12 rounded-xl border-hairline bg-sand-soft/40 text-mist"
          />
        </div>
      </div>

      {/* LOCATION */}
      <div>
        <Label htmlFor="location" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-forest">
          Location (Department / City / Full Address) *
        </Label>
        <Textarea
          id="location"
          {...register("location")}
          rows={3}
          className="rounded-xl border-hairline bg-sand-soft/20 p-3.5 text-sm text-forest-deep focus:bg-white focus:border-forest focus:ring-2 focus:ring-forest/15"
          placeholder="e.g. Cap-Haïtien, Rue 24 A, House #14"
        />
        {errors.location && (
          <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.location.message as string}</span>
          </p>
        )}
      </div>
    </div>
  );
}
