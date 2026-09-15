"use client";

import * as React from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import getProfile from "@/helpers/next-fetch/getProfile";

/**
 * SessionGuard is a silent client-side sentinel.
 * If a user is active in their browser and an admin blocks them in MongoDB,
 * this component automatically verifies their session on window focus or route transitions,
 * instantly clears their cookies, and redirects them to login without waiting for manual logout.
 */
export function SessionGuard() {
  const isCheckingRef = React.useRef(false);

  React.useEffect(() => {
    const checkActiveSession = async () => {
      // Only check if an access token exists in browser cookies
      const token = Cookies.get("accessToken");
      if (!token || isCheckingRef.current) return;

      try {
        isCheckingRef.current = true;
        const profile = await getProfile();

        // If token existed but profile returned null, user was blocked or deleted
        if (!profile) {
          Cookies.remove("accessToken", { path: "/" });
          Cookies.remove("role", { path: "/" });

          try {
            localStorage.removeItem("user");
          } catch {}

          toast.error("Your session is no longer active or your account has been blocked.", {
            duration: 6000,
          });

          window.location.href = "/login?blocked=1";
        }
      } catch {
        // Network glitches shouldn't log users out
      } finally {
        isCheckingRef.current = false;
      }
    };

    // Check when user returns to this tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkActiveSession();
      }
    };

    const handleFocus = () => {
      checkActiveSession();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Also run an initial passive check after mount
    const initialTimer = setTimeout(() => {
      checkActiveSession();
    }, 2000);

    return () => {
      clearTimeout(initialTimer);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null;
}

export default SessionGuard;
