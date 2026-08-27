"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, CheckCircle2, Upload, MapPin, Linkedin, Twitter, Sparkles, HeartHandshake, Phone, Mail, User } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckboxCard } from "@/components/ui/checkbox-card";
import { applyAsVolunteer } from "@/helpers/next-fetch/teamActions";

const VOLUNTEER_FOCUS_AREAS = [
  "Local Vetting & Auditing",
  "Kreyòl Translation",
  "Regional Outreach",
  "Tech & Development",
  "Visual Storytelling",
  "Logistics & Events",
];

export default function BecomeAVolunteerPage() {
  const [formData, setFormData] = useState({
    name: "",
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFocusToggle = (area: string) => {
    setSelectedFocus((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
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
    if (!formData.name || !formData.email || !formData.phone || !formData.location || !formData.bio) {
      setError("Please fill out all required fields.");
      return;
    }
    if (!imageFile) {
      setError("Please upload your profile picture.");
      return;
    }

    setLoading(true);

    const submissionForm = new FormData();
    submissionForm.append("name", formData.name);
    submissionForm.append("email", formData.email);
    submissionForm.append("phone", formData.phone);
    submissionForm.append("location", formData.location);
    submissionForm.append("bio", formData.bio);
    if (formData.linkedin) submissionForm.append("linkedin", formData.linkedin);
    if (formData.twitter) submissionForm.append("twitter", formData.twitter);
    submissionForm.append("image", imageFile);

    // Append focus areas (each array element is appended separately for Nest.js/Express array parser)
    selectedFocus.forEach((area) => {
      submissionForm.append("focusAreas", area);
    });

    const res = await applyAsVolunteer(submissionForm);
    setLoading(false);

    if (res.success) {
      setSubmittedData({
        name: formData.name,
        email: formData.email,
        location: formData.location,
        focusAreas: selectedFocus,
      });
      setSuccess(true);
    } else {
      setError(res.message || "Failed to submit application. Please try again.");
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
              Application Received!
            </h1>
            <p className="text-mist text-lg max-w-md mb-8 relative z-10">
              Mèsi anpil! Thank you for applying to be a part of the IFundAyiti volunteer force.
            </p>

            {/* Glassmorphic Details Card */}
            <div className="w-full bg-sand-soft/30 border border-hairline rounded-3xl p-6 mb-8 text-left relative z-10 backdrop-blur-md">
              <h3 className="font-display text-lg font-bold text-forest-deep mb-4">Application Details</h3>
              <div className="grid gap-3 text-sm text-mist">
                <div>
                  <span className="font-semibold text-forest">Name:</span> {submittedData?.name}
                </div>
                <div>
                  <span className="font-semibold text-forest">Email:</span> {submittedData?.email}
                </div>
                <div>
                  <span className="font-semibold text-forest">Location:</span> {submittedData?.location}
                </div>
                {submittedData?.focusAreas.length > 0 && (
                  <div>
                    <span className="font-semibold text-forest">Focus Areas:</span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {submittedData?.focusAreas.map((area: string, index: number) => (
                        <span key={index} className="px-2.5 py-1 text-xs bg-forest/10 rounded-lg text-forest font-semibold">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Next Steps List */}
            <div className="w-full text-left mb-8 relative z-10">
              <h4 className="font-semibold text-forest-deep mb-3 uppercase tracking-wider text-xs">What Happens Next?</h4>
              <ul className="space-y-3.5">
                <li className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-forest/10 text-forest text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</div>
                  <p className="text-sm text-mist">Our team will review your application profile within 2-3 business days.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-forest/10 text-forest text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</div>
                  <p className="text-sm text-mist">We will send a welcome email containing onboarding details and a Slack invitation link.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-forest/10 text-forest text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</div>
                  <p className="text-sm text-mist">You will be matched with local project verifications or translation tasks based on your focus areas.</p>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full relative z-10">
              <Button asChild size="lg" className="rounded-xl w-full">
                <Link href="/team">
                  Back to Team Page
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-xl w-full">
                <Link href="/">
                  Return Home
                </Link>
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
        <div className="aurora -top-24 left-1/4 h-[500px] w-[500px] opacity-20" />
      </div>

      <Container className="max-w-3xl">
        <div className="mb-8">
          <Link href="/team" className="inline-flex items-center gap-2 text-sm font-semibold text-forest hover:text-forest-bright mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to Team
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full border border-forest/15 bg-white/80 px-4 py-1.5 shadow-sm mb-4">
            <HeartHandshake className="h-4 w-4 text-forest" />
            <span className="eyebrow text-[10px] tracking-wider text-forest font-bold">
              Volunteer Force
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-forest-deep leading-tight">
            Apply to Join our Community Force
          </h1>
          <p className="mt-3 text-mist text-lg leading-relaxed">
            Help verify grant applicants, translate project proposals, and connect local Haitian entrepreneurs with the resources they need.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-hairline rounded-4xl p-8 md:p-12 shadow-xl space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3.5 rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* Personal Info Grid */}
          <div className="space-y-6">
            <h3 className="font-display text-lg font-bold text-forest-deep border-b border-hairline pb-2 flex items-center gap-2">
              <User className="h-5 w-5 text-forest" /> Personal Details
            </h3>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="e.g. Jean-Pierre"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="rounded-xl h-11 border-hairline-strong bg-sand-soft/10 text-forest-deep"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="e.g. jean@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="rounded-xl h-11 border-hairline-strong bg-sand-soft/10 text-forest-deep"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                <Input
                  id="phone"
                  name="phone"
                  required
                  placeholder="e.g. +509 0000 0000"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="rounded-xl h-11 border-hairline-strong bg-sand-soft/10 text-forest-deep"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location (City, Country) <span className="text-red-500">*</span></Label>
                <Input
                  id="location"
                  name="location"
                  required
                  placeholder="e.g. Cap-Haïtien, Haiti"
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
              <Sparkles className="h-5 w-5 text-forest" /> Professional Profiles
            </h3>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="linkedin" className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4 text-forest" /> LinkedIn Link
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
                  <Twitter className="h-4 w-4 text-forest" /> Twitter Link
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
              <HeartHandshake className="h-5 w-5 text-forest" /> Select Focus Areas
            </h3>
            <p className="text-xs text-mist">
              Choose the categories where you would like to contribute your skills. Select all that apply.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {VOLUNTEER_FOCUS_AREAS.map((area) => (
                <CheckboxCard
                  key={area}
                  label={area}
                  checked={selectedFocus.includes(area)}
                  onToggle={() => handleFocusToggle(area)}
                />
              ))}
            </div>
          </div>

          {/* Bio / Experience */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-bold text-forest-deep border-b border-hairline pb-2 flex items-center gap-2">
              <Mail className="h-5 w-5 text-forest" /> Tell Us About Yourself <span className="text-red-500">*</span>
            </h3>
            <div className="space-y-2">
              <Label htmlFor="bio">Your Background & Motivation</Label>
              <Textarea
                id="bio"
                name="bio"
                required
                rows={4}
                placeholder="Share your experience and why you want to support Haitian community micro-grants..."
                value={formData.bio}
                onChange={handleInputChange}
                className="rounded-xl border-hairline-strong bg-sand-soft/10 text-forest-deep"
              />
            </div>
          </div>

          {/* Profile Picture Uploader */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-bold text-forest-deep border-b border-hairline pb-2 flex items-center gap-2">
              <Upload className="h-5 w-5 text-forest" /> Profile Picture <span className="text-red-500">*</span>
            </h3>
            <p className="text-xs text-mist">
              Please upload a clear portrait image. This image will be shown on the team board once approved.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 border border-dashed border-hairline-strong rounded-2xl bg-sand-soft/10">
              <div className="relative h-28 w-28 rounded-2xl border border-hairline bg-white overflow-hidden shrink-0 shadow-inner flex items-center justify-center text-mist">
                {imagePreview ? (
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
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
                  className="rounded-xl border-forest/20"
                  onClick={() => document.getElementById("imageUpload")?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" /> Upload Photo
                </Button>
                {imageFile && (
                  <p className="mt-2 text-xs font-medium text-forest">
                    Selected: {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
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
              className="w-full rounded-xl bg-brand-gradient shadow-lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Submitting Application...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Submit Volunteer Application <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </div>
        </form>
      </Container>
    </div>
  );
}
