"use client";

import { useHypertune } from "@/generated/hypertune.react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Landing(): React.ReactElement {
  const hypertune = useHypertune();
  const isReady = hypertune.isReady();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isReady) {
      return;
    }
    hypertune.events().pageView({
      args: {
        href: `${window.location.origin}${pathname}?${searchParams.toString()}`,
        userAgent: navigator.userAgent,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, pathname, searchParams]);

  const content = hypertune.landing();
  const headline = content.headline({ fallback: "Welcome to Potion" });
  const layout = content.layout({ fallback: "vertical" });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-intent-primary to-intent-success text-white">
      <div className={`container flex ${layout === "vertical" ? "flex-col" : "flex-row"} items-center justify-center gap-12 px-4 py-16`}>
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          {headline}
        </h1>
        <Link
          className="rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
          href="/app"
          onClick={() => {
            hypertune.events().signUp({
              args: { userAgent: navigator.userAgent },
            });
          }}
        >
          <h3 className="text-2xl font-bold">Sign up →</h3>
        </Link>
      </div>
    </main>
  );
}
