"use client";

import * as React from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Search, Loader2, Calendar, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trackApplicationStatus } from "@/helpers/next-fetch/applicationActions";
import { getAllApplicationPeriods } from "@/helpers/next-fetch/periodActions";
import { ApplicationTrackData } from "../types";
import { PremiumStatusCard } from "./premium-status-card";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  dob: z.string().min(1, "Date of birth is required"),
  periodId: z.string().optional(),
});

export function ApplicationTrackerForm() {
  const [email, setEmail] = React.useState("");
  const [dob, setDob] = React.useState("");
  const [periods, setPeriods] = React.useState<any[]>([]);
  const [selectedPeriod, setSelectedPeriod] = React.useState("all");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<
    ApplicationTrackData | null | undefined
  >(undefined);
  const [errorMsg, setErrorMsg] = React.useState("");

  React.useEffect(() => {
    async function fetchPeriods() {
      const res = await getAllApplicationPeriods();
      if (res.success && res.data) {
        setPeriods(res.data);
      }
    }
    fetchPeriods();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ email, dob, periodId: selectedPeriod });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message);
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setResult(undefined);

    try {
      const dateIso = new Date(parsed.data.dob).toISOString();
      const actualPeriodId =
        selectedPeriod === "all" ? undefined : selectedPeriod;
      const res = await trackApplicationStatus(
        parsed.data.email,
        dateIso,
        actualPeriodId,
      );

      if (res.success && res.data) {
        setResult(res.data);
      } else {
        setResult(null);
        setErrorMsg(
          res.message ||
            res.error ||
            "No application found with these credentials.",
        );
      }
    } catch (err: any) {
      setResult(null);
      setErrorMsg("An unexpected error occurred while fetching your status.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <form
        onSubmit={handleSubmit}
        className="relative overflow-hidden rounded-3xl border border-hairline bg-white p-8 sm:p-10 shadow-lg"
      >
        <div className="absolute top-0 left-0 h-1.5 w-full bg-linear-to-r from-forest via-forest-deep to-forest" />

        <div className="grid gap-6 md:grid-cols-3 items-end">
          <div className="space-y-2">
            <Label
              htmlFor="track-email"
              className="text-xs font-semibold uppercase tracking-wider text-forest-deep"
            >
              Registered Email
            </Label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-mist/60" />
              <Input
                id="track-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="pl-12 h-14 rounded-2xl bg-sand-soft/30 border-hairline focus:bg-white transition-all text-forest-deep"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="track-dob"
              className="text-xs font-semibold uppercase tracking-wider text-forest-deep"
            >
              Date of Birth
            </Label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-mist/60" />
              <Input
                id="track-dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="pl-12 h-14 rounded-2xl bg-sand-soft/30 border-hairline focus:bg-white transition-all text-forest-deep"
              />
            </div>
          </div>

          <div className="">
            <Label
              htmlFor="track-period"
              className="text-xs font-semibold uppercase tracking-wider text-forest-deep"
            >
              Grant Cycle (Optional)
            </Label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger
                id="track-period"
                className="w-full bg-sand-soft/30 border-hairline h-14 rounded-2xl text-forest-deep font-medium focus:bg-white transition-all py-0 [&>span]:flex [&>span]:items-center [&>span]:h-full -bottom-2!"
              >
                <SelectValue placeholder="All Cycles (Latest)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cycles (Latest)</SelectItem>
                {periods.map((period) => (
                  <SelectItem key={period._id} value={period._id}>
                    {period.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="h-14 w-full sm:w-auto px-8 rounded-2xl bg-forest hover:bg-forest/90 text-white font-medium shadow-md transition-all hover:shadow-lg"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Search className="mr-2 h-5 w-5" />
            )}
            Check Status
          </Button>
        </div>
      </form>

      {result === null && (
        <div className="mt-8 flex animate-in fade-in slide-in-from-bottom-4 flex-col items-center justify-center rounded-3xl border border-red-100 bg-red-50/50 p-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100/50 text-red-600 mb-4">
            <Search className="h-8 w-8" />
          </div>
          <h3 className="font-display text-xl font-semibold text-red-900">
            Application Not Found
          </h3>
          <p className="mt-2 text-sm text-red-700/80 max-w-md">
            {errorMsg} Please make sure you are using the exact credentials and
            selected cycle.
          </p>
        </div>
      )}

      {result && (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4">
          <PremiumStatusCard applicant={result} />
        </div>
      )}
    </div>
  );
}
