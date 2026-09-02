"use server";

import { nextFetch } from "./NextFetch";

export interface TeamStats {
  totalDirectors: number;
  totalMembers: number;
  totalVolunteers: number;
  totalVolunteersPending?: number;
}

/** GET /team/stats — fetches total active directors, core members and volunteers */
export async function getTeamStats() {
  const result = await nextFetch<TeamStats>("/team/stats", {
    method: "GET",
    next: { revalidate: 120 },
    tags: ["team-stats"],
  });
  return result;
}

/** GET /team — fetches paginated active team members with optional search and category filters */
export async function getTeamMembers(params: {
  category?: string;
  searchTerm?: string;
  page?: number;
  limit?: number;
}) {
  const queryParams = new URLSearchParams();
  if (params.category && params.category !== "all") {
    // Map UI category labels to singular DB categories
    let dbCategory = params.category;
    if (params.category === "directors") dbCategory = "director";
    if (params.category === "members") dbCategory = "member";
    if (params.category === "volunteers") dbCategory = "volunteer";

    queryParams.append("category", dbCategory);
  }
  if (params.searchTerm) {
    queryParams.append("searchTerm", params.searchTerm);
  }
  if (params.page) {
    queryParams.append("page", params.page.toString());
  }
  if (params.limit) {
    queryParams.append("limit", params.limit.toString());
  }

  const result = await nextFetch(`/team?${queryParams.toString()}`, {
    method: "GET",
    next: { revalidate: 60 },
    tags: ["team"],
  });
  return result;
}

/** POST /team/volunteer-apply — submits volunteer application */
export async function applyAsVolunteer(formData: FormData) {
  const result = await nextFetch("/team/volunteer-apply", {
    method: "POST",
    body: formData,
  });
  return result;
}
