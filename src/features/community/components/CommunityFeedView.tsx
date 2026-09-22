"use client";

import * as React from "react";
import { MessageSquare, Pin, Search, Sparkles } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import {
  getCommunityPosts,
  type ICommunityPost,
} from "@/helpers/next-fetch/communityActions";
import { CommunityFeedHeader } from "./CommunityFeedHeader";
import { CommunityPostCard } from "./CommunityPostCard";

interface CommunityFeedViewProps {
  initialPosts: ICommunityPost[];
  lang?: string;
  isLoggedIn?: boolean;
  dict?: any;
}

export function CommunityFeedView({
  initialPosts = [],
  lang = "en",
  isLoggedIn = false,
  dict,
}: CommunityFeedViewProps) {
  const isHt = lang === "ht";
  const t = dict?.CommunityPage || {};

  const [posts, setPosts] = React.useState<ICommunityPost[]>(initialPosts);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);

  // Debounced server search when searchTerm changes
  React.useEffect(() => {
    if (!searchTerm.trim()) {
      setPosts(initialPosts);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await getCommunityPosts({
          searchTerm: searchTerm.trim(),
          limit: 30,
        });
        if (res.success && Array.isArray(res.data)) {
          setPosts(res.data);
        }
      } catch {
        // Fallback to client-side filter
        const query = searchTerm.toLowerCase();
        setPosts(
          initialPosts.filter(
            (p) =>
              p.title?.toLowerCase().includes(query) ||
              p.content?.toLowerCase().includes(query),
          ),
        );
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm, initialPosts]);

  // Separate pinned announcements from regular posts
  const pinnedPosts = React.useMemo(
    () => posts.filter((p) => p.isPinned),
    [posts],
  );

  const regularPosts = React.useMemo(
    () => posts.filter((p) => !p.isPinned),
    [posts],
  );

  return (
    <div className="min-h-screen bg-cream pb-24 pt-24 sm:pt-28">
      <Container className="max-w-4xl space-y-8">
        {/* Hero Header */}
        <CommunityFeedHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          lang={lang}
          dict={dict}
        />

        {/* FEED CONTENT */}
        {posts.length === 0 ? (
          /* Empty State */
          <div className="rounded-3xl border border-dashed border-hairline/90 bg-white p-12 text-center space-y-3">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-sand-soft text-mist">
              {searchTerm ? (
                <Search className="h-6 w-6" />
              ) : (
                <MessageSquare className="h-6 w-6" />
              )}
            </div>
            <h3 className="font-display text-lg font-bold text-forest-deep">
              {searchTerm
                ? t.NoSearchResults || "No discussions found"
                : t.NoPostsTitle || "No Announcements Yet"}
            </h3>
            <p className="text-xs sm:text-sm text-mist max-w-md mx-auto leading-relaxed">
              {searchTerm
                ? `We couldn't find any announcements matching "${searchTerm}". Try adjusting your keywords.`
                : t.NoPostsDesc ||
                  "There are no community discussions published yet. Check back soon for updates from iFundAyiti leadership!"}
            </p>
            {searchTerm && (
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchTerm("")}
                  className="rounded-xl border-hairline"
                >
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* PINNED ANNOUNCEMENTS HIGHLIGHT */}
            {pinnedPosts.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1 text-xs font-bold uppercase tracking-wider text-amber-800">
                  <Pin className="h-3.5 w-3.5 fill-amber-700 text-amber-700" />
                  <span>
                    {isHt
                      ? "Anons Epengle yo"
                      : "Pinned Announcements"}
                  </span>
                </div>
                <div className="space-y-5">
                  {pinnedPosts.map((post) => (
                    <CommunityPostCard
                      key={post._id}
                      post={post}
                      lang={lang}
                      isLoggedIn={isLoggedIn}
                      dict={dict}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* REGULAR FEED POSTS */}
            {regularPosts.length > 0 && (
              <div className="space-y-4">
                {pinnedPosts.length > 0 && (
                  <div className="flex items-center gap-2 px-1 text-xs font-bold uppercase tracking-wider text-forest pt-2">
                    <Sparkles className="h-3.5 w-3.5 text-forest" />
                    <span>
                      {isHt
                        ? "Tout Diskisyon yo"
                        : "All Community Discussions"}
                    </span>
                  </div>
                )}
                <div className="space-y-5">
                  {regularPosts.map((post) => (
                    <CommunityPostCard
                      key={post._id}
                      post={post}
                      lang={lang}
                      isLoggedIn={isLoggedIn}
                      dict={dict}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
