"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Upload,
  Linkedin,
  Twitter,
  Sparkles,
  HeartHandshake,
  Mail,
  User,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckboxCard } from "@/components/ui/checkbox-card";
import { applyAsVolunteer } from "@/helpers/next-fetch/teamActions";
import { useTranslation } from "@/components/providers/translation-provider";

export default function BecomeAVolunteerPage() {
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const dict = useTranslation();
  const t = dict.VolunteerPage;

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    linkedin: "",
    twitter: "",
  });
  const [selectedFocus, setSelectedFocus] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<any | null>(null);

  const focusOptions = React.useMemo(
    () => [
      { id: "vetting", label: t.Focus.Areas.Vetting },
      { id: "translation", label: t.Focus.Areas.Translation },
      { id: "outreach", label: t.Focus.Areas.Outreach },
      { id: "tech", label: t.Focus.Areas.Tech },
      { id: "storytelling", label: t.Focus.Areas.Storytelling },
      { id: "logistics", label: t.Focus.Areas.Logistics },
    ],
    [t],
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFocusToggle = (areaLabel: string) => {
    setSelectedFocus((prev) =>
      prev.includes(areaLabel)
        ? prev.filter((a) => a !== areaLabel)
        : [...prev, areaLabel],
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.location ||
      !formData.bio
    ) {
      setError(t.Errors.Required);
      return;
    }
    if (!imageFile) {
      setError(t.Errors.Photo);
      return;
    }

    setLoading(true);

    const submissionForm = new FormData();
    submissionForm.append("name", formData.name);
    if (formData.title.trim()) {
      submissionForm.append("title", formData.title.trim());
    }
    submissionForm.append("email", formData.email);
    submissionForm.append("phone", formData.phone);
    submissionForm.append("location", formData.location);
    submissionForm.append("bio", formData.bio);
    if (formData.linkedin) submissionForm.append("linkedin", formData.linkedin);
    if (formData.twitter) submissionForm.append("twitter", formData.twitter);
    submissionForm.append("image", imageFile);

    // Append focus areas
    selectedFocus.forEach((area) => {
      submissionForm.append("focusAreas", area);
    });

    const res = await applyAsVolunteer(submissionForm);
    setLoading(false);

    if (res.success) {
      setSubmittedData({
        name: formData.name,
        title: formData.title.trim(),
        email: formData.email,
        location: formData.location,
        focusAreas: selectedFocus,
      });
      setSuccess(true);
    } else {
      setError(res.message || t.Errors.Failed);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-sand-soft/10 py-20 flex items-center">
        <Container className="max-w-2xl">
          <div className="relative overflow-hidden rounded-4xl border border-hairline bg-white p-8 md:p-14 shadow-2xl text-center flex flex-col items-center">
            {/* Aurora Backgrounds */}
            <div className="aurora -top-20 -left-20 h-80 w-80 opacity-30" />
            <div className="aurora -bottom-20 -right-20 h-80 w-80 opacity-20" />

            {/* Checkmark Animation Icon */}
            <div className="h-20 w-20 rounded-3xl bg-forest/10 flex items-center justify-center text-forest mb-8 relative z-10 animate-bounce">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <h1 className="font-display text-4xl md:text-5xl font-bold text-forest-deep mb-4 relative z-10">
              {t.Success.Title}
            </h1>
            <p className="text-mist text-lg max-w-md mb-8 relative z-10">
              {t.Success.Message}
            </p>

            {/* Glassmorphic Details Card */}
            <div className="w-full bg-sand-soft/30 border border-hairline rounded-3xl p-6 mb-8 text-left relative z-10 backdrop-blur-md">
              <h3 className="font-display text-lg font-bold text-forest-deep mb-4">
                {t.Success.DetailsHeading}
              </h3>
              <div className="grid gap-3 text-sm text-mist">
                <div>
                  <span className="font-semibold text-forest">
                    {t.Success.Name}
                  </span>{" "}
                  {submittedData?.name}
                </div>
                {submittedData?.title && (
                  <div>
                    <span className="font-semibold text-forest">
                      {t.Success.Title}
                    </span>{" "}
                    {submittedData?.title}
                  </div>
                )}
                <div>
                  <span className="font-semibold text-forest">
                    {t.Success.Email}
                  </span>{" "}
                  {submittedData?.email}
                </div>
                <div>
                  <span className="font-semibold text-forest">
                    {t.Success.Location}
                  </span>{" "}
                  {submittedData?.location}
                </div>
                {submittedData?.focusAreas.length > 0 && (
                  <div>
                    <span className="font-semibold text-forest">
                      {t.Success.FocusAreas}
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {submittedData?.focusAreas.map(
                        (area: string, index: number) => (
                          <span
                            key={index}
                            className="px-2.5 py-1 text-xs bg-forest/10 rounded-lg text-forest font-semibold"
                          >
                            {area}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Next Steps List */}
            <div className="w-full text-left mb-8 relative z-10">
              <h4 className="font-semibold text-forest-deep mb-3 uppercase tracking-wider text-xs">
                {t.Success.NextHeading}
              </h4>
              <ul className="space-y-3.5">
                <li className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-forest/10 text-forest text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <p className="text-sm text-mist">{t.Success.Step1}</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-forest/10 text-forest text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <p className="text-sm text-mist">{t.Success.Step2}</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-forest/10 text-forest text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <p className="text-sm text-mist">{t.Success.Step3}</p>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full relative z-10">
              <Button asChild size="lg" className="rounded-xl w-full">
                <Link href={`/${lang}/team`}>{t.Success.BackBtn}</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-xl w-full"
              >
                <Link href={`/${lang}`}>{t.Success.HomeBtn}</Link>
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-soft/10 pb-24 pt-28 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="aurora -top-24 left-1/4 h-125 w-125 opacity-20" />
      </div>

      <Container className="max-w-3xl">
        <div className="mb-8">
          <Link
            href={`/${lang}/team`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-forest hover:text-forest-bright mb-6 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> {t.BackToTeam}
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full border border-forest/15 bg-white/80 px-4 py-1.5 shadow-sm mb-4 ml-4">
            <HeartHandshake className="h-4 w-4 text-forest" />
            <span className="eyebrow text-[10px] tracking-wider text-forest font-bold">
              {t.Badge}
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-forest-deep leading-tight">
            {t.HeroTitle}
          </h1>
          <p className="mt-3 text-mist text-lg leading-relaxed">
            {t.HeroSubtitle}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-hairline rounded-4xl p-8 md:p-12 shadow-xl space-y-8"
        >
          {/* Personal Info Grid */}
          <div className="space-y-6">
            <h3 className="font-display text-lg font-bold text-forest-deep border-b border-hairline pb-2 flex items-center gap-2">
              <User className="h-5 w-5 text-forest" /> {t.Personal.Heading}
            </h3>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  {t.Personal.NameLabel} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder={t.Personal.NamePlaceholder}
                  value={formData.name}
                  onChange={handleInputChange}
                  className="rounded-xl h-11 border-hairline-strong bg-sand-soft/10 text-forest-deep"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="flex items-center justify-between"
                >
                  <span>{t.Personal.TitleLabel}</span>
                  <span className="text-[11px] text-mist font-normal">
                    ({t.Personal.OptionalBadge})
                  </span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder={t.Personal.TitlePlaceholder}
                  value={formData.title}
                  onChange={handleInputChange}
                  className="rounded-xl h-11 border-hairline-strong bg-sand-soft/10 text-forest-deep"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  {t.Personal.EmailLabel}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder={t.Personal.EmailPlaceholder}
                  value={formData.email}
                  onChange={handleInputChange}
                  className="rounded-xl h-11 border-hairline-strong bg-sand-soft/10 text-forest-deep"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  {t.Personal.PhoneLabel}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  required
                  placeholder={t.Personal.PhonePlaceholder}
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="rounded-xl h-11 border-hairline-strong bg-sand-soft/10 text-forest-deep"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="location">
                  {t.Personal.LocationLabel}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  name="location"
                  required
                  placeholder={t.Personal.LocationPlaceholder}
                  value={formData.location}
                  onChange={handleInputChange}
                  className="rounded-xl h-11 border-hairline-strong bg-sand-soft/10 text-forest-deep"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-6">
            <h3 className="font-display text-lg font-bold text-forest-deep border-b border-hairline pb-2 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-forest" /> {t.Social.Heading}
            </h3>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="linkedin" className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4 text-forest" />{" "}
                  {t.Social.LinkedinLabel}
                </Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  placeholder="https://linkedin.com/in/username"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  className="rounded-xl h-11 border-hairline-strong bg-sand-soft/10 text-forest-deep"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter" className="flex items-center gap-2">
                  <Twitter className="h-4 w-4 text-forest" />{" "}
                  {t.Social.TwitterLabel}
                </Label>
                <Input
                  id="twitter"
                  name="twitter"
                  placeholder="https://twitter.com/username"
                  value={formData.twitter}
                  onChange={handleInputChange}
                  className="rounded-xl h-11 border-hairline-strong bg-sand-soft/10 text-forest-deep"
                />
              </div>
            </div>
          </div>

          {/* Focus Areas */}
          <div className="space-y-6">
            <h3 className="font-display text-lg font-bold text-forest-deep border-b border-hairline pb-2 flex items-center gap-2">
              <HeartHandshake className="h-5 w-5 text-forest" />{" "}
              {t.Focus.Heading}
            </h3>
            <p className="text-xs text-mist">{t.Focus.Description}</p>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {focusOptions.map((area) => (
                <CheckboxCard
                  key={area.id}
                  label={area.label}
                  checked={selectedFocus.includes(area.label)}
                  onToggle={() => handleFocusToggle(area.label)}
                />
              ))}
            </div>
          </div>

          {/* Bio / Experience */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-bold text-forest-deep border-b border-hairline pb-2 flex items-center gap-2">
              <Mail className="h-5 w-5 text-forest" /> {t.Bio.Heading}{" "}
              <span className="text-red-500">*</span>
            </h3>
            <div className="space-y-2">
              <Label htmlFor="bio">{t.Bio.Label}</Label>
              <Textarea
                id="bio"
                name="bio"
                required
                rows={4}
                placeholder={t.Bio.Placeholder}
                value={formData.bio}
                onChange={handleInputChange}
                className="rounded-xl border-hairline-strong bg-sand-soft/10 text-forest-deep"
              />
            </div>
          </div>

          {/* Profile Picture Uploader */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-bold text-forest-deep border-b border-hairline pb-2 flex items-center gap-2">
              <Upload className="h-5 w-5 text-forest" /> {t.Photo.Heading}{" "}
              <span className="text-red-500">*</span>
            </h3>
            <p className="text-xs text-mist">{t.Photo.Description}</p>

            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 border border-dashed border-hairline-strong rounded-2xl bg-sand-soft/10">
              <div className="relative h-28 w-28 rounded-2xl border border-hairline bg-white overflow-hidden shrink-0 shadow-inner flex items-center justify-center text-mist">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <User className="h-10 w-10 text-faint" />
                )}
              </div>

              <div className="w-full text-center sm:text-left">
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl border-forest/20 cursor-pointer"
                  onClick={() =>
                    document.getElementById("imageUpload")?.click()
                  }
                >
                  <Upload className="mr-2 h-4 w-4" /> {t.Photo.UploadBtn}
                </Button>
                {imageFile && (
                  <p className="mt-2 text-xs font-medium text-forest">
                    {t.Photo.Selected} {imageFile.name} (
                    {(imageFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6">
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full rounded-xl bg-brand-gradient shadow-lg cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {t.Submit.Loading}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {t.Submit.Btn} <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3.5 rounded-xl font-medium">
                {error}
              </div>
            )}
          </div>
        </form>
      </Container>
    </div>
  );
}
