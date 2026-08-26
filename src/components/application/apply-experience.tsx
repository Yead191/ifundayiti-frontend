"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Check,
  CheckCircle2,
  FileText,
  HelpCircle,
  Loader2,
  Phone,
  Rocket,
  Shield,
  Sparkles,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StepPersonal } from "@/features/ifundayiti/sections/form-steps/step-personal";
import { StepContact } from "@/features/ifundayiti/sections/form-steps/step-contact";
import { StepId } from "@/features/ifundayiti/sections/form-steps/step-id";
import { StepGrant } from "@/features/ifundayiti/sections/form-steps/step-grant";
import { StepDocuments } from "@/features/ifundayiti/sections/form-steps/step-documents";
import { StepBackground } from "@/features/ifundayiti/sections/form-steps/step-background";
import { StepAgreement } from "@/features/ifundayiti/sections/form-steps/step-agreement";
import {
  personalSchema,
  contactSchema,
  idSchema,
  grantSchema,
  backgroundSchema,
  agreementSchema,
} from "@/lib/ifundayiti-schemas";
import { CURRENT_PERIOD } from "@/data/grant";
import {
  INITIAL_APPLICANTS,
  type IFundApplicant,
} from "@/features/ifundayiti/data/mock-data";

const STEPS = [
  { id: 1, label: "Personal & Photo", icon: User, desc: "Basic details & photo" },
  { id: 2, label: "Contact Info", icon: Phone, desc: "Email & phone" },
  { id: 3, label: "Identification", icon: Shield, desc: "National ID / NIF" },
  { id: 4, label: "Project & Grant", icon: Rocket, desc: "Project & fund usage" },
  { id: 5, label: "Background", icon: Briefcase, desc: "Occupation & history" },
  { id: 6, label: "Documents", icon: FileText, desc: "ID & address uploads" },
  { id: 7, label: "Review & Submit", icon: CheckCircle2, desc: "Final agreement" },
];

type FileMock = { name: string; size?: string };

