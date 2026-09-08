"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  GoogleLogin,
  CredentialResponse,
  useGoogleOAuth,
} from "@react-oauth/google";
import { Loader2 } from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "sonner";

import { loginWithGoogle } from "@/helpers/next-fetch/authActions";

export interface GoogleButtonProps {
  label?: string;
  redirectTo?: string;
  text?: "continue_with" | "signin_with" | "signup_with" | "signin";
  shape?: "rectangular" | "pill";
  theme?: "outline" | "filled_blue" | "filled_black";
  onSuccessCallback?: (data: any) => void;
}

export function GoogleButton({
  label,
  redirectTo,
  text = "continue_with",
  shape = "rectangular",
  theme = "outline",
  onSuccessCallback,
}: GoogleButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const { clientId, scriptLoadedSuccessfully } = useGoogleOAuth();

  const segments = pathname ? pathname.split("/") : [];
  const currentLocale = segments[1] === "ht" ? "ht" : "en";
  const isHt = currentLocale === "ht";

  // Compute destination
  const rawRedirect = searchParams?.get("redirect");
  const defaultRedirect = rawRedirect
    ? rawRedirect.startsWith("http")
      ? rawRedirect
      : rawRedirect.startsWith(`/${currentLocale}`)
        ? rawRedirect
        : `/${currentLocale}${rawRedirect.startsWith("/") ? rawRedirect : `/${rawRedirect}`}`
    : `/${currentLocale}`;

  const targetRedirect = redirectTo || defaultRedirect;

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    if (!credentialResponse.credential) {
      toast.error(
        isHt
          ? "Google pa bay enfòmasyon idantifikasyon ki nesesè yo."
          : "Failed to obtain Google credentials.",
        { id: "google-login" },
      );
      return;
    }

    setIsProcessing(true);
    try {
      const response = await loginWithGoogle(credentialResponse.credential);

      if (response?.success && response?.data?.createToken) {
        const token = response.data.createToken;
        Cookies.set("accessToken", token, { expires: 30 });

        // Extract role from response data or decode from JWT
        let role = response.data?.role;
        if (!role) {
          try {
            const base64Url = token.split(".")[1];
            if (base64Url) {
              const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
              const jsonPayload = decodeURIComponent(
                atob(base64)
                  .split("")
                  .map(
                    (c) =>
                      "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2),
                  )
                  .join(""),
              );
              const payload = JSON.parse(jsonPayload);
              role = payload?.role;
            }
          } catch {
            // Ignore decode fallback error
          }
        }

        if (role) {
          Cookies.set("role", role, { expires: 30 });
        }

        toast.success(
          response.message ||
            (isHt
              ? "Koneksyon an reyisi avèk Google! Byenveni."
              : "Signed in with Google successfully!"),
          { id: "google-login" },
        );

        if (onSuccessCallback) {
          onSuccessCallback(response.data);
        }

        router.replace(targetRedirect);
        router.refresh();
        return;
      }

      if (response?.error && Array.isArray(response.error)) {
        response.error.forEach((err: { message: string }) => {
          toast.error(err.message, { id: "google-login" });
        });
      } else {
        toast.error(
          response?.message ||
            (isHt
              ? "Koneksyon Google la echwe. Tanpri eseye ankò."
              : "Google sign-in failed. Please try again."),
          { id: "google-login" },
        );
      }
    } catch (err) {
      console.error("Google authentication error:", err);
      toast.error(
        isHt
          ? "Erè nan rezo a pandan koneksyon Google la. Tanpri eseye ankò."
          : "Network error during Google sign-in. Please try again.",
        { id: "google-login" },
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGoogleError = () => {
    toast.error(
      isHt
        ? "Koneksyon Google la pa t reyisi oswa li te anile."
        : "Google login was cancelled or failed.",
      { id: "google-login" },
    );
  };

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [buttonWidth, setButtonWidth] = React.useState<number | undefined>(
    undefined,
  );

  React.useEffect(() => {
    if (!containerRef.current) return;

    const measureWidth = () => {
      if (containerRef.current) {
        const clientWidth = containerRef.current.getBoundingClientRect().width;
        if (clientWidth > 0) {
          // Google GSI button width must be between 200px and 400px
          const clamped = Math.min(Math.max(Math.floor(clientWidth), 200), 400);
          setButtonWidth(clamped);
        }
      }
    };

    measureWidth();

    const resizeObserver = new ResizeObserver(() => {
      measureWidth();
    });
    resizeObserver.observe(containerRef.current);

    window.addEventListener("resize", measureWidth);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measureWidth);
    };
  }, []);

  return (
    <div className="relative flex w-full flex-col items-center justify-center gap-2">
      {isProcessing && (
        <div className="absolute inset-0 z-20 flex items-center justify-center gap-2 rounded-xl bg-white/90 backdrop-blur-xs">
          <Loader2 className="h-5 w-5 animate-spin text-forest" />
          <span className="text-xs font-semibold text-forest-deep">
            {isHt
              ? "Otorizasyon ap verifye..."
              : "Authenticating with Google..."}
          </span>
        </div>
      )}

      <div
        ref={containerRef}
        className="w-full flex justify-center items-center overflow-hidden rounded-xl min-h-11"
      >
        <div className="w-full flex justify-center max-w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme={theme}
            shape={shape}
            size="large"
            text={text}
            width={buttonWidth ? `${buttonWidth}` : undefined}
            logo_alignment="left"
            containerProps={{
              className: "w-full flex justify-center",
              style: {
                width: buttonWidth ? `${buttonWidth}px` : "100%",
                maxWidth: "100%",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function AuthDivider({ label = "or" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-hairline" />
      <span className="text-[11px] font-semibold uppercase tracking-wider text-mist">
        {label}
      </span>
      <span className="h-px flex-1 bg-hairline" />
    </div>
  );
}
