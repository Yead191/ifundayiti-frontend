"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

import { getImageUrl } from "@/lib/getImageUrl";
import type { VendorProfile } from "@/types";
import {
  changePassword,
  updateUserProfile,
} from "@/helpers/next-fetch/profileActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardPanel } from "@/features/dashboard/ui";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function isVendorRole(role?: string) {
  const r = (role ?? "").toLowerCase();
  return r === "vendor" || r === "expert";
}

type ProfileUser = {
  name?: string;
  email?: string;
  image?: string;
  company?: string;
  interest?: string;
  contact?: string;
  contactNo?: string;
  role?: string;
  vendorProfile?: Partial<VendorProfile> | null;
};

export function ProfileForms({
  user,
  dict,
  lang = "en",
}: {
  user: ProfileUser;
  dict?: any;
  lang?: string;
}) {
  const router = useRouter();
  const t = dict?.ProfilePage || {};
  const vendor = isVendorRole(user.role);
  const vp = user.vendorProfile ?? {};

  const [name, setName] = React.useState(user.name ?? "");
  const [contact, setContact] = React.useState(
    user.contact ?? user.contactNo ?? vp.contactNo ?? "",
  );
  const [jobTitle, setJobTitle] = React.useState(vp.jobTitle ?? "");

  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | undefined>(
    getImageUrl(user.image || ""),
  );
  const [savingProfile, setSavingProfile] = React.useState(false);

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [savingPassword, setSavingPassword] = React.useState(false);

  React.useEffect(() => {
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (vendor) {
      if (!jobTitle.trim()) {
        toast.error(t.JobTitleRequired || "Job title is required.", { id: "profile" });
        return;
      }
      if (!contact.trim()) {
        toast.error(t.ContactRequired || "Contact number is required.", { id: "profile" });
        return;
      }
    }

    setSavingProfile(true);
    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      if (imageFile) fd.append("image", imageFile);

      if (vendor) {
        const vendorProfile: Partial<VendorProfile> = {
          ...vp,
          jobTitle: jobTitle.trim(),
          contactNo: contact.trim(),
        };
        fd.append("vendorProfile", JSON.stringify(vendorProfile));
      } else {
        if (contact.trim()) fd.append("contact", contact.trim());
      }

      const res = await updateUserProfile(fd);
      if (!res.success) {
        if (res?.error && Array.isArray(res.error)) {
          res.error.forEach((err: { message: string }) => {
            toast.error(err.message, { id: "profile" });
          });
        } else {
          toast.error(res.message || t.ProfileUpdateError || "Could not update profile.", {
            id: "profile",
          });
        }
        return;
      }
      toast.success(t.ProfileUpdated || "Profile updated", { id: "profile" });
      setImageFile(null);
      router.refresh();
    } catch {
      toast.error(t.NetworkError || "Network error. Please try again.", { id: "profile" });
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error(t.PasswordMinLength || "New password must be at least 8 characters.", {
        id: "password",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t.PasswordsDoNotMatch || "New passwords do not match.", { id: "password" });
      return;
    }

    setSavingPassword(true);
    try {
      const res = await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      if (!res.success) {
        toast.error(res.message || t.PasswordUpdateError || "Could not change password.", {
          id: "password",
        });
        return;
      }
      toast.success(t.PasswordUpdated || "Password updated", { id: "password" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error(t.NetworkError || "Network error. Please try again.", { id: "password" });
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <DashboardPanel
        title={vendor ? t.ExpertPanelTitle || "Expert profile" : t.PanelTitle || "Profile information"}
        description={
          vendor
            ? t.ExpertPanelDesc || "Update the details members see on your public expert profile."
            : t.PanelDesc || "Update your personal details and how you appear across IFundAyiti."
        }
      >
        <form onSubmit={handleProfileSubmit} className="space-y-8">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div className="relative">
              <Avatar className="h-20 w-20 border border-hairline-strong">
                <AvatarImage src={preview} alt={name || "Profile"} />
                <AvatarFallback>{initials(name || "U")}</AvatarFallback>
              </Avatar>
              <label className="absolute -bottom-1 -right-1 grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-brand-gradient text-white shadow-lg">
                <Camera className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>
            <div>
              <p className="text-sm font-medium text-cloud">{t.PhotoTitle || "Profile photo"}</p>
              <p className="mt-1 text-xs text-mist">
                {t.PhotoHint || "JPG or PNG. A square image looks best."}
              </p>
            </div>
          </div>

          {/* Shared identity fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">{t.FullName || "Full name"}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-hairline bg-ink/50"
                placeholder={t.FullNamePlaceholder || "Your full name"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t.Email || "Email"}</Label>
              <Input
                id="email"
                value={user.email ?? ""}
                disabled
                className="border-hairline bg-ink/50 opacity-70"
              />
            </div>
            <div className={`space-y-2 ${!vendor ? "sm:col-span-2" : ""}`}>
              <Label htmlFor="contact">{t.ContactNumber || "Contact number"}</Label>
              <Input
                id="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="border-hairline bg-ink/50"
                placeholder={t.ContactPlaceholder || "Phone number"}
                required={vendor}
              />
            </div>

            {vendor && (
              <div className="space-y-2">
                <Label htmlFor="jobTitle">{t.JobTitle || "Job title"}</Label>
                <Input
                  id="jobTitle"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="border-hairline bg-ink/50"
                  placeholder={t.JobTitlePlaceholder || "e.g. Growth Advisor"}
                  required
                />
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={savingProfile}>
              {savingProfile ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> {t.Saving || "Saving…"}
                </>
              ) : (
                t.SaveProfile || "Save profile"
              )}
            </Button>
          </div>
        </form>
      </DashboardPanel>

      <DashboardPanel
        title={t.ChangePasswordTitle || "Change password"}
        description={t.ChangePasswordDesc || "Use a strong password you don't reuse elsewhere."}
      >
        <form
          id="password"
          onSubmit={handlePasswordSubmit}
          className="scroll-mt-32 space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="currentPassword">{t.CurrentPassword || "Current password"}</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="border-hairline bg-ink/50"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="newPassword">{t.NewPassword || "New password"}</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="border-hairline bg-ink/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t.ConfirmPassword || "Confirm new password"}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="border-hairline bg-ink/50"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={savingPassword}>
              {savingPassword ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> {t.UpdatingPassword || "Updating…"}
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" /> {t.UpdatePassword || "Update password"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DashboardPanel>
    </div>
  );
}
