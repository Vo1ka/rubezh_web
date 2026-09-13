import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function middleware(request: NextRequest) {
  // If Supabase isn't configured there's nothing to gate against — let it through
  // rather than lock everyone out.
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return NextResponse.next();
  }

  const token = request.cookies.get("access_token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/request-access", request.url));
  }

  let status: string | null = null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/check_access_status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ p_token: token }),
    });
    if (res.ok) {
      const data = await res.json();
      status = typeof data === "string" ? data : null;
    }
  } catch {
    // Network hiccup talking to Supabase from the edge — fail closed (send to
    // the gate) rather than let an unverifiable visitor through.
    status = null;
  }

  if (status === "approved") {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/request-access", request.url));
}

export const config = {
  matcher: [
    "/((?!request-access|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
