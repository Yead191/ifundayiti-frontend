"use client";

import * as React from "react";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";

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
  "Personal",
  "Contact",
  "Identification",
  "Project",
  "Background",
  "Documents",
  "Review",
];

type FileMock = { name: string; size?: string };

export function ApplyExperience() {
  const [step, setStep] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [govIdFile, setGovIdFile] = React.useState<FileMock | null>(null);
  const [proofAddrFile, setProofAddrFile] = React.useState<FileMock | null>(null);
  const [businessPlanFile, setBusinessPlanFile] = React.useState<FileMock | null>(null);
  const [fileError, setFileError] = React.useState("");

  const personalForm = useForm({
    resolver: zodResolver(personalSchema),
    defaultValues: { name: "", dob: "", nationality: "Haitian", location: "" },
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
    if (valid) setStep((s) => Math.min(7, s + 1));
  }

  async function handleSubmit() {
    const ok = await agreementForm.trigger();
    if (!ok) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    const personal = personalForm.getValues();
    const contact = contactForm.getValues();
    const id = idForm.getValues();
    const grant = grantForm.getValues();
    const background = backgroundForm.getValues();

    const stored = localStorage.getItem("ifa_applicants");
    const existing: IFundApplicant[] = stored
      ? JSON.parse(stored)
      : INITIAL_APPLICANTS;
    const year = new Date().getFullYear();
    const trackingId = `IFA-${year}-${String(existing.length + 101).padStart(6, "0")}`;

    const record: IFundApplicant = {
      id: trackingId,
      name: personal.name,
      dob: personal.dob,
      nationality: personal.nationality,
      location: personal.location,
      email: contact.email,
      phone: contact.phone,
      nationalId: id.nationalId,
      passport: id.passport,
      projectName: grant.projectName,
      projectDescription: grant.projectDescription,
      requestedAmount: grant.requestedAmount,
      fundUsage: grant.fundUsage,
      expectedImpact: grant.expectedImpact,
      documents: [
        { type: "Government-issued ID", name: govIdFile?.name ?? "" },
        { type: "Proof of Address", name: proofAddrFile?.name ?? "" },
        ...(businessPlanFile
          ? [{ type: "Business Plan", name: businessPlanFile.name }]
          : []),
      ],
      occupation: background.occupation,
      financialBackground: background.financialBackground,
      status: "Submitted",
      submissionDate: new Date().toISOString().slice(0, 10),
      photoUrl: "",
      periodId: CURRENT_PERIOD.id,
    };

    localStorage.setItem("ifa_applicants", JSON.stringify([record, ...existing]));
    setLoading(false);
    setSubmitted(true);
  }

  if (!isOpen) {
    return (
      <div className="rounded-2xl border border-hairline bg-white p-10 text-center">
        <h2 className="font-display text-2xl text-forest-deep">
          Applications are not open
        </h2>
        <p className="mt-3 text-mist">
          There is currently no open grant cycle. Check the Grants page for dates.
        </p>
        <Button asChild className="mt-6">
          <Link href="/grants">View grant cycles</Link>
        </Button>
      </div>
    );
  }

  if (submitted) {
    const email = contactForm.getValues("email");
    const dob = personalForm.getValues("dob");
    return (
      <div className="rounded-2xl border border-hairline bg-white px-6 py-12 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-forest text-white">
          <Check className="h-6 w-6" />
        </span>
        <h2 className="mt-6 font-display text-3xl text-forest-deep">
          Application submitted successfully
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-mist">
          Track this application later with the email and date of birth you used:
          <br />
          <strong className="text-forest-deep">{email}</strong> · {dob}
        </p>
        <Button asChild className="mt-8">
          <Link href="/track-application">Track application</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-hairline bg-white p-5 sm:p-8">
      <ol className="mb-8 flex gap-1 overflow-x-auto pb-2">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const active = n === step;
          const done = n < step;
          return (
            <li
              key={label}
              className="flex min-w-22 flex-1 flex-col items-center gap-1"
            >
              <span
                className={`grid h-8 w-8 place-items-center rounded-full text-xs font-semibold ${
                  done || active
                    ? "bg-forest text-white"
                    : "bg-sand-soft text-mist"
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : n}
              </span>
              <span className="text-[11px] font-medium text-mist">{label}</span>
            </li>
          );
        })}
      </ol>

      {step === 1 && (
        <FormProvider {...personalForm}>
          <StepPersonal />
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
          fileError={fileError}
        />
      )}
      {step === 7 && (
        <FormProvider {...agreementForm}>
          <div className="space-y-6">
            <ReviewBlock
              title="Personal"
              rows={[
                ["Name", personalForm.getValues("name")],
                ["Date of birth", personalForm.getValues("dob")],
                ["Location", personalForm.getValues("location")],
              ]}
            />
            <ReviewBlock
              title="Project"
              rows={[
                ["Project", grantForm.getValues("projectName")],
                ["Amount", `$${grantForm.getValues("requestedAmount")}`],
              ]}
            />
            <StepAgreement />
          </div>
        </FormProvider>
      )}

      <div className="mt-8 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
        >
          <ArrowLeft /> Back
        </Button>
        {step < 7 ? (
          <Button type="button" onClick={() => void handleNext()}>
            Continue <ArrowRight />
          </Button>
        ) : (
          <Button type="button" onClick={() => void handleSubmit()} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Submit application"}
          </Button>
        )}
      </div>
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
    <div className="rounded-xl bg-sand-soft/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-forest">
        {title}
      </p>
      <dl className="mt-2 space-y-1 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4">
            <dt className="text-mist">{k}</dt>
            <dd className="text-right text-forest-deep">{v || "—"}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
