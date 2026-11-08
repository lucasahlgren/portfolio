import { NextStudio } from "next-sanity/studio";

import { isSanityConfigured } from "@/lib/sanity/env";

import config from "../../../../../sanity.config";

export { metadata, viewport } from "next-sanity/studio";

export function generateStaticParams() {
  return [{ tool: [] }];
}

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main className="grid min-h-dvh place-items-center p-8 text-center">
        <div className="max-w-md space-y-3">
          <h1 className="text-2xl font-medium">Sanity isn&apos;t configured</h1>
          <p className="text-muted-foreground">
            Add <code className="font-mono">NEXT_PUBLIC_SANITY_PROJECT_ID</code> to{" "}
            <code className="font-mono">apps/web/.env.local</code> and restart the dev server.
          </p>
        </div>
      </main>
    );
  }
  return <NextStudio config={config} />;
}
