"use client";

import React from "react";
import { Folder } from "@/components/ui/Folder";
import type { GalleryFolder } from "@/helpers/next-fetch/galleryActions";
import { Reveal } from "@/components/ui/reveal";
import { EmptyState } from "@/components/shared/empty-state";

interface FoldersDirectoryProps {
  folders: GalleryFolder[];
  lang?: string;
  dict?: any;
}

export function FoldersDirectory({
  folders = [],
  lang = "en",
  dict,
}: FoldersDirectoryProps) {
  const t = dict?.GalleryPage;

  if (folders.length === 0) {
    return (
      <EmptyState
        title={t?.NoFoldersTitle || "No photo albums available yet"}
        body={
          t?.NoFoldersBody ||
          "Our team is currently organizing photo archives. Check back soon!"
        }
      />
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {folders.map((folder, index) => (
          <Reveal key={folder._id || folder.id} delay={index * 40}>
            <Folder
              id={folder._id || folder.id}
              name={folder.name}
              galleryCount={folder.galleryCount ?? 0}
              createdAt={folder.createdAt}
              href={`/${lang}/gallery?folder=${folder._id || folder.id}`}
              color="#0B3D2E"
              lang={lang}
              dict={dict}
            />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
