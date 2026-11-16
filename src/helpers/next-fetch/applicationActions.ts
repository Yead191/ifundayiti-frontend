"use server";

import { nextFetch } from "./NextFetch";
import { toErrorMessage } from "@/lib/api-error";

export type SubmitApplicationResult = {
  success: boolean;
  message: string;
  applicationId: string;
};

/** POST /application — submits a grant application as FormData.
 *  Always returns a plain object so a thrown server error is not redacted in production.
 */
export async function submitApplication(
  formData: FormData,
): Promise<SubmitApplicationResult> {
  try {
    const result = await nextFetch<{ _id?: string; id?: string }>(
      "/application",
      {
        method: "POST",
        body: formData,
      },
    );

    const data = result.data;
    const applicationId =
      data && typeof data === "object"
        ? String(data._id || data.id || "")
        : "";

    return {
      success: Boolean(result.success && data),
      message: toErrorMessage(
        result.message,
        toErrorMessage(
          result.error,
          result.success ? "Application submitted" : "Failed to submit application.",
        ),
      ),
      applicationId,
    };
  } catch (error) {
    console.error("submitApplication failed:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to submit application.",
      applicationId: "",
    };
  }
}

/** GET /application/track — fetches a specific application by email, dob and optional periodId */
export async function trackApplicationStatus(email: string, dob: string, periodId?: string) {
  const params: Record<string, string> = { email, dob };
  if (periodId) {
    params.periodId = periodId;
  }
  const queryParams = new URLSearchParams(params);
  const result = await nextFetch(`/application/track?${queryParams.toString()}`, {
    method: "GET",
    // We shouldn't heavily cache this since status updates are important
    cache: "no-store", 
  });
  return result;
}