export function ApplyExperience() {
  const [step, setStep] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [trackingCode, setTrackingCode] = React.useState("");

  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [govIdFile, setGovIdFile] = React.useState<File | null>(null);
  const [proofAddrFile, setProofAddrFile] = React.useState<File | null>(null);
  const [businessPlanFile, setBusinessPlanFile] = React.useState<File | null>(null);
  const [supportingDocs, setSupportingDocs] = React.useState<File[]>([]);
  const [fileError, setFileError] = React.useState("");
  const [submitError, setSubmitError] = React.useState("");

  const personalForm = useForm({
    resolver: zodResolver(personalSchema),
    defaultValues: { name: "", dob: "", nationality: "Haitian", location: "", photoUrl: "" },
  });
  const contactForm = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { email: "", phone: "" },
  });
  const idForm = useForm({
    resolver: zodResolver(idSchema),
    defaultValues: { nationalId: "", passport: "" },
  });
  const grantForm = useForm({
    resolver: zodResolver(grantSchema),
    defaultValues: {
      projectName: "",
      projectDescription: "",
      requestedAmount: 1000,
      fundUsage: "",
      expectedImpact: "",
    },
  });
  const backgroundForm = useForm({
    resolver: zodResolver(backgroundSchema),
    defaultValues: { occupation: "", financialBackground: "" },
  });
  const agreementForm = useForm({
    resolver: zodResolver(agreementSchema),
    defaultValues: {
      certifyAccurate: undefined,
      noGuarantee: undefined,
      disqualification: undefined,
    } as never,
  });

  const isOpen = CURRENT_PERIOD.status === "Open";
  const currentProgress = Math.round((step / 7) * 100);

  async function handleNext() {
    let valid = false;
    if (step === 1) valid = await personalForm.trigger();
    else if (step === 2) valid = await contactForm.trigger();
    else if (step === 3) valid = await idForm.trigger();
    else if (step === 4) valid = await grantForm.trigger();
    else if (step === 5) valid = await backgroundForm.trigger();
    else if (step === 6) {
      if (!govIdFile || !proofAddrFile) {
        setFileError("Government ID and proof of address are required.");
        return;
      }
      setFileError("");
      valid = true;
    } else if (step === 7) valid = await agreementForm.trigger();

    if (valid) {
      setStep((s) => Math.min(7, s + 1));
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  }

  async function handleSubmit() {
    const ok = await agreementForm.trigger();
    if (!ok) return;
    setLoading(true);
    setSubmitError("");

    const personal = personalForm.getValues();
    const contact = contactForm.getValues();
    const id = idForm.getValues();
    const grant = grantForm.getValues();
    const background = backgroundForm.getValues();

    const formData = new FormData();
    // Use proper destructuring since photoUrl isn't sent in personal JSON
    const { photoUrl, ...personalData } = personal;

    formData.append("personal", JSON.stringify(personalData));
    formData.append("contact", JSON.stringify(contact));
    formData.append("identification", JSON.stringify(id));
    formData.append("grant", JSON.stringify(grant));
    formData.append("background", JSON.stringify(background));

    if (govIdFile) formData.append("nid_card", govIdFile);
    if (proofAddrFile) formData.append("proof_of_address", proofAddrFile);
    if (businessPlanFile) formData.append("business_plan", businessPlanFile);
    if (imageFile) formData.append("image", imageFile);

    supportingDocs.forEach((doc) => {
      formData.append("supporting_documents", doc);
    });

    try {
      const { submitApplication } = await import("@/helpers/next-fetch/applicationActions");
      const res = await submitApplication(formData);

      if (res.success && res.data) {
        setTrackingCode(res.data.id || "IFA-SUBMITTED");
        setSubmitted(true);
      } else {
        setSubmitError(res.error || res.message || "Failed to submit application.");
      }
    } catch (err: any) {
      setSubmitError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <div className="rounded-3xl border border-hairline bg-white p-10 text-center shadow-xs">
        <h2 className="font-display text-2xl font-semibold text-forest-deep">
          Applications are currently closed
        </h2>
        <p className="mt-3 text-sm text-mist max-w-md mx-auto">
          There is currently no active open grant cycle. Check the Grants page to view upcoming funding dates.
        </p>
        <Button asChild className="mt-6 rounded-xl">
          <Link href="/grants">View Grant Cycles</Link>
        </Button>
      </div>
    );
  }

  // SUBMITTED SUCCESS CONFIRMATION
  if (submitted) {
    const email = contactForm.getValues("email");
    const dob = personalForm.getValues("dob");
    const name = personalForm.getValues("name");
    const photoPreviewUrl = personalForm.getValues("photoUrl");

    return (
      <div className="rounded-3xl border border-hairline bg-white p-8 text-center shadow-lg sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-forest/10 text-forest">
          <CheckCircle2 className="h-10 w-10 text-forest" />
        </div>

        {photoPreviewUrl && (
          <div className="mt-4 flex justify-center">
            <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-forest">
              <Image src={photoPreviewUrl} alt={name} fill className="object-cover" />
            </div>
          </div>
        )}

        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-forest">
          Application Submitted
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-forest-deep sm:text-4xl">
          Good luck, {name || "Applicant"}!
        </h2>
        <p className="mt-3 text-sm text-mist max-w-md mx-auto leading-relaxed">
          Your grant application has been successfully received by our review board.
        </p>

        <div className="mt-8 rounded-2xl border border-hairline bg-amber-500/10 p-5 text-left max-w-md mx-auto text-sm text-amber-950 space-y-3">
          <div className="flex items-start gap-2">
            <HelpCircle className="h-5 w-5 text-amber-600 shrink-0" />
            <p>
              <strong>Important:</strong> You will need your registered email and date of birth to track your application status later. Please keep them safe.
            </p>
          </div>
          <div className="flex justify-between border-t border-amber-500/20 pt-3 font-medium text-xs">
            <span>Registered Email</span>
            <span>{email}</span>
          </div>
          <div className="flex justify-between pt-1 font-medium text-xs">
            <span className="text-amber-900/70">Date of Birth</span>
            <span>{dob}</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild size="lg" className="rounded-xl px-8 w-full sm:w-auto shadow-md hover:shadow-lg transition-all">
            <Link href="/track-application">
              Track Application Status
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-xl px-6 w-full sm:w-auto">
            <Link href="/grants">Return to Grants</Link>
          </Button>
        </div>
      </div>
    );
  }

  const CurrentStepIcon = STEPS[step - 1].icon;

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* LEFT SIDEBAR TIMELINE TRACKER (4 COLS) */}
      <aside className="lg:col-span-4 space-y-6">
        {/* Step Progress Container */}
        <div className="rounded-3xl border border-hairline bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-hairline pb-4 mb-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-forest">
                Application Progress
              </p>
              <p className="text-sm font-semibold text-forest-deep">
                Step {step} of 7
              </p>
            </div>
            <span className="rounded-full bg-sand-soft px-3 py-1 text-xs font-bold text-forest">
              {currentProgress}%
            </span>
          </div>

          {/* Stepper Timeline List */}
          <ol className="space-y-2.5">
            {STEPS.map((s) => {
              const active = s.id === step;
              const isDone = s.id < step;
              const Icon = s.icon;

              return (
                <li
                  key={s.id}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl p-3 text-xs transition-all cursor-pointer",
                    active
                      ? "bg-forest text-white shadow-xs font-semibold"
                      : isDone
                        ? "bg-sand-soft/60 text-forest-deep font-medium"
                        : "text-mist hover:bg-sand-soft/30",
                  )}
                  onClick={() => {
                    if (isDone) setStep(s.id);
                  }}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-all",
                      active
                        ? "bg-white text-forest"
                        : isDone
                          ? "bg-forest text-white"
                          : "bg-sand-soft text-mist",
                    )}
                  >
                    {isDone ? <Check className="h-3.5 w-3.5" /> : s.id}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs">{s.label}</p>
                    <p
                      className={cn(
                        "truncate text-[10px]",
                        active ? "text-sand/80" : "text-mist",
                      )}
                    >
                      {s.desc}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Guidance Tips Card */}
        <div className="rounded-3xl border border-hairline bg-sand-soft/60 p-6 hidden lg:block">
          <div className="flex items-center gap-2 text-forest mb-2">
            <Sparkles className="h-4 w-4" />
            <h4 className="font-display text-sm font-semibold text-forest-deep">
              Tips for a Strong Application
            </h4>
          </div>
          <ul className="space-y-2 text-xs text-mist leading-relaxed list-disc pl-4">
            <li>Upload a clear profile photo & valid ID.</li>
            <li>Be specific about how the $1,000 grant will be spent.</li>
            <li>Explain the tangible community benefits of your project.</li>
          </ul>
        </div>
      </aside>

      {/* RIGHT MAIN FORM CARD (8 COLS) */}
      <main className="lg:col-span-8">
        <div className="rounded-3xl border border-hairline bg-white p-6 shadow-md sm:p-10">
          {/* Header */}
          <div className="border-b border-hairline pb-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sand-soft text-forest">
                  <CurrentStepIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-forest">
                    Step {step} of 7
                  </p>
                  <h3 className="font-display text-xl font-semibold text-forest-deep sm:text-2xl">
                    {STEPS[step - 1].label}
                  </h3>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-sand-soft">
              <div
                className="h-full bg-forest transition-all duration-300 rounded-full"
                style={{ width: `${currentProgress}%` }}
              />
            </div>
          </div>

          {/* FORM STEPS CONTENT */}
          {step === 1 && (
            <FormProvider {...personalForm}>
              <StepPersonal setImageFile={setImageFile} />
            </FormProvider>
          )}

          {step === 2 && (
            <FormProvider {...contactForm}>
              <StepContact />
            </FormProvider>
          )}

          {step === 3 && (
            <FormProvider {...idForm}>
              <StepId />
            </FormProvider>
          )}

          {step === 4 && (
            <FormProvider {...grantForm}>
              <StepGrant />
            </FormProvider>
          )}

          {step === 5 && (
            <FormProvider {...backgroundForm}>
              <StepBackground />
            </FormProvider>
          )}

          {step === 6 && (
            <StepDocuments
              govIdFile={govIdFile}
              setGovIdFile={setGovIdFile}
              proofAddrFile={proofAddrFile}
              setProofAddrFile={setProofAddrFile}
              businessPlanFile={businessPlanFile}
              setBusinessPlanFile={setBusinessPlanFile}
              supportingDocs={supportingDocs}
              setSupportingDocs={setSupportingDocs}
              fileError={fileError}
            />
          )}

          {step === 7 && (
            <FormProvider {...agreementForm}>
              <div className="space-y-6">
                {/* Photo Preview if present */}
                {personalForm.getValues("photoUrl") && (
                  <div className="flex items-center gap-4 rounded-2xl border border-hairline bg-sand-soft/40 p-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-forest">
                      <Image
                        src={personalForm.getValues("photoUrl")}
                        alt="Applicant Photo"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-forest">Applicant Profile Photo</p>
                      <p className="text-sm font-semibold text-forest-deep">
                        {personalForm.getValues("name")}
                      </p>
                    </div>
                  </div>
                )}

                <ReviewBlock
                  title="Personal Information"
                  rows={[
                    ["Full Name", personalForm.getValues("name")],
                    ["Date of Birth", personalForm.getValues("dob")],
                    ["Location", personalForm.getValues("location")],
                  ]}
                />

                <ReviewBlock
                  title="Contact & ID"
                  rows={[
                    ["Email", contactForm.getValues("email")],
                    ["Phone", contactForm.getValues("phone")],
                    ["National ID / NIF", idForm.getValues("nationalId")],
                  ]}
                />

                <ReviewBlock
                  title="Project Proposal"
                  rows={[
                    ["Project Name", grantForm.getValues("projectName")],
                    ["Requested Amount", `$${grantForm.getValues("requestedAmount")}`],
                  ]}
                />

                <StepAgreement />
              </div>
            </FormProvider>
          )}

          {/* NAV BUTTONS */}
          <div className="mt-10 flex items-center justify-between gap-4 border-t border-hairline pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              className="rounded-xl px-5"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous Step
            </Button>

            {step < 7 ? (
              <Button
                type="button"
                onClick={() => void handleNext()}
                className="rounded-xl px-6"
              >
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={loading}
                className="rounded-xl px-8 bg-forest hover:bg-forest/90 shadow-md"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Submit Grant Application <Check className="ml-1 h-4 w-4" />
                  </span>
                )}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function ReviewBlock({
  title,
  rows,
}: {
  title: string;
  rows: [string, string][];
}) {
  return (
    <div className="rounded-2xl border border-hairline bg-sand-soft/50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-forest">
        {title}
      </p>
      <dl className="mt-2 space-y-1.5 text-xs">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4">
            <dt className="text-mist">{k}</dt>
            <dd className="text-right font-semibold text-forest-deep">{v || "—"}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
