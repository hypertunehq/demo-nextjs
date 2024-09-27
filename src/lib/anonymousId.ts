import "server-only";

import { NextResponse, type NextRequest } from "next/server";
import {
  ResponseCookies,
  RequestCookies,
} from "next/dist/server/web/spec-extension/cookies";
import { nanoid } from "nanoid";
import { cookies } from "next/headers";

const cookieName = "hypertuneAnonymousId";

export function getAnonymousId(): string | null {
  return cookies().get(cookieName)?.value ?? null;
}

export function setAnonymousIdIfNeeded(
  req: NextRequest,
  res: NextResponse,
): void {
  const cookie = req.cookies.get(cookieName);
  if (cookie) {
    return;
  }

  const newAnonymousId = nanoid();
  res.cookies.set({
    name: cookieName,
    value: newAnonymousId,
    path: "/",
  });

  // Apply the new cookie to the request
  applySetCookie(req, res);
}

/**
 * Copy cookies from the Set-Cookie header of the response to the Cookie header
 * of the request so that it will appear to SSR/RSC as if the user already has
 * the new cookies.
 */
function applySetCookie(req: NextRequest, res: NextResponse): void {
  // 1. Parse Set-Cookie header from the response
  const setCookies = new ResponseCookies(res.headers);

  // 2. Construct updated Cookie header for the request
  const newReqHeaders = new Headers(req.headers);
  const newReqCookies = new RequestCookies(newReqHeaders);
  setCookies.getAll().forEach((cookie) => newReqCookies.set(cookie));

  // 3. Set up the "request header overrides" on a dummy response
  // See https://github.com/vercel/next.js/pull/41380
  // NextResponse.next will set x-middleware-override-headers and
  // x-middleware-request-* headers
  const dummyRes = NextResponse.next({ request: { headers: newReqHeaders } });

  // 4. Copy the "request header overrides" headers from the dummy response to
  // the real response
  dummyRes.headers.forEach((value, key) => {
    if (
      key === "x-middleware-override-headers" ||
      key.startsWith("x-middleware-request-")
    ) {
      res.headers.set(key, value);
    }
  });
}
