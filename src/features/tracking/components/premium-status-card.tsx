import * as React from "react";
import Image from "next/image";
import { XCircle, Clock, FileText, User, Trophy, Calendar } from "lucide-react";

import { ApplicationTrackData } from "../types";
import { ApplicationProgress } from "./application-progress";
import { ApplicationDetails } from "./application-details";
import { getImageUrl } from "@/lib/getImageUrl";

interface PremiumStatusCardProps {
  applicant: ApplicationTrackData;
}

export function PremiumStatusCard({ applicant }: PremiumStatusCardProps) {
  const status = applicant.status;
  const isRejected = status === "rejected";
  const isWinner = status === "winner";

  const formatDate = (isoStr: string) => {
    return new Date(isoStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const statusLabel =
    {
      submitted: "Submitted Successfully",
      underReview: "Currently Under Review",
      approved: "Application Approved",
      finalist: "Top Finalist",
      winner: "Grant Winner!",
      rejected: "Application Declined",
      archived: "Archived",
    }[status] || status;

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
            <span className="truncate max-w-50 sm:max-w-75">
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
        <ApplicationProgress status={applicant.status} />

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
                {applicant?.awardedAmount && (
                  <span className="block mt-2 font-semibold">
                    Awarded Amount: $
                    {applicant?.awardedAmount?.toLocaleString()}
                  </span>
                )}
                {applicant?.successStory && (
                  <span className="block mt-4 italic border-l-2 border-amber-300 pl-3">
                    "{applicant.successStory}"
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        <ApplicationDetails applicant={applicant} />

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
