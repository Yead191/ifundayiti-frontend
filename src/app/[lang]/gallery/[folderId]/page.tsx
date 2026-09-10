import { redirect } from "next/navigation";

interface FolderPageProps {
  params: Promise<{ lang: string; folderId: string }>;
  searchParams: Promise<{
    category?: string;
    searchTerm?: string;
    page?: string;
  }>;
}

export default async function GalleryFolderRedirectPage({
  params,
  searchParams,
}: FolderPageProps) {
  const { lang, folderId } = await params;
  const { category, searchTerm, page } = await searchParams;

  const urlParams = new URLSearchParams();
  urlParams.set("folder", folderId);
  if (category && category !== "All") urlParams.set("category", category);
  if (searchTerm && searchTerm.trim())
    urlParams.set("searchTerm", searchTerm.trim());
  if (page && page !== "1") urlParams.set("page", page);

  redirect(`/${lang}/gallery?${urlParams.toString()}`);
}
