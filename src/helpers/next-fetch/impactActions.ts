"use server";

import { nextFetch } from "./NextFetch";

export interface ImpactStatsData {
  applicationReceived: number;
  grantsAwardedCount: number;
  totalFundsAwarded: number;
  projectSupported: number;
  grantCycleCount: number;
}

/**
 * Fetch live impact statistics directly from the backend API.
 * Endpoint: GET /dashboard/impact-stats
 */
export async function getImpactStats() {
  try {
    const res = await nextFetch<ImpactStatsData>("/dashboard/impact-stats", {
      cache: "reload",
      next: { revalidate: 60 * 60 },
    });
    return res;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch impact stats",
      data: {
        applicationReceived: 0,
        grantsAwardedCount: 0,
        totalFundsAwarded: 0,
        projectSupported: 0,
        grantCycleCount: 0,
      },
    };
  }
}
