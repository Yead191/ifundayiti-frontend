"use client";

import React, { useRef } from "react";
import { AlertCircle, FileUp, Check, X } from "lucide-react";
import { useTranslation } from "@/components/providers/translation-provider";

interface StepDocumentsProps {
  govIdFile: File | null;
  setGovIdFile: (f: File | null) => void;
  proofAddrFile: File | null;
  setProofAddrFile: (f: File | null) => void;
  businessPlanFile: File | null;
  setBusinessPlanFile: (f: File | null) => void;
  projectGallery?: File[];
  setProjectGallery?: (f: File[]) => void;
  supportingDocs: File[];
  setSupportingDocs: (f: File[]) => void;
  fileError: string;
}

function formatSize(bytes: number) {
  if (bytes > 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  return (bytes / 1024).toFixed(0) + " KB";
}

export function StepDocuments({
  govIdFile,
  setGovIdFile,
  proofAddrFile,
  setProofAddrFile,
  businessPlanFile,
  setBusinessPlanFile,
  projectGallery = [],
  setProjectGallery = () => {},
  supportingDocs,
  setSupportingDocs,
  fileError,
}: StepDocumentsProps) {
  const dict = useTranslation();
  const t = dict.ApplyPage.Step6;

  const idRef = useRef<HTMLInputElement>(null);
  const addrRef = useRef<HTMLInputElement>(null);
  const planRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const supportRef = useRef<HTMLInputElement>(null);

  const handleSingleFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (f: File | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) setter(file);
  };

  const handleGalleryFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (projectGallery.length + files.length > 5) {
      alert(t.ErrMaxGallery);
      return;
    }
    setProjectGallery([...projectGallery, ...files]);
    if (galleryRef.current) galleryRef.current.value = "";
  };

  const removeGalleryImage = (index: number) => {
    setProjectGallery(projectGallery.filter((_, i) => i !== index));
  };

  const handleMultipleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (supportingDocs.length + files.length > 5) {
      alert(t.ErrMaxFiles);
      return;
    }
    setSupportingDocs([...supportingDocs, ...files]);
    // Reset input so the same file can be selected again if removed
    if (supportRef.current) supportRef.current.value = "";
  };

  const removeSupportDoc = (index: number) => {
    setSupportingDocs(supportingDocs.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 flex items-start gap-3 text-amber-900">
        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed text-amber-950">
          <strong>{t.WarningPrefix}</strong> {t.Warning}
        </p>
      </div>

      {/* Upload Item 1: ID */}
      <div className="border border-hairline rounded-2xl p-4 bg-sand-soft/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <span className="block text-sm font-semibold text-forest-deep">
            {t.GovIdTitle}
          </span>
          <span className="text-xs text-mist block mt-0.5">
            {t.GovIdDesc}
          </span>
          {govIdFile && (
            <span className="mt-2 text-xs font-semibold text-forest flex items-center gap-1 bg-forest/10 border border-forest/20 px-2.5 py-1 rounded-lg w-fit">
              <Check className="h-3 w-3 shrink-0" />
              <span className="truncate max-w-[200px]">{govIdFile.name}</span>
              <span className="text-[10px] opacity-75">({formatSize(govIdFile.size)})</span>
            </span>
          )}
        </div>

        <input
          type="file"
          ref={idRef}
          onChange={(e) => handleSingleFile(e, setGovIdFile)}
          className="hidden"
          accept="image/*,.pdf"
        />

        <button
          type="button"
          onClick={() => idRef.current?.click()}
          className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-forest-deep px-4 py-2.5 border border-hairline bg-white hover:bg-sand-soft rounded-xl transition-all cursor-pointer shadow-xs"
        >
          <FileUp className="h-4 w-4 text-forest" />
          <span>{govIdFile ? t.ChangeFile : t.UploadId}</span>
        </button>
      </div>

      {/* Upload Item 2: Proof of Address */}
      <div className="border border-hairline rounded-2xl p-4 bg-sand-soft/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <span className="block text-sm font-semibold text-forest-deep">
            {t.ProofAddrTitle}
          </span>
          <span className="text-xs text-mist block mt-0.5">
            {t.ProofAddrDesc}
          </span>
          {proofAddrFile && (
            <span className="mt-2 text-xs font-semibold text-forest flex items-center gap-1 bg-forest/10 border border-forest/20 px-2.5 py-1 rounded-lg w-fit">
              <Check className="h-3 w-3 shrink-0" />
              <span className="truncate max-w-[200px]">{proofAddrFile.name}</span>
              <span className="text-[10px] opacity-75">({formatSize(proofAddrFile.size)})</span>
            </span>
          )}
        </div>

        <input
          type="file"
          ref={addrRef}
          onChange={(e) => handleSingleFile(e, setProofAddrFile)}
          className="hidden"
          accept="image/*,.pdf"
        />

        <button
          type="button"
          onClick={() => addrRef.current?.click()}
          className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-forest-deep px-4 py-2.5 border border-hairline bg-white hover:bg-sand-soft rounded-xl transition-all cursor-pointer shadow-xs"
        >
          <FileUp className="h-4 w-4 text-forest" />
          <span>{proofAddrFile ? t.ChangeFile : t.UploadAddr}</span>
        </button>
      </div>

      {/* Upload Item 3: Business Plan */}
      <div className="border border-hairline rounded-2xl p-4 bg-sand-soft/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <span className="block text-sm font-semibold text-forest-deep">
            {t.PlanTitle}
          </span>
          <span className="text-xs text-mist block mt-0.5">
            {t.PlanDesc}
          </span>
          {businessPlanFile && (
            <span className="mt-2 text-xs font-semibold text-forest flex items-center gap-1 bg-forest/10 border border-forest/20 px-2.5 py-1 rounded-lg w-fit">
              <Check className="h-3 w-3 shrink-0" />
              <span className="truncate max-w-[200px]">{businessPlanFile.name}</span>
              <span className="text-[10px] opacity-75">({formatSize(businessPlanFile.size)})</span>
            </span>
          )}
        </div>

        <input
          type="file"
          ref={planRef}
          onChange={(e) => handleSingleFile(e, setBusinessPlanFile)}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx"
        />

        <button
          type="button"
          onClick={() => planRef.current?.click()}
          className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-forest-deep px-4 py-2.5 border border-hairline bg-white hover:bg-sand-soft rounded-xl transition-all cursor-pointer shadow-xs"
        >
          <FileUp className="h-4 w-4 text-forest" />
          <span>{businessPlanFile ? t.ChangeFile : t.UploadPlan}</span>
        </button>
      </div>

      {/* Upload Item 4: Project Gallery */}
      <div className="border border-hairline rounded-2xl p-4 bg-sand-soft/30 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <span className="block text-sm font-semibold text-forest-deep">
              {t.GalleryTitle}
            </span>
            <span className="text-xs text-mist block mt-0.5">
              {t.GalleryDesc}
            </span>
          </div>

          <input
            type="file"
            multiple
            ref={galleryRef}
            onChange={handleGalleryFiles}
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
          />

          <button
            type="button"
            onClick={() => galleryRef.current?.click()}
            disabled={projectGallery.length >= 5}
            className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-forest-deep px-4 py-2.5 border border-hairline bg-white hover:bg-sand-soft rounded-xl transition-all cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileUp className="h-4 w-4 text-forest" />
            <span>{t.UploadGallery}</span>
          </button>
        </div>

        {projectGallery.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-hairline">
            {projectGallery.map((doc, i) => (
              <span key={i} className="text-xs font-semibold text-forest flex items-center gap-1.5 bg-forest/10 border border-forest/20 pl-2.5 pr-1.5 py-1 rounded-lg w-fit">
                <Check className="h-3 w-3 shrink-0" />
                <span className="truncate max-w-[150px]">{doc.name}</span>
                <span className="text-[10px] opacity-75">({formatSize(doc.size)})</span>
                <button
                  type="button"
                  onClick={() => removeGalleryImage(i)}
                  className="ml-1 text-forest/60 hover:text-red-600 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Upload Item 5: Supporting Documents */}
      <div className="border border-hairline rounded-2xl p-4 bg-sand-soft/30 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <span className="block text-sm font-semibold text-forest-deep">
              {t.SupportTitle}
            </span>
            <span className="text-xs text-mist block mt-0.5">
              {t.SupportDesc}
            </span>
          </div>

          <input
            type="file"
            multiple
            ref={supportRef}
            onChange={handleMultipleFiles}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
          />

          <button
            type="button"
            onClick={() => supportRef.current?.click()}
            disabled={supportingDocs.length >= 5}
            className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-forest-deep px-4 py-2.5 border border-hairline bg-white hover:bg-sand-soft rounded-xl transition-all cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileUp className="h-4 w-4 text-forest" />
            <span>{t.UploadFiles}</span>
          </button>
        </div>

        {supportingDocs.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-hairline">
            {supportingDocs.map((doc, i) => (
              <span key={i} className="text-xs font-semibold text-forest flex items-center gap-1.5 bg-forest/10 border border-forest/20 pl-2.5 pr-1.5 py-1 rounded-lg w-fit">
                <Check className="h-3 w-3 shrink-0" />
                <span className="truncate max-w-[150px]">{doc.name}</span>
                <span className="text-[10px] opacity-75">({formatSize(doc.size)})</span>
                <button
                  type="button"
                  onClick={() => removeSupportDoc(i)}
                  className="ml-1 text-forest/60 hover:text-red-600 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {fileError && (
        <div className="flex items-center gap-2 text-xs text-red-600 mt-2 font-medium">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{fileError}</span>
        </div>
      )}
    </div>
  );
}
