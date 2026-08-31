import { useTranslation } from "@/components/providers/translation-provider";
import { File, Download } from "lucide-react";
import { ApplicationTrackData } from "../types";
import { getImageUrl } from "@/lib/getImageUrl";

interface ApplicationDetailsProps {
  applicant: ApplicationTrackData;
  lang?: string;
}

export function ApplicationDetails({ applicant, lang }: ApplicationDetailsProps) {
  const dict = useTranslation();
  const t = dict.TrackingPage.Details;

  const getDocumentIcon = (type: string) => {
    return <File className="h-5 w-5 text-forest/70" />;
  };

  const isImage = (url: string) => {
    return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
  };

  return (
    <div className="space-y-6 pt-6 border-t border-hairline">
      <h3 className="text-sm font-semibold text-forest-deep uppercase tracking-wider">
        {t.Title}
      </h3>
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-mist uppercase">{t.PersonalInfo}</p>
            <p className="text-sm text-forest-deep mt-1 font-medium">{applicant.personal.name}</p>
            <p className="text-sm text-mist">{applicant.personal.location}</p>
            <p className="text-sm text-mist">{applicant.personal.nationality}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-mist uppercase">{t.ContactInfo}</p>
            <p className="text-sm text-forest-deep mt-1 font-medium">{applicant.contact.email}</p>
            <p className="text-sm text-mist">{applicant.contact.phone}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-mist uppercase">{t.BackgroundInfo}</p>
            <p className="text-sm text-forest-deep mt-1 font-medium">{applicant.background.occupation}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-mist uppercase">{t.GrantInfo}</p>
            <p className="text-sm text-forest-deep mt-1 font-medium">{applicant.grant.projectName}</p>
            <p className="text-sm text-mist font-semibold">
              {t.Requested} ${applicant.grant.requestedAmount?.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-mist uppercase">{t.ProjectDesc}</p>
            <p className="text-sm text-mist mt-1 line-clamp-3" title={applicant.grant.projectDescription}>
              {applicant.grant.projectDescription}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-mist uppercase">{t.ExpectedImpact}</p>
            <p className="text-sm text-mist mt-1 line-clamp-3" title={applicant.grant.expectedImpact}>
              {applicant.grant.expectedImpact}
            </p>
          </div>
        </div>
      </div>

      {applicant.documents && applicant.documents.length > 0 && (
        <div className="pt-4">
          <p className="text-xs font-semibold text-mist uppercase mb-3">{t.SubmittedDocs}</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {applicant.documents.map((doc, idx) => {
              const fullUrl = getImageUrl(doc.url);
              return (
                <li
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl border border-hairline bg-sand-soft/30 hover:bg-white transition-colors"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {getDocumentIcon(doc.type)}
                    <span className="text-sm font-medium text-forest-deep truncate">
                      {doc.type}
                    </span>
                  </div>
                  <a
                    href={fullUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-forest/5 hover:bg-forest/10 text-forest transition-colors shrink-0"
                    title={t.ViewDoc}
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
