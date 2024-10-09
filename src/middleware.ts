import { NextResponse, type NextRequest } from "next/server";
import { setAnonymousIdIfNeeded } from "@/lib/anonymousId";
import { setRootContextIfNeeded } from "./lib/rootContext";

export const config = {
  matcher: "/(.*)",
};

export function middleware(req: NextRequest): NextResponse {
  const res = NextResponse.next();

  setAnonymousIdIfNeeded(req, res);
  // Store context data in the cookie for demo purposes.
  setRootContextIfNeeded(req, res);

  return res;
}
