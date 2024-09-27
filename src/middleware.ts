import { NextResponse, type NextRequest } from "next/server";
import { setAnonymousIdIfNeeded } from "@/lib/anonymousId";

export const config = {
  matcher: "/",
};

export function middleware(req: NextRequest): NextResponse {
  const res = NextResponse.next();

  setAnonymousIdIfNeeded(req, res);

  return res;
}
