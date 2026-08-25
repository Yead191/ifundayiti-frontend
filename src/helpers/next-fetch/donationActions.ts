"use server";

import { nextFetch } from "./NextFetch";

export interface CreateDonationPayload {
  name: string;
  email: string;
  amount: number;
}

export interface DonationCheckoutResponse {
  paymentUrl: string;
}

/** POST /donation — creates Stripe checkout session and returns paymentUrl */
export async function createDonation(body: CreateDonationPayload) {
  const result = await nextFetch<DonationCheckoutResponse>("/donation", {
    method: "POST",
    body,
  });

  return result;
}
