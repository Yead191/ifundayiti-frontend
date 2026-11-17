"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  Cloud,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StepPersonal } from "@/features/ifundayiti/sections/form-steps/step-personal";
import { StepContact } from "@/features/ifundayiti/sections/form-steps/step-contact";
import { StepId } from "@/features/ifundayiti/sections/form-steps/step-id";
import { StepGrant } from "@/features/ifundayiti/sections/form-steps/step-grant";
import { StepDocuments } from "@/features/ifundayiti/sections/form-steps/step-documents";
import { StepBackground } from "@/features/ifundayiti/sections/form-steps/step-background";
import { StepAgreement } from "@/features/ifundayiti/sections/form-steps/step-agreement";
import { CURRENT_PERIOD } from "@/data/grant";
import { useTranslation } from "@/components/providers/translation-provider";
import {
  buildApplyDraftFields,
  clearApplyDraft,
  loadApplyDraftFields,
  loadApplyDraftFiles,
  saveApplyDraftFields,
  saveApplyDraftFiles,
} from "@/lib/apply-draft";
import { toErrorMessage } from "@/lib/api-error";

function formatDraftTime(iso: string, lang: string): string {
  try {
    return new Intl.DateTimeFormat(lang === "ht" ? "ht-HT" : "en-US", {
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

export function ApplyExperience() {
  const params = useParams();
  const currentLang = (params?.lang as string) || "en";
  const dict = useTranslation();
  const t = dict.ApplyPage;

  const [step, setStep] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [, setTrackingCode] = React.useState("");

  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [govIdFile, setGovIdFile] = React.useState<File | null>(null);
  const [proofAddrFile, setProofAddrFile] = React.useState<File | null>(null);
  const [businessPlanFile, setBusinessPlanFile] = React.useState<File | null>(
    null,
  );
  const [projectGallery, setProjectGallery] = React.useState<File[]>([]);
  const [supportingDocs, setSupportingDocs] = React.useState<File[]>([]);
  const [fileError, setFileError] = React.useState("");
  const [submitError, setSubmitError] = React.useState("");
  const [draftBanner, setDraftBanner] = React.useState(false);
  const [draftSavedAt, setDraftSavedAt] = React.useState<string | null>(null);

  const submitErrorRef = React.useRef<HTMLDivElement>(null);
  const draftHydrated = React.useRef(false);

  const STEPS = React.useMemo(
    () => [
      {
        id: 1,
        label: t.Stepper.Step1Label,
        icon: User,
        desc: t.Stepper.Step1Desc,
      },
      {
        id: 2,
        label: t.Stepper.Step2Label,
        icon: Phone,
        desc: t.Stepper.Step2Desc,
      },
      {
        id: 3,
        label: t.Stepper.Step3Label,
        icon: Shield,
        desc: t.Stepper.Step3Desc,
      },
      {
        id: 4,
        label: t.Stepper.Step4Label,
        icon: Rocket,
        desc: t.Stepper.Step4Desc,
      },
      {
        id: 5,
        label: t.Stepper.Step5Label,
        icon: Briefcase,
        desc: t.Stepper.Step5Desc,
      },
      {
        id: 6,
        label: t.Stepper.Step6Label,
        icon: FileText,
        desc: t.Stepper.Step6Desc,
      },
      {
        id: 7,
        label: t.Stepper.Step7Label,
        icon: CheckCircle2,
        desc: t.Stepper.Step7Desc,
      },
    ],
    [t],
  );

  const schemas = React.useMemo(() => {
    const s1 = t.Step1;
    const s2 = t.Step2;
    const s3 = t.Step3;
    const s4 = t.Step4;
    const s5 = t.Step5;
    const s7 = t.Step7;

    return {
      personal: z.object({
        name: z.string().min(2, s1.ErrName),
        dob: z.string().min(1, s1.ErrDob),
        nationality: z.string().default("Haitian"),
        location: z.string().min(5, s1.ErrLocation),
        photoUrl: z.string().optional().or(z.literal("")),
      }),
      contact: z.object({
        email: z.string().email(s2.ErrEmail),
        phone: z.string().min(8, s2.ErrPhone),
      }),
      id: z.object({
        nationalId: z.string().min(10, s3.ErrId),
        passport: z.string().optional().or(z.literal("")),
      }),
      grant: z.object({
        projectName: z.string().min(3, s4.ErrProjectName),
        projectDescription: z.string().min(15, s4.ErrDesc),
        requestedAmount: z
          .number({ invalid_type_error: s4.ErrAmountNumber })
          .min(50, s4.ErrAmountMin)
          .max(1000, s4.ErrAmountMax),
        fundUsage: z.string().min(15, s4.ErrFundUsage),
        expectedImpact: z.string().min(15, s4.ErrImpact),
      }),
      background: z.object({
        occupation: z.string().min(2, s5.ErrOccupation),
        financialBackground: z.string().min(15, s5.ErrFinancial),
      }),
      agreement: z.object({
        certifyAccurate: z.literal(true, {
          errorMap: () => ({ message: s7.ErrCheck1 }),
        }),
        noGuarantee: z.literal(true, {
          errorMap: () => ({ message: s7.ErrCheck2 }),
        }),
        disqualification: z.literal(true, {
          errorMap: () => ({ message: s7.ErrCheck3 }),
        }),
      }),
    };
  }, [t]);

  const personalForm = useForm({
    resolver: zodResolver(schemas.personal),
    defaultValues: {
      name: "",
      dob: "",
      nationality: "Haitian",
      location: "",
      photoUrl: "",
    },
  });
  const contactForm = useForm({
    resolver: zodResolver(schemas.contact),
    defaultValues: { email: "", phone: "" },
  });
  const idForm = useForm({
    resolver: zodResolver(schemas.id),
    defaultValues: { nationalId: "", passport: "" },
  });
  const grantForm = useForm({
    resolver: zodResolver(schemas.grant),
    defaultValues: {
      projectName: "",
      projectDescription: "",
      requestedAmount: 0,
      fundUsage: "",
      expectedImpact: "",
    },
  });
  const backgroundForm = useForm({
    resolver: zodResolver(schemas.background),
    defaultValues: { occupation: "", financialBackground: "" },
  });
  const agreementForm = useForm({
    resolver: zodResolver(schemas.agreement),
    defaultValues: {
      certifyAccurate: undefined,
      noGuarantee: undefined,
      disqualification: undefined,
    } as never,
  });

  const personalValues = personalForm.watch();
  const contactValues = contactForm.watch();
  const idValues = idForm.watch();
  const grantValues = grantForm.watch();
  const backgroundValues = backgroundForm.watch();
  const agreementValues = agreementForm.watch();

  const persistDraft = React.useCallback(async () => {
    const fields = buildApplyDraftFields({
      step,
      personal: personalForm.getValues(),
      contact: contactForm.getValues(),
      identification: idForm.getValues(),
      grant: grantForm.getValues(),
      background: backgroundForm.getValues(),
      agreement: agreementForm.getValues() as {
        certifyAccurate?: boolean;
        noGuarantee?: boolean;
        disqualification?: boolean;
      },
    });
    saveApplyDraftFields(fields);
    await saveApplyDraftFiles({
      image: imageFile,
      nid_card: govIdFile,
      proof_of_address: proofAddrFile,
      business_plan: businessPlanFile,
      projectGallery,
      supporting_documents: supportingDocs,
    });
    setDraftSavedAt(fields.savedAt);
  }, [
    step,
    personalForm,
    contactForm,
    idForm,
    grantForm,
    backgroundForm,
    agreementForm,
    imageFile,
    govIdFile,
    proofAddrFile,
    businessPlanFile,
    projectGallery,
    supportingDocs,
  ]);

  // Restore draft once on mount
  React.useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      const fields = loadApplyDraftFields();
      if (!fields) {
        draftHydrated.current = true;
        return;
      }

      personalForm.reset({
        ...fields.personal,
        nationality: fields.personal.nationality || "Haitian",
        photoUrl: fields.personal.photoUrl || "",
      });
      contactForm.reset(fields.contact);
      idForm.reset({
        nationalId: fields.identification.nationalId,
        passport: fields.identification.passport || "",
      });
      grantForm.reset(fields.grant);
      backgroundForm.reset(fields.background);
      agreementForm.reset({
        certifyAccurate: fields.agreement.certifyAccurate || undefined,
        noGuarantee: fields.agreement.noGuarantee || undefined,
        disqualification: fields.agreement.disqualification || undefined,
      } as never);

      if (fields.step >= 1 && fields.step <= 7) {
        setStep(fields.step);
      }

      const files = await loadApplyDraftFiles();
      if (cancelled) return;

      if (files.image) setImageFile(files.image);
      if (files.nid_card) setGovIdFile(files.nid_card);
      if (files.proof_of_address) setProofAddrFile(files.proof_of_address);
      if (files.business_plan) setBusinessPlanFile(files.business_plan);
      if (files.projectGallery?.length) setProjectGallery(files.projectGallery);
      if (files.supporting_documents?.length) {
        setSupportingDocs(files.supporting_documents);
      }

      setDraftSavedAt(fields.savedAt);
      setDraftBanner(true);
      toast.message(t.Draft?.Restored ?? "Draft restored", {
        description:
          t.Draft?.Banner ??
          "Your previous answers were restored. Continue where you left off.",
      });
      draftHydrated.current = true;
    }

    void hydrate();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hydrate once
  }, []);

  // Autosave answers + files while drafting
  React.useEffect(() => {
    if (!draftHydrated.current || submitted) return;
    const timer = window.setTimeout(() => {
      void persistDraft();
    }, 900);
    return () => window.clearTimeout(timer);
  }, [
    step,
    personalValues,
    contactValues,
    idValues,
    grantValues,
    backgroundValues,
    agreementValues,
    imageFile,
    govIdFile,
    proofAddrFile,
    businessPlanFile,
    projectGallery,
    supportingDocs,
    submitted,
    persistDraft,
  ]);

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
        setFileError(t.Step6.ErrRequiredDocs);
        return;
      }
      setFileError("");
      valid = true;
    } else if (step === 7) valid = await agreementForm.trigger();

    if (valid) {
      setStep((s) => Math.min(7, s + 1));
      void persistDraft();
      window.scrollTo({ top: 280, behavior: "smooth" });
    }
  }

  function showSubmitError(message: string) {
    setSubmitError(message);
    toast.error(message, {
      description:
        t.Draft?.SavedOnError ??
        "Your answers were saved. Fix the issue and submit again.",
    });
    requestAnimationFrame(() => {
      submitErrorRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  }

  function readableSubmitError(error: unknown) {
    const message = toErrorMessage(error, "An unexpected error occurred.");
    if (
      message.includes("Server Components render") ||
      message.includes("Body exceeded") ||
      message.includes("Invalid Server Actions request")
    ) {
      return (
        t.Draft?.SubmitCrashed ??
        "The application could not be sent. Your answers are saved on this device. Use smaller files (under 7MB each) and try again."
      );
    }
    return message;
  }

  function attachmentSizeError() {
    const files = [
      imageFile,
      govIdFile,
      proofAddrFile,
      businessPlanFile,
      ...projectGallery,
      ...supportingDocs,
    ].filter((file): file is File => Boolean(file));
    const maxFile = 7 * 1024 * 1024;
    const maxTotal = 20 * 1024 * 1024;
    const format = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(1)}MB`;

    const tooBig = files.find((file) => file.size > maxFile);
    if (tooBig) {
      return (
        t.Draft?.ErrFileTooLarge ??
        "[name] is [size]. Each file must be under 7MB."
      )
        .replace("[name]", tooBig.name)
        .replace("[size]", format(tooBig.size));
    }

    const total = files.reduce((sum, file) => sum + file.size, 0);
    if (total > maxTotal) {
      return (
        t.Draft?.ErrTotalTooLarge ??
        "Attachments total [size]. Keep the total under 20MB."
      ).replace("[size]", format(total));
    }
    return "";
  }

  async function handleSubmit() {
    const ok = await agreementForm.trigger();
    if (!ok) return;
    setLoading(true);
    setSubmitError("");

    const sizeError = attachmentSizeError();
    if (sizeError) {
      await persistDraft();
      showSubmitError(sizeError);
      setLoading(false);
      return;
    }

    const personal = personalForm.getValues();
    const contact = contactForm.getValues();
    const id = idForm.getValues();
    const grant = grantForm.getValues();
    const background = backgroundForm.getValues();

    const formData = new FormData();
    const { photoUrl: _photoUrl, ...personalData } = personal;

    formData.append("personal", JSON.stringify(personalData));
    formData.append("contact", JSON.stringify(contact));
    formData.append("identification", JSON.stringify(id));
    formData.append("grant", JSON.stringify(grant));
    formData.append("background", JSON.stringify(background));

    if (govIdFile) formData.append("nid_card", govIdFile);
    if (proofAddrFile) formData.append("proof_of_address", proofAddrFile);
    if (businessPlanFile) formData.append("business_plan", businessPlanFile);
    if (imageFile) formData.append("image", imageFile);

    projectGallery.forEach((img) => {
      formData.append("projectGallery", img);
    });

    supportingDocs.forEach((doc) => {
      formData.append("supporting_documents", doc);
    });

    try {
      const { submitApplication } =
        await import("@/helpers/next-fetch/applicationActions");
      const res = await submitApplication(formData);

      if (res.success) {
        setTrackingCode(res.applicationId || "IFA-SUBMITTED");
        await clearApplyDraft();
        setDraftSavedAt(null);
        setDraftBanner(false);
        setSubmitted(true);
        toast.success(t.Success?.Toast ?? t.Success.Body, {
          description: t.Success.ImportantNotice,
        });
      } else {
        await persistDraft();
        showSubmitError(readableSubmitError(res.message));
      }
    } catch (err: unknown) {
      console.error("Application submit failed", err);
      await persistDraft();
      showSubmitError(readableSubmitError(err));
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <div className="rounded-3xl border border-hairline bg-white p-10 text-center shadow-xs">
        <h2 className="font-display text-2xl font-semibold text-forest-deep">
          {t.ClosedState.Title.replace("[status]", "")}
        </h2>
        <p className="mt-3 text-sm text-mist max-w-md mx-auto">
          {t.NoCycles.Desc}
        </p>
        <Button asChild className="mt-6 rounded-xl">
          <Link href={`/${currentLang}/grants`}>
            {t.ClosedState.GuidelinesBtn}
          </Link>
        </Button>
      </div>
    );
  }

  if (submitted) {
    const email = contactForm.getValues("email");
    const dob = personalForm.getValues("dob");
    const name = personalForm.getValues("name");
    const photoPreviewUrl = personalForm.getValues("photoUrl");

    return (
      <div className="relative overflow-hidden rounded-[2rem] border border-hairline bg-white p-8 text-center shadow-lg sm:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(11,61,46,0.08),_transparent_55%)]"
        />
        <div className="relative">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-forest/10 text-forest ring-8 ring-forest/5">
            <CheckCircle2 className="h-10 w-10 text-forest" />
          </div>

          {photoPreviewUrl && (
            <div className="mt-5 flex justify-center">
              <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-forest shadow-sm">
                <Image
                  src={photoPreviewUrl}
                  alt={name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-forest">
            {t.Success.Eyebrow}
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-forest-deep sm:text-4xl">
            {t.Success.Title.replace("[name]", name || "Applicant")}
          </h2>
          <p className="mt-3 text-sm text-mist max-w-md mx-auto leading-relaxed">
            {t.Success.Body}
          </p>

          <div className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5 text-left max-w-md mx-auto text-sm text-amber-950 space-y-3">
            <div className="flex items-start gap-2">
              <HelpCircle className="h-5 w-5 text-amber-600 shrink-0" />
              <p>
                <strong>{t.Success.ImportantPrefix}</strong>{" "}
                {t.Success.ImportantNotice}
              </p>
            </div>
            <div className="flex justify-between border-t border-amber-500/20 pt-3 font-medium text-xs">
              <span>{t.Success.RegEmail}</span>
              <span>{email}</span>
            </div>
            <div className="flex justify-between pt-1 font-medium text-xs">
              <span className="text-amber-900/70">{t.Success.Dob}</span>
              <span>{dob}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-xl px-8 w-full sm:w-auto shadow-md hover:shadow-lg transition-all"
            >
              <Link href={`/${currentLang}/track-application`}>
                {t.Success.TrackBtn}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-xl px-6 w-full sm:w-auto"
            >
              <Link href={`/${currentLang}/grants`}>
                {t.Success.ReturnGrants}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const CurrentStepIcon = STEPS[step - 1].icon;
  const draftLabel = draftSavedAt
    ? (t.Draft?.SavedAt ?? "Saved at [time]").replace(
        "[time]",
        formatDraftTime(draftSavedAt, currentLang),
      )
    : (t.Draft?.Saving ?? "Saving…");

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
      <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-5">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-hairline bg-white p-6 shadow-xs">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-forest/5"
          />
          <div className="relative flex items-center justify-between border-b border-hairline pb-4 mb-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-forest">
                {t.Stepper.Progress}
              </p>
              <p className="mt-0.5 text-sm font-semibold text-forest-deep">
                {t.Stepper.StepOf.replace("[current]", String(step)).replace(
                  "[total]",
                  "7",
                )}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex rounded-full bg-forest px-3 py-1 text-xs font-bold text-white">
                {currentProgress}%
              </span>
              <p className="mt-1.5 flex items-center justify-end gap-1 text-[10px] text-mist">
                <Cloud className="h-3 w-3" />
                {draftLabel}
              </p>
            </div>
          </div>

          <ol className="relative space-y-1">
            {STEPS.map((s, index) => {
              const active = s.id === step;
              const isDone = s.id < step;
              const StepIcon = s.icon;

              return (
                <li key={s.id} className="relative">
                  {index < STEPS.length - 1 ? (
                    <span
                      aria-hidden
                      className={cn(
                        "absolute left-[1.35rem] top-11 h-[calc(100%-0.35rem)] w-px",
                        isDone ? "bg-forest/40" : "bg-hairline",
                      )}
                    />
                  ) : null}
                  <button
                    type="button"
                    disabled={!isDone && !active}
                    onClick={() => {
                      if (isDone) setStep(s.id);
                    }}
                    className={cn(
                      "relative z-[1] flex w-full items-center gap-3 rounded-2xl p-3 text-left text-xs transition-all",
                      active
                        ? "bg-forest text-white shadow-md shadow-forest/20"
                        : isDone
                          ? "bg-sand-soft/70 text-forest-deep hover:bg-sand-soft"
                          : "text-mist cursor-default",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all",
                        active
                          ? "bg-white text-forest"
                          : isDone
                            ? "bg-forest text-white"
                            : "bg-sand-soft text-mist",
                      )}
                    >
                      {isDone ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <StepIcon className="h-3.5 w-3.5" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold">{s.label}</p>
                      <p
                        className={cn(
                          "truncate text-[10px]",
                          active ? "text-white/75" : "text-mist",
                        )}
                      >
                        {s.desc}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="relative hidden overflow-hidden rounded-[1.75rem] border border-hairline bg-[linear-gradient(160deg,#0B3D2E_0%,#145C45_55%,#1A6B52_100%)] p-6 text-white lg:block">
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-8 -right-6 h-28 w-28 rounded-full bg-white/10"
          />
          <div className="relative">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-sand" />
              <h4 className="font-display text-sm font-semibold">
                {t.Tips.Title}
              </h4>
            </div>
            <ul className="mt-4 space-y-3 text-xs leading-relaxed text-white/80">
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-sand" />
                {t.Tips.Tip1}
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-sand" />
                {t.Tips.Tip2}
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-sand" />
                {t.Tips.Tip3}
              </li>
            </ul>
          </div>
        </div>
      </aside>

      <main className="lg:col-span-8">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-hairline bg-white shadow-[0_18px_50px_-28px_rgba(11,61,46,0.35)]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(11,61,46,0.06),transparent)]"
          />

          <div className="relative p-6 sm:p-10">
            {draftBanner ? (
              <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-forest/15 bg-forest/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-relaxed text-forest-deep">
                  {t.Draft?.Banner ??
                    "Draft restored from your last session. Continue where you left off."}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="shrink-0 rounded-xl"
                  onClick={() => setDraftBanner(false)}
                >
                  {t.Draft?.Dismiss ?? "Dismiss"}
                </Button>
              </div>
            ) : null}

            <div className="border-b border-hairline pb-6 mb-6">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sand-soft text-forest ring-1 ring-forest/10">
                  <CurrentStepIcon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-forest">
                    {t.Stepper.StepOf.replace(
                      "[current]",
                      String(step),
                    ).replace("[total]", "7")}
                  </p>
                  <h3 className="font-display text-xl font-semibold text-forest-deep sm:text-2xl">
                    {STEPS[step - 1].label}
                  </h3>
                  <p className="mt-1 text-sm text-mist">
                    {STEPS[step - 1].desc}
                  </p>
                </div>
              </div>

              <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-sand-soft">
                <div
                  className="h-full rounded-full bg-forest transition-all duration-500 ease-out"
                  style={{ width: `${currentProgress}%` }}
                />
              </div>
            </div>

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
                projectGallery={projectGallery}
                setProjectGallery={setProjectGallery}
                supportingDocs={supportingDocs}
                setSupportingDocs={setSupportingDocs}
                fileError={fileError}
              />
            )}

            {step === 7 && (
              <FormProvider {...agreementForm}>
                <div className="space-y-6">
                  {personalForm.getValues("photoUrl") && (
                    <div className="flex items-center gap-4 rounded-2xl border border-hairline bg-sand-soft/40 p-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-forest">
                        <Image
                          src={personalForm.getValues("photoUrl")}
                          alt={t.Step7.ApplicantPhoto}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-forest">
                          {t.Step7.ApplicantPhoto}
                        </p>
                        <p className="text-sm font-semibold text-forest-deep">
                          {personalForm.getValues("name")}
                        </p>
                      </div>
                    </div>
                  )}

                  <ReviewBlock
                    title={t.Step7.ReviewPersonal}
                    rows={[
                      [t.Step7.FullName, personalForm.getValues("name")],
                      [t.Step7.Dob, personalForm.getValues("dob")],
                      [t.Step7.Location, personalForm.getValues("location")],
                    ]}
                  />

                  <ReviewBlock
                    title={t.Step7.ReviewContact}
                    rows={[
                      [t.Step7.Email, contactForm.getValues("email")],
                      [t.Step7.Phone, contactForm.getValues("phone")],
                      [t.Step7.NationalId, idForm.getValues("nationalId")],
                    ]}
                  />

                  <ReviewBlock
                    title={t.Step7.ReviewProject}
                    rows={[
                      [t.Step7.ProjectName, grantForm.getValues("projectName")],
                      [
                        t.Step7.RequestedAmount,
                        `$${grantForm.getValues("requestedAmount")}`,
                      ],
                    ]}
                  />

                  <StepAgreement />
                </div>
              </FormProvider>
            )}

            {submitError ? (
              <div
                ref={submitErrorRef}
                role="alert"
                className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-600"
              >
                {submitError}
              </div>
            ) : null}

            <div className="mt-8 flex items-center justify-between gap-4 border-t border-hairline pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                disabled={step === 1}
                className="rounded-xl px-5"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> {t.Nav.Previous}
              </Button>

              {step < 7 ? (
                <Button
                  type="button"
                  onClick={() => void handleNext()}
                  className="rounded-xl px-6"
                >
                  {t.Nav.Continue} <ArrowRight className="ml-2 h-4 w-4" />
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
                      <Loader2 className="h-4 w-4 animate-spin" />{" "}
                      {t.Nav.Submitting}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {t.Nav.Submit} <Check className="ml-1 h-4 w-4" />
                    </span>
                  )}
                </Button>
              )}
            </div>
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
            <dd className="text-right font-semibold text-forest-deep">
              {v || "—"}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
