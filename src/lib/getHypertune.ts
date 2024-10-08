import "server-only";
import { unstable_noStore as noStore } from "next/cache";
import { createSource } from "@/generated/hypertune";
import { getAnonymousId } from "./anonymousId";
import { getRootContext } from "./rootContext";

const hypertuneSource = createSource({
  token: process.env.NEXT_PUBLIC_HYPERTUNE_TOKEN!,
});

export default async function getHypertune() {
  noStore();
  await hypertuneSource.initIfNeeded(); // Check for flag updates

  const context = getRootContext();

  if (context) {
    return hypertuneSource.root({
      args: {
        context: { ...context, environment: process.env.NODE_ENV },
      },
    });
  }

  const anonymousId = getAnonymousId() ?? "";

  return hypertuneSource.root({
    args: {
      context: {
        environment: process.env.NODE_ENV,
        user: {
          id: anonymousId,
          name: "Test",
          email: "hi@test.com",
          country: "UnitedKingdom",
        },
        organization: { id: "123", name: "Example Org", plan: "free" },
      },
    },
  });
}
