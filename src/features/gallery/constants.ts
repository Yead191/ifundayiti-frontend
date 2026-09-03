export const GALLERY_CATEGORIES = [
  "All",
  "Community Outreach",
  "Grant Programs",
  "Education",
  "Food & Agriculture",
  "Healthcare",
  "Community Development",
  "Entrepreneurship",
  "Environment",
  "Events",
  "Volunteering",
  "Success Stories",
  "Other",
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];
