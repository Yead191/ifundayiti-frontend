"use client";

import * as React from "react";
import Image from "next/image";
import { z } from "zod";
import { toast } from "sonner";
import {
  CheckCircle2,
  Search,
  XCircle,
  Clock,
  FileText,
  User,
  Trophy,
  Loader2,
  Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trackApplicationStatus } from "@/helpers/next-fetch/applicationActions";
import { getImageUrl } from "@/lib/getImageUrl";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  dob: z.string().min(1, "Date of birth is required"),
});

export type TApplicationStatus =
  | "submitted"
  | "underReview"
  | "approved"
  | "rejected"
  | "finalist"
  | "winner"
  | "archived";

interface ApplicationTrackData {
  _id: string;
  applicationPeriod: {
    title: string;
  };
  personal: {
    name: string;
    dob: string;
    nationality: string;
    location: string;
    image?: string;
  };
  contact: {
    email: string;
    phone: string;
  };
  identification: {
    nationalId: string;
    passport: string;
  };
  grant: {
    projectName: string;
    projectDescription: string;
    requestedAmount: number;
    fundUsage: string;
    expectedImpact: string;
  };
  background: {
    occupation: string;
    financialBackground: string;
  };
  documents: {
    type: string;
    url: string;
  }[];
  status: TApplicationStatus;
  rejectionReason?: string;
  successStory?: string;
  fundedAmount?: number;
  createdAt: string;
  updatedAt: string;
}

const POSITIVE_STEPS = [
  { key: "submitted", label: "Submitted" },
  { key: "underReview", label: "Under Review" },
  { key: "approved", label: "Approved" },
  { key: "finalist", label: "Finalist" },
  { key: "winner", label: "Winner" },
];

export function ApplicationTracker() {
  const [email, setEmail] = React.useState("");
  const [dob, setDob] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<
    ApplicationTrackData | null | undefined
  >(undefined);
  const [errorMsg, setErrorMsg] = React.useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ email, dob });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message);
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setResult(undefined);

    try {
      // The backend expects an ISO string, so we convert the YYYY-MM-DD string to ISO.
      const dateIso = new Date(parsed.data.dob).toISOString();
      const res = await trackApplicationStatus(parsed.data.email, dateIso);

      if (res.success && res.data) {
        setResult(res.data);
      } else {
        setResult(null);
        setErrorMsg(
          res.message ||
            res.error ||
            "No application found with these credentials.",
        );
      }
    } catch (err: any) {
      setResult(null);
      setErrorMsg("An unexpected error occurred while fetching your status.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <form
        onSubmit={handleSubmit}
        className="relative overflow-hidden rounded-3xl border border-hairline bg-white p-8 sm:p-10 shadow-lg"
      >
        <div className="absolute top-0 left-0 h-1.5 w-full bg-linear-to-r from-forest via-forest-deep to-forest" />

        <div className="grid gap-6 sm:grid-cols-2 items-end">
          <div className="space-y-2">
            <Label
              htmlFor="track-email"
              className="text-xs font-semibold uppercase tracking-wider text-forest-deep"
            >
              Registered Email
            </Label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-mist/60" />
              <Input
                id="track-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="pl-12 h-14 rounded-2xl bg-sand-soft/30 border-hairline focus:bg-white transition-all text-forest-deep"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="track-dob"
              className="text-xs font-semibold uppercase tracking-wider text-forest-deep"
            >
              Date of Birth
            </Label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-mist/60" />
              <Input
                id="track-dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="pl-12 h-14 rounded-2xl bg-sand-soft/30 border-hairline focus:bg-white transition-all text-forest-deep"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="h-14 w-full sm:w-auto px-8 rounded-2xl bg-forest hover:bg-forest/90 text-white font-medium shadow-md transition-all hover:shadow-lg"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Search className="mr-2 h-5 w-5" />
            )}
            Check Status
          </Button>
        </div>
      </form>

      {result === null && (
        <div className="mt-8 flex animate-in fade-in slide-in-from-bottom-4 flex-col items-center justify-center rounded-3xl border border-red-100 bg-red-50/50 p-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100/50 text-red-600 mb-4">
            <Search className="h-8 w-8" />
          </div>
          <h3 className="font-display text-xl font-semibold text-red-900">
            Application Not Found
          </h3>
          <p className="mt-2 text-sm text-red-700/80 max-w-md">
            {errorMsg} Please make sure you are using the exact email and date
            of birth you applied with.
          </p>
        </div>
      )}

      {result && (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4">
          <PremiumStatusCard applicant={result} />
        </div>
      )}
    </div>
  );
}

