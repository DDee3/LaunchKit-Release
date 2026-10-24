import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") || searchParams.get("redirectTo");

  // Prevent Open Redirect (CWE-601): Enforce strictly local, non-protocol-relative path
  const isSafeRelativePath =
    typeof rawNext === "string" &&
    rawNext.startsWith("/") &&
    !rawNext.startsWith("//") &&
    !rawNext.includes("\\") &&
    !rawNext.includes("://");

  const safePath = isSafeRelativePath ? rawNext : "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Prevent Host Header Injection: Use configured app URL if available, fallback to request origin
      const configuredAppUrl = process.env.NEXT_PUBLIC_APP_URL;
      let targetOrigin = origin;

      if (configuredAppUrl) {
        try {
          targetOrigin = new URL(configuredAppUrl).origin;
        } catch {
          targetOrigin = origin;
        }
      }

      return NextResponse.redirect(`${targetOrigin}${safePath}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
