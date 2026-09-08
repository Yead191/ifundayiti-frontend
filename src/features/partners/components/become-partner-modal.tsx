"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  UploadCloud,
  CheckCircle2,
  Building2,
  Lock,
  Plus,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "sonner";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { applyPartner } from "@/helpers/next-fetch/partnerActions";

interface BecomePartnerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lang?: string;
  dict?: any;
}

export function BecomePartnerModal({
  open,
  onOpenChange,
  lang = "en",
  dict,
}: BecomePartnerModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [hasToken, setHasToken] = React.useState(true);

  // Form State
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [selectedOffers, setSelectedOffers] = React.useState<string[]>([
    "Community Outreach",
  ]);
  const [customOfferInput, setCustomOfferInput] = React.useState("");
  const [logoFile, setLogoFile] = React.useState<File | null>(null);
  const [logoPreview, setLogoPreview] = React.useState<string | null>(null);

  const tModal = dict?.PartnersPage?.Modal || {};

  // Check auth state whenever modal opens
  React.useEffect(() => {
    if (open) {
      const token = Cookies.get("accessToken");
      setHasToken(Boolean(token));
      setIsSuccess(false);
    }
  }, [open]);

  // Clean up object url preview on unmount or replace
  React.useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [logoPreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Logo file size must be less than 5MB");
      return;
    }

    setLogoFile(file);
    const url = URL.createObjectURL(file);
    setLogoPreview(url);
  };

  const toggleOffer = (offer: string) => {
    setSelectedOffers((prev) =>
      prev.includes(offer) ? prev.filter((o) => o !== offer) : [...prev, offer]
    );
  };

  const handleAddCustomOffer = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();
    const trimmed = customOfferInput.trim();
    if (!trimmed) return;
    if (!selectedOffers.includes(trimmed)) {
      setSelectedOffers((prev) => [...prev, trimmed]);
    }
    setCustomOfferInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasToken) {
      toast.error("Please sign in to submit a partnership application.");
      return;
    }

    if (!name.trim()) {
      toast.error("Organization name is required");
      return;
    }

    if (!logoFile) {
      toast.error("Please upload your organization logo");
      return;
    }

    if (!email.trim()) {
      toast.error("Contact email is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("image", logoFile);
      formData.append("contactEmail", email.trim());
      if (phone.trim()) formData.append("contactPhone", phone.trim());
      if (website.trim()) formData.append("website", website.trim());
      if (description.trim()) formData.append("description", description.trim());

      // Send offers as JSON string array to match backend parser
      formData.append("offers", JSON.stringify(selectedOffers));

      const res = await applyPartner(formData);

      if (res.success) {
        setIsSuccess(true);
        toast.success(
          tModal.SuccessTitle || "Partner application submitted successfully!"
        );
      } else {
        toast.error(res.message || res.error || "Failed to submit application");
      }
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const presetOffers = [
    "Community Outreach",
    "Co-marketing",
    "Event Sponsorship",
    "Mentorship",
    "Grants Co-funding",
    "Technology & Tools",
    "Training & Workshops",
  ];

  return (
    <Modal
      open={open}
      onClose={() => {
        if (!isSubmitting) onOpenChange(false);
      }}
      hideCloseButton={true}
      className="max-w-2xl overflow-hidden p-0"
    >
      <div className="relative max-h-[88vh] overflow-y-auto p-6 sm:p-8">
        {/* Close Button */}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-xl p-2 text-mist hover:bg-sand-soft hover:text-forest-deep focus:outline-none"
        >
          <X className="h-5 w-5" />
        </button>

        {!hasToken ? (
          /* Auth Guard View */
          <div className="py-6 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-forest/10 text-forest">
              <Lock className="h-6 w-6" />
            </span>
            <h3 className="mt-4 font-display text-xl font-bold text-forest-deep">
              {tModal.AuthRequiredTitle || "Sign In Required"}
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-mist">
              {tModal.AuthRequiredMessage ||
                "Please sign in or create an account to submit an official partnership application with IFundAyiti."}
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild className="rounded-xl bg-forest text-white">
                <Link href={`/${lang}/auth/login?redirect=/${lang}/partners`}>
                  Sign In to Continue
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-xl border-forest/20 text-forest-deep"
              >
                <Link href={`/${lang}/auth/join?redirect=/${lang}/partners`}>
                  Create an Account
                </Link>
              </Button>
            </div>
          </div>
        ) : isSuccess ? (
          /* Success View */
          <div className="py-8 text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="h-9 w-9" />
            </span>
            <h3 className="mt-5 font-display text-2xl font-bold text-forest-deep">
              {tModal.SuccessTitle || "Application Received!"}
            </h3>
            <p className="mx-auto mt-2.5 max-w-md text-sm leading-relaxed text-mist">
              {tModal.SuccessMessage ||
                "Thank you for applying to partner with IFundAyiti. Our executive committee will review your submission and contact you via email shortly."}
            </p>
            <div className="mt-8 flex justify-center">
              <Button
                onClick={() => onOpenChange(false)}
                className="rounded-xl bg-forest px-6 text-white"
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          /* Application Form */
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-forest/10 text-forest">
                <Building2 className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-xl font-bold text-forest-deep sm:text-2xl">
                  {tModal.Title || "Apply to Become a Partner"}
                </h3>
                <p className="text-xs text-mist">
                  {tModal.Subtitle ||
                    "Collaborate with IFundAyiti to empower Haitian entrepreneurs and small businesses."}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Organization Name */}
              <div>
                <label className="block text-xs font-bold text-forest-deep">
                  {tModal.OrgName || "Organization / Partner Name"} *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={
                    tModal.OrgNamePlaceholder || "e.g. Ayiti Innovators Alliance"
                  }
                  className="mt-1.5 h-11 w-full rounded-xl border border-hairline bg-white px-3.5 text-sm text-forest-deep placeholder:text-mist/70 focus:border-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/20"
                />
              </div>

              {/* Logo Upload Dropzone */}
              <div>
                <label className="block text-xs font-bold text-forest-deep">
                  {tModal.Logo || "Organization Logo"} *
                </label>
                <div className="mt-1.5 flex items-center gap-4">
                  {logoPreview ? (
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-hairline bg-sand-soft/40 p-2">
                      <Image
                        src={logoPreview}
                        alt="Logo preview"
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                  ) : null}

                  <label className="flex flex-1 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-forest/25 bg-sand-soft/30 px-4 py-4 text-center transition hover:border-forest/50 hover:bg-sand-soft/50">
                    <UploadCloud className="h-6 w-6 text-forest" />
                    <span className="mt-1 text-xs font-semibold text-forest-deep">
                      {logoFile ? "Change Logo File" : "Upload Logo Image"}
                    </span>
                    <span className="mt-0.5 text-[11px] text-mist">
                      {tModal.LogoHint || "PNG, JPG, or WebP up to 5MB"}
                    </span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-forest-deep">
                    {tModal.Email || "Contact Email"} *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      tModal.EmailPlaceholder || "partner@organization.org"
                    }
                    className="mt-1.5 h-11 w-full rounded-xl border border-hairline bg-white px-3.5 text-sm text-forest-deep placeholder:text-mist/70 focus:border-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest-deep">
                    {tModal.Phone || "Contact Phone (Optional)"}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={
                      tModal.PhonePlaceholder || "+1 555-019-2834"
                    }
                    className="mt-1.5 h-11 w-full rounded-xl border border-hairline bg-white px-3.5 text-sm text-forest-deep placeholder:text-mist/70 focus:border-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/20"
                  />
                </div>
              </div>

              {/* Website */}
              <div>
                <label className="block text-xs font-bold text-forest-deep">
                  {tModal.Website || "Official Website (Optional)"}
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder={
                    tModal.WebsitePlaceholder || "https://organization.org"
                  }
                  className="mt-1.5 h-11 w-full rounded-xl border border-hairline bg-white px-3.5 text-sm text-forest-deep placeholder:text-mist/70 focus:border-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/20"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-forest-deep">
                  {tModal.Description || "About Your Organization & Mission"}
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={
                    tModal.DescriptionPlaceholder ||
                    "Describe your mission, services, and how you aim to support Haitian entrepreneurs..."
                  }
                  className="mt-1.5 w-full rounded-xl border border-hairline bg-white p-3 text-sm text-forest-deep placeholder:text-mist/70 focus:border-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/20"
                />
              </div>

              {/* Partnership Scope / Offers Multi-select */}
              <div>
                <label className="block text-xs font-bold text-forest-deep">
                  {tModal.OffersLabel || "Partnership Areas / Scope"}
                </label>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {presetOffers.map((offer) => {
                    const selected = selectedOffers.includes(offer);
                    return (
                      <button
                        key={offer}
                        type="button"
                        onClick={() => toggleOffer(offer)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                          selected
                            ? "border border-forest bg-forest text-white"
                            : "border border-hairline bg-sand-soft/40 text-forest-deep hover:bg-sand-soft"
                        }`}
                      >
                        {selected ? "✓ " : "+ "}
                        {offer}
                      </button>
                    );
                  })}
                </div>

                {/* Custom offer input */}
                <div className="mt-2.5 flex gap-2">
                  <input
                    type="text"
                    value={customOfferInput}
                    onChange={(e) => setCustomOfferInput(e.target.value)}
                    onKeyDown={handleAddCustomOffer}
                    placeholder="Add custom area (e.g. Legal Advisory)..."
                    className="h-9 flex-1 rounded-lg border border-hairline bg-white px-3 text-xs text-forest-deep placeholder:text-mist/70 focus:border-forest/40 focus:outline-none"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddCustomOffer}
                    className="h-9 rounded-lg border-hairline px-3 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add
                  </Button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="mt-6 flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => onOpenChange(false)}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-forest px-5 text-white hover:bg-forest/90"
                >
                  {isSubmitting ? (
                    tModal.Submitting || "Submitting..."
                  ) : (
                    <>
                      <span>{tModal.Submit || "Submit Application"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Modal>
  );
}