function PremiumStatusCard({ applicant }: { applicant: ApplicationTrackData }) {
  const status = applicant.status;
  const isRejected = status === "rejected";
  const isArchived = status === "archived";
  const isWinner = status === "winner";

  const currentIndex = Math.max(
    0,
    POSITIVE_STEPS.findIndex((s) => s.key === status),
  );

  const formatDate = (isoStr: string) => {
    return new Date(isoStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const statusLabel = {
    submitted: "Submitted Successfully",
    underReview: "Currently Under Review",
    approved: "Application Approved",
    finalist: "Top Finalist",
    winner: "Grant Winner!",
    rejected: "Application Declined",
    archived: "Archived",
  }[status];

  return (
    <article className="overflow-hidden rounded-3xl border border-hairline bg-white shadow-xl">
      {/* Header Profile Section */}
      <div className="relative p-8 sm:p-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-hairline bg-sand-soft/20">
        <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-md bg-white flex items-center justify-center">
          {applicant?.personal?.image ? (
            <Image
              src={getImageUrl(applicant?.personal?.image) || ""}
              alt={applicant.personal.name}
              fill
              className="object-cover"
            />
          ) : (
            <User className="h-12 w-12 text-mist" />
          )}
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1 mt-2 sm:mt-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-forest">
            {applicant.applicationPeriod?.title || "Grant Program"}
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest-deep">
            {applicant.personal.name}
          </h2>
          <div className="flex items-center justify-center sm:justify-start gap-2 text-mist text-sm mt-2">
            <FileText className="h-4 w-4 shrink-0" />
            <span className="font-medium text-forest-deep shrink-0">
              Project:
            </span>
            <span className="truncate max-w-[200px] sm:max-w-[300px]">
              {applicant.grant.projectName}
            </span>
          </div>
        </div>

        {/* Floating Status Badge */}
        <div
          className={`
          absolute top-8 right-8 hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border shadow-sm
          ${
            isWinner
              ? "bg-amber-50 border-amber-200 text-amber-700"
              : isRejected
                ? "bg-red-50 border-red-200 text-red-700"
                : "bg-forest/5 border-forest/10 text-forest-deep"
          }
        `}
        >
          {isWinner ? (
            <Trophy className="h-4 w-4" />
          ) : isRejected ? (
            <XCircle className="h-4 w-4" />
          ) : (
            <Clock className="h-4 w-4" />
          )}
          {statusLabel}
        </div>
      </div>

      <div className="p-8 sm:p-10 space-y-10">
        {/* Dynamic Progress Bar */}
        <div className="block">
          <h3 className="text-sm font-semibold text-forest-deep uppercase tracking-wider mb-6">
            Application Progress
          </h3>
          <div className="relative">
            {/* Background Line */}
            <div className="absolute left-4 top-0 h-full w-0.5 bg-sand-soft/80 sm:left-0 sm:top-4 sm:h-0.5 sm:w-full" />

            <div className="relative flex flex-col sm:flex-row sm:justify-between gap-8 sm:gap-4">
              {POSITIVE_STEPS.map((step, i) => {
                const isCompleted = i < currentIndex;
                const isActive =
                  i === currentIndex && !isRejected && !isArchived;

                return (
                  <div
                    key={step.key}
                    className="relative flex items-center gap-4 sm:flex-col sm:gap-3 group"
                  >
                    <div
                      className={`
                      flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500 bg-white z-10
                      ${
                        isActive
                          ? "border-forest ring-4 ring-forest/10 scale-110"
                          : isCompleted
                            ? "border-forest bg-forest"
                            : "border-sand-soft/80"
                      }
                    `}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      ) : isActive ? (
                        <div className="h-2 w-2 rounded-full bg-forest animate-pulse" />
                      ) : null}
                    </div>
                    <div className="flex-1 sm:text-center sm:absolute sm:top-12 sm:w-24 sm:-ml-8">
                      <p
                        className={`text-sm font-semibold transition-colors ${isActive || isCompleted ? "text-forest-deep" : "text-mist/70"}`}
                      >
                        {step.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Conditional Messages based on Status */}
        {isRejected && (
          <div className="rounded-2xl border border-red-100 bg-red-50/50 p-6 flex gap-4">
            <XCircle className="h-6 w-6 text-red-500 shrink-0" />
            <div>
              <h4 className="font-semibold text-red-900">Application Update</h4>
              <p className="mt-1 text-sm text-red-700/80 leading-relaxed">
                Thank you for applying. Unfortunately, your application has not
                been selected to move forward at this time.
                {applicant.rejectionReason && (
                  <span className="block mt-2 font-medium bg-white/50 p-3 rounded-xl border border-red-100">
                    Note: {applicant.rejectionReason}
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        {isWinner && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 flex gap-4 shadow-sm">
            <Trophy className="h-8 w-8 text-amber-500 shrink-0" />
            <div>
              <h4 className="font-display text-xl font-bold text-amber-900">
                Congratulations!
              </h4>
              <p className="mt-2 text-sm text-amber-800 leading-relaxed">
                You have been selected as a grant winner! We will be in touch
                shortly regarding the next steps for funding distribution.
                {applicant.fundedAmount && (
                  <span className="block mt-2 font-semibold">
                    Awarded Amount: ${applicant.fundedAmount.toLocaleString()}
                  </span>
                )}
                {applicant.successStory && (
                  <span className="block mt-4 italic border-l-2 border-amber-300 pl-3">
                    "{applicant.successStory}"
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Application Details */}
        <div className="space-y-6 pt-6 border-t border-hairline">
          <h3 className="text-sm font-semibold text-forest-deep uppercase tracking-wider">
            Application Details
          </h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-mist uppercase">Personal Info</p>
                <p className="text-sm text-forest-deep mt-1 font-medium">{applicant.personal.name}</p>
                <p className="text-sm text-mist">{applicant.personal.location}</p>
                <p className="text-sm text-mist">{applicant.personal.nationality}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-mist uppercase">Contact</p>
                <p className="text-sm text-forest-deep mt-1 font-medium">{applicant.contact.email}</p>
                <p className="text-sm text-mist">{applicant.contact.phone}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-mist uppercase">Background</p>
                <p className="text-sm text-forest-deep mt-1 font-medium">{applicant.background.occupation}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-mist uppercase">Grant Info</p>
                <p className="text-sm text-forest-deep mt-1 font-medium">{applicant.grant.projectName}</p>
                <p className="text-sm text-mist font-semibold">Requested: ${applicant.grant.requestedAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-mist uppercase">Project Description</p>
                <p className="text-sm text-mist mt-1 line-clamp-3">{applicant.grant.projectDescription}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-mist uppercase">Expected Impact</p>
                <p className="text-sm text-mist mt-1 line-clamp-3">{applicant.grant.expectedImpact}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Details */}
        <div className="grid sm:grid-cols-2 gap-4 pt-6 border-t border-hairline">
          <div className="flex items-start gap-3 rounded-2xl bg-sand-soft/30 p-4">
            <Calendar className="h-5 w-5 text-forest/60 shrink-0" />
            <div>
              <p className="text-xs font-semibold uppercase text-mist">
                Submitted On
              </p>
              <p className="mt-0.5 text-sm font-medium text-forest-deep">
                {formatDate(applicant.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-2xl bg-sand-soft/30 p-4">
            <Clock className="h-5 w-5 text-forest/60 shrink-0" />
            <div>
              <p className="text-xs font-semibold uppercase text-mist">
                Last Updated
              </p>
              <p className="mt-0.5 text-sm font-medium text-forest-deep">
                {formatDate(applicant.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
