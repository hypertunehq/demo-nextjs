import "server-only";

import { NextResponse, type NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { cookies } from "next/headers";
import { RootArgs } from "@/generated/hypertune";
import { applySetCookie, getAnonymousId } from "./anonymousId";

const cookieName = "hypertuneContext";

export type Context = Pick<RootArgs["context"], "user" | "organization">;

export function getRootContext(): Context | null {
  return JSON.parse(
    cookies().get(cookieName)?.value ?? "null",
  ) as Context | null;
}

export function setRootContextIfNeeded(
  req: NextRequest,
  res: NextResponse,
): void {
  const cookie = req.cookies.get(cookieName);
  if (cookie) {
    return;
  }

  const newContext = {
    user: {
      id: getAnonymousId() ?? nanoid(),
      name: "Test",
      email: "hi@test.com",
      country: "UnitedKingdom",
    },
    organization: { id: "123", name: "Example Org", plan: "free" },
  }

  res.cookies.set({
    name: cookieName,
    value: JSON.stringify(newContext),
    path: "/",
  });
  applySetCookie(req, res)
}
