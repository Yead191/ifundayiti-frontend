export const GALLERY_CATEGORIES = [
  "All",
  "Community Outreach",
  "Healthcare",
  "Education",
  "Events",
  "Grant Programs",
  "Success Stories",
  "Food & Agriculture",
  "Community Development",
  "Entrepreneurship",
  "Environment",
  "Volunteering",
  "Other",
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];
