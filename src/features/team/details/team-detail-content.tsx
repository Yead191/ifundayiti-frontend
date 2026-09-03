import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { getImageUrl } from "@/lib/getImageUrl";
import {
  BookOpen,
  Sparkles,
  MapPin,
  Shield,
  Tag,
  Mail,
  ArrowRight,
  HeartHandshake,
} from "lucide-react";

interface TeamDetailContentProps {
  member: any;
  lang: string;
  dict: any;
}

export function TeamDetailContent({
  member,
  lang,
  dict,
}: TeamDetailContentProps) {
  const d = dict.DetailPage;
  const g = dict.Grid;

  const isHtml =
    typeof member.bio === "string" &&
    (/<[a-z][\s\S]*>/i.test(member.bio) || member.bio.includes("</"));

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14 items-start">
          {/* Main Biography Column */}
          <div className="lg:col-span-8 space-y-8">
            <article className="rounded-3xl border border-hairline bg-white p-6 sm:p-10 shadow-sm">
              <div className="flex items-center gap-3 border-b border-hairline pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-forest/10 text-forest">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest-deep">
                    {d.Biography}
                  </h2>
                  <p className="text-xs text-mist mt-0.5">
                    {member.title ? `${member.title} · ` : ""}
                    {member.name}
                  </p>
                </div>
              </div>

              {/* Rich HTML Content or Plain Text */}
              <div className="mt-8">
                {member.bio ? (
                  isHtml ? (
                    <div
                      className="prose prose-forest max-w-none text-base sm:text-lg leading-relaxed text-cloud space-y-4
                      [&_p]:mb-4 [&_p]:leading-relaxed
                      [&_strong]:font-bold [&_strong]:text-forest-deep
                      [&_h1]:text-2xl [&_h1]:sm:text-3xl [&_h1]:font-display [&_h1]:font-bold [&_h1]:text-forest-deep [&_h1]:mt-6 [&_h1]:mb-3
                      [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:font-display [&_h2]:font-bold [&_h2]:text-forest-deep [&_h2]:mt-6 [&_h2]:mb-3
                      [&_h3]:text-lg [&_h3]:sm:text-xl [&_h3]:font-display [&_h3]:font-bold [&_h3]:text-forest-deep [&_h3]:mt-4 [&_h3]:mb-2
                      [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:my-4
                      [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:my-4
                      [&_li]:text-cloud
                      [&_blockquote]:border-l-4 [&_blockquote]:border-forest/40 [&_blockquote]:bg-sand-soft/30 [&_blockquote]:py-2 [&_blockquote]:px-4 [&_blockquote]:rounded-r-xl [&_blockquote]:italic [&_blockquote]:text-forest-deep
                      [&_a]:text-forest [&_a]:underline [&_a]:font-semibold hover:[&_a]:text-forest-bright"
                      dangerouslySetInnerHTML={{ __html: member.bio }}
                    />
                  ) : (
                    <div className="text-base sm:text-lg leading-relaxed text-cloud whitespace-pre-line">
                      {member.bio}
                    </div>
                  )
                ) : (
                  <p className="text-sm italic text-mist">
                    {d.NoBio || "No detailed biography provided for this member yet."}
                  </p>
                )}
              </div>
            </article>

            {/* Mission Statement Callout */}
            <div className="rounded-3xl border border-forest/20 bg-linear-to-r from-forest-deep to-forest p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-sand">
                    <Sparkles className="h-3.5 w-3.5" />
                    {d.StewardshipTag || "IFundAyiti Stewardship"}
                  </span>
                  <h3 className="mt-1 font-display text-xl sm:text-2xl font-bold text-white">
                    {d.StewardshipTitle || "Rooted in Integrity, Empowering Communities"}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-sand/80 max-w-xl">
                    {d.StewardshipDesc ||
                      "Every member of our leadership and volunteer corps pledges full transparency, objective evaluation, and direct grassroots accountability."}
                  </p>
                </div>
                <Link
                  href={`/${lang}/apply`}
                  className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-sand px-4 py-2.5 text-xs sm:text-sm font-bold text-forest-deep shadow-md hover:bg-white transition-colors"
                >
                  <span>{d.ApplyGrants || "Apply for Grants"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Portrait Card */}
            <div className="overflow-hidden rounded-3xl border border-hairline bg-white p-4 shadow-sm">
              <div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl bg-sand-soft">
                <Image
                  src={getImageUrl(member.image) || ""}
                  alt={member.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-70" />

                {member.location && (
                  <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                    <MapPin className="h-3.5 w-3.5 text-sand" />
                    {member.location}
                  </span>
                )}
              </div>
            </div>

            {/* Focus Areas & Expertise */}
            {member.focusAreas && member.focusAreas.length > 0 && (
              <div className="rounded-3xl border border-hairline bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 border-b border-hairline pb-4">
                  <Tag className="h-4 w-4 text-forest" />
                  <h3 className="font-display text-base font-bold text-forest-deep">
                    {d.FocusAreas}
                  </h3>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {member.focusAreas.map((area: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-xl border border-forest/15 bg-forest/5 px-3 py-1 text-xs font-semibold text-forest"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Role & Verification Summary */}
            <div className="rounded-3xl border border-hairline bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 border-b border-hairline pb-4">
                <Shield className="h-4 w-4 text-forest" />
                <h3 className="font-display text-base font-bold text-forest-deep">
                  {d.Role}
                </h3>
              </div>
              <dl className="mt-4 space-y-3 text-xs sm:text-sm">
                {member.title && (
                  <div>
                    <dt className="text-mist font-medium">
                      {d.Designation || "Designation"}
                    </dt>
                    <dd className="font-bold text-forest-deep mt-0.5">
                      {member.title}
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-mist font-medium">
                    {d.Category || "Category"}
                  </dt>
                  <dd className="font-semibold text-forest-deep capitalize mt-0.5">
                    {member.category === "director"
                      ? g.CatDirLabel
                      : member.category === "member"
                        ? g.CatMemLabel
                        : g.CatVolLabel}
                  </dd>
                </div>
                {member.location && (
                  <div>
                    <dt className="text-mist font-medium">{d.Location}</dt>
                    <dd className="font-medium text-forest-deep mt-0.5">
                      {member.location}
                    </dd>
                  </div>
                )}
                {member.email && (
                  <div>
                    <dt className="text-mist font-medium">{d.Email}</dt>
                    <dd className="mt-0.5">
                      <a
                        href={`mailto:${member.email}`}
                        className="text-forest hover:underline font-semibold"
                      >
                        {member.email}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Volunteer CTA */}
            <div className="rounded-3xl border border-sand bg-sand-soft/50 p-6 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-forest/10 text-forest mb-3">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <h4 className="font-display text-base font-bold text-forest-deep">
                {d.JoinTeamTitle || "Join the Team"}
              </h4>
              <p className="text-xs text-mist mt-1.5">
                {d.JoinTeamDesc ||
                  "Support grassroots Haitian entrepreneurs by becoming an active volunteer or ambassador."}
              </p>
              <Link
                href={`/${lang}/become-a-volunteer`}
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-forest px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-forest-bright transition-colors"
              >
                {d.ApplyVolunteer || "Apply as Volunteer"}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
