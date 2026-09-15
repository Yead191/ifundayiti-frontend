import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSingleEvent } from "@/helpers/next-fetch/eventActions";
import getProfile from "@/helpers/next-fetch/getProfile";
import { EventDetailsView } from "@/features/events/components/EventDetailsView";
import { buildMetadata } from "@/lib/seo";
import { getImageUrl } from "@/lib/getImageUrl";

interface PageProps {
  params: Promise<{
    lang: string;
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang, id } = await params;
  const res = await getSingleEvent(id);

  if (!res.success || !res.data) {
    return buildMetadata({
      title: "Event Not Found",
      description: "The requested gathering could not be found on IFundAyiti.",
      path: `/${lang}/events/${id}`,
    });
  }

  const event = res.data;
  const imageUrl = getImageUrl(event.image);

  return buildMetadata({
    title: `${event.title} | IFundAyiti Events`,
    description: event.description.slice(0, 160),
    path: `/${lang}/events/${id}`,
    ...(imageUrl ? { image: imageUrl } : {}),
  });
}

export default async function EventDetailsPage({ params }: PageProps) {
  const { lang, id } = await params;

  const [eventRes, profile] = await Promise.all([
    getSingleEvent(id),
    getProfile(),
  ]);

  if (!eventRes.success || !eventRes.data) {
    notFound();
  }

  const event = eventRes.data;

  // JSON-LD Structured Data for Event SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate || event.startDate,
    eventStatus:
      event.status === "cancelled"
        ? "https://schema.org/EventCancelled"
        : "https://schema.org/EventScheduled",
    eventAttendanceMode:
      event.type === "virtual"
        ? "https://schema.org/OnlineEventAttendanceMode"
        : event.type === "hybrid"
        ? "https://schema.org/MixedEventAttendanceMode"
        : "https://schema.org/OfflineEventAttendanceMode",
    location:
      event.type === "virtual"
        ? {
            "@type": "VirtualLocation",
            url: event.virtualLink || "https://ifundayiti.org",
          }
        : {
            "@type": "Place",
            name: event.location,
            address: {
              "@type": "PostalAddress",
              streetAddress: event.venueAddress || event.location,
            },
          },
    image: [getImageUrl(event.image) || ""],
    organizer: {
      "@type": "Organization",
      name: "IFundAyiti",
      url: "https://ifundayiti.org",
    },
    offers: {
      "@type": "Offer",
      price: event.pricingType === "free" ? 0 : event.price || 0,
      priceCurrency: "USD",
      availability:
        (event.remainingSeats ?? event.capacity - event.reservedCount) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
      url: `https://ifundayiti.org/${lang}/events/${event._id}`,
    },
    performer: event.speakers?.map((sp) => ({
      "@type": "Person",
      name: sp.name,
      jobTitle: sp.role,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EventDetailsView event={event} lang={lang} profile={profile} />
    </>
  );
}
