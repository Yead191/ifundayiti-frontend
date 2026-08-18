"use client";

import * as React from "react";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  INITIAL_APPLICANTS,
  type IFundApplicant,
} from "@/features/ifundayiti/data/mock-data";
import { CURRENT_PERIOD } from "@/data/grant";

const schema = z.object({
  email: z.string().email("Enter the email used on your application"),
  dob: z.string().min(1, "Date of birth is required"),
});

const POSITIVE = [
  "Submitted",
  "Under Review",
  "Approved",
  "Top 5 Finalist",
  "Winner",
] as const;

const NEGATIVE = ["Rejected", "Archived"] as const;

export function ApplicationTracker() {
  const [email, setEmail] = React.useState("");
  const [dob, setDob] = React.useState("");
  const [result, setResult] = React.useState<IFundApplicant | null | undefined>(
    undefined,
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ email, dob });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message);
      return;
    }

    const stored = localStorage.getItem("ifa_applicants");
    const pool: IFundApplicant[] = stored
      ? JSON.parse(stored)
      : INITIAL_APPLICANTS;

    const match = pool.find(
      (a) =>
        a.email.toLowerCase() === parsed.data.email.toLowerCase() &&
        a.dob === parsed.data.dob,
    );
    setResult(match ?? null);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-hairline bg-white p-6 sm:p-8"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="track-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-forest">
              Email
            </Label>
            <Input
              id="track-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
            />
          </div>
          <div>
            <Label htmlFor="track-dob" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-forest">
              Date of birth
            </Label>
            <Input
              id="track-dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
        </div>
        <Button type="submit" className="mt-6 w-full">
          Check application status
        </Button>
        <p className="mt-3 text-center text-xs text-mist">
          Demo lookup: try jean.pierre@email.ht and 1994-04-12
        </p>
      </form>

      {result === null && (
        <p className="mt-6 rounded-2xl border border-hairline bg-white px-5 py-4 text-sm text-mist">
          No application matched that email and date of birth.
        </p>
      )}

      {result && <PublicStatusCard applicant={result} />}
    </div>
  );
}

function PublicStatusCard({ applicant }: { applicant: IFundApplicant }) {
  const rejected =
    applicant.status === "Rejected" || applicant.status === "Archived";
  const steps = rejected ? NEGATIVE : POSITIVE;
  const currentIndex = Math.max(
    0,
    steps.findIndex((s) => s === applicant.status),
  );

  return (
    <article className="mt-8 rounded-2xl border border-hairline bg-white p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-forest">
        Application status
      </p>
      <h2 className="mt-1 font-display text-3xl text-forest-deep">
        {applicant.status}
      </h2>
      <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-mist">Application period</dt>
          <dd className="font-medium text-forest-deep">{CURRENT_PERIOD.title}</dd>
        </div>
        <div>
          <dt className="text-mist">Project</dt>
          <dd className="font-medium text-forest-deep">{applicant.projectName}</dd>
        </div>
        <div>
          <dt className="text-mist">Submitted</dt>
          <dd className="font-medium text-forest-deep">{applicant.submissionDate}</dd>
        </div>
        <div>
          <dt className="text-mist">Last updated</dt>
          <dd className="font-medium text-forest-deep">{applicant.submissionDate}</dd>
        </div>
      </dl>

      <ol className="mt-8 space-y-3">
        {steps.map((step, i) => (
          <li key={step} className="flex items-center gap-3">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                i <= currentIndex ? "bg-forest" : "bg-sand"
              }`}
            />
            <span
              className={i <= currentIndex ? "text-forest-deep" : "text-mist"}
            >
              {step}
            </span>
          </li>
        ))}
      </ol>
    </article>
  );
}
