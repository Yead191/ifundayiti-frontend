"use client";

import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  "911317811111-uhs3mivpijfvscdncmvbm75hvchlen9e.apps.googleusercontent.com";

export function SiteProviders({
  children,
  lang = "en",
}: {
  children: React.ReactNode;
  lang?: string;
}) {
  const googleLocale = lang === "ht" ? "fr" : lang;

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID} locale={googleLocale}>
      {children}
      <Toaster
        theme="light"
        position="bottom-right"
        duration={2500}
        closeButton
        gap={10}
        toastOptions={{
          classNames: {
            toast:
              "group !font-sans !rounded-xl !border !border-hairline-strong !bg-white !text-cloud !shadow-[0_18px_40px_-20px_rgba(11,61,46,0.25)]",
            title: "!text-forest-deep !font-semibold !text-sm",
            description: "!text-mist !text-[13px]",
            actionButton:
              "!bg-forest !text-white !rounded-full !text-xs !font-semibold",
            cancelButton:
              "!bg-sand-soft !text-forest !rounded-full !text-xs",
            closeButton:
              "!bg-cream !border-hairline !text-mist hover:!text-forest",
            success: "[&_[data-icon]]:!text-forest",
            error: "[&_[data-icon]]:!text-destructive",
          },
        }}
      />
    </GoogleOAuthProvider>
  );
}
