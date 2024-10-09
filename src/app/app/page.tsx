import { RootNode } from "@/generated/hypertune";
import RatingButtons from "@/lib/components/RatingButtons";
import getHypertune from "@/lib/getHypertune";
import getOpenAI, { parseHypertunePrompt } from "@/lib/openai";
import { Suspense } from "react";

export default async function AppHomePage() {
  const hypertune = await getHypertune();

  return (
    <div className="flex flex-col items-end gap-2 rounded-lg border border-intent-primary bg-intent-primary/5 p-2 text-intent-primary">
      <Suspense
        fallback={
          <p className="w-full">{hypertune.ai().loadingMessage({ fallback: "Loading..." })}</p>
        }
      >
        <AIMessage hypertune={hypertune} />
      </Suspense>
    </div>
  );
}

async function AIMessage({ hypertune }: { hypertune: RootNode }) {
  const openai = getOpenAI();
  let message = "";

  try {
    const resp = await openai.chat.completions.create(
      parseHypertunePrompt(hypertune.ai().featureSuggestionPrompt().get()),
    );
    message = resp.choices[0]?.message.content ?? "";
  } catch (error) {
    console.error("Failed to query OpenAI", { error });
    message = "Unexpected error"
  }

  return (
    <>
      <p>{message}</p>
      <RatingButtons />
    </>
  );
}
