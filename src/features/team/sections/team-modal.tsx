"use client";

import Image from "next/image";
import { MapPin, Mail, Linkedin, Twitter, Github } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { getImageUrl } from "@/lib/getImageUrl";

import { useTranslation } from "@/components/providers/translation-provider";

interface TeamModalProps {
  member: any | null;
  isOpen: boolean;
  onClose: () => void;
  lang?: string;
}

export function TeamModal({ member, isOpen, onClose, lang }: TeamModalProps) {
  const dict = useTranslation();
  const t = dict.TeamPage.Modal;
  const grid = dict.TeamPage.Grid;

  if (!member) return null;

  const categoryBadgeColor =
    member.category === "director"
      ? "bg-emerald-100 text-emerald-900 border-emerald-300"
      : member.category === "member"
        ? "bg-amber-100 text-amber-900 border-amber-300"
        : "bg-teal-100 text-teal-900 border-teal-300";

  const categoryLabel =
    member.category === "director"
      ? grid.RoleDirector
      : member.category === "member"
        ? grid.RoleMember
        : grid.RoleVolunteer;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      className="max-w-2xl p-0 overflow-hidden rounded-3xl bg-white border border-hairline shadow-2xl"
    >
      <div className="relative">
        {/* Top Banner Gradient */}
        <div className="relative h-28 bg-forest-deep flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-forest-deep via-forest to-forest-deep opacity-60" />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="relative z-10 font-display font-black text-4xl sm:text-5xl leading-none text-white/25 select-none tracking-tighter mix-blend-overlay">
            {member.category.toUpperCase()}
          </div>
        </div>

        {/* Profile Header Content */}
        <div className="relative px-6 pb-6 pt-0 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12">
            <div className="relative h-28 w-28 overflow-hidden rounded-2xl border-4 border-white shadow-lg bg-sand-soft">
              <Image
                src={getImageUrl(member.image) || ""}
                alt={member.name}
                fill
                className="object-cover"
                sizes="112px"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {member.title && (
                <span className="inline-flex items-center rounded-full border border-forest/20 bg-forest/10 px-3 py-1 text-xs font-bold text-forest">
                  {member.title}
                </span>
              )}
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${categoryBadgeColor}`}
              >
                {categoryLabel}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-hairline bg-sand-soft/80 px-3 py-1 text-xs font-medium text-forest-deep">
                <MapPin className="h-3 w-3 text-forest" />
                {member.location}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <h2 className="font-display text-2xl font-bold text-forest-deep">
              {member.name}
            </h2>
            {member.title ? (
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-base font-bold text-forest">
                  {member.title}
                </p>
              </div>
            ) : (
              <p className="text-base font-semibold text-forest mt-0.5">
                {categoryLabel}
              </p>
            )}
          </div>

          {/* Bio */}
          <div className="mt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-mist">
              {t.Biography}
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-cloud">
              {member.bio}
            </p>
          </div>

          {/* Focus Areas / Skills */}
          {member.focusAreas && member.focusAreas.length > 0 && (
            <div className="mt-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-mist mb-2">
                {t.Focus}
              </h4>
              <div className="flex flex-wrap gap-2">
                {member.focusAreas.map((skill: string, idx: number) => (
                  <span
                    key={idx}
                    className="rounded-lg bg-cream-dark border border-hairline px-2.5 py-1 text-xs font-medium text-forest-deep"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social & Contact */}
          <div className="mt-6 flex items-center justify-between border-t border-hairline pt-4">
            <span className="text-xs font-medium text-mist">{t.Verified}</span>
            <div className="flex items-center gap-2">
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-hairline bg-sand-soft/60 text-forest transition-colors hover:bg-forest hover:text-white"
                  title="Send Email"
                >
                  <Mail className="h-4 w-4" />
                </a>
              )}
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-9 w-9 place-items-center rounded-xl border border-hairline bg-sand-soft/60 text-forest transition-colors hover:bg-forest hover:text-white"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {member.twitter && (
                <a
                  href={member.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-9 w-9 place-items-center rounded-xl border border-hairline bg-sand-soft/60 text-forest transition-colors hover:bg-forest hover:text-white"
                  title="Twitter Profile"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              {member.github && (
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-9 w-9 place-items-center rounded-xl border border-hairline bg-sand-soft/60 text-forest transition-colors hover:bg-forest hover:text-white"
                  title="GitHub Profile"
                >
                  <Github className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
