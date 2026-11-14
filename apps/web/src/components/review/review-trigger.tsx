"use client";

import type { ReviewSectionKey } from "@portfolio/content";
import { CodeXml } from "lucide-react";
import { Suspense, useState, useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { clearReviewHash, parseReviewHash, subscribeToHash } from "@/lib/review/browser";
import type { ReviewPanelData } from "@/lib/review/types";

import { ReviewPanel } from "./review-panel";

const requests = new Map<ReviewSectionKey, Promise<ReviewPanelData | null>>();

function loadPanel(section: ReviewSectionKey) {
  const cached = requests.get(section);
  if (cached) return cached;

  const request = fetch(`/api/review/${section}`)
    .then((response) => (response.ok ? (response.json() as Promise<ReviewPanelData>) : null))
    .catch(() => null)
    .then((data) => {
      if (!data) requests.delete(section);
      return data;
    });
  requests.set(section, request);
  return request;
}

const getHash = () => window.location.hash;
const getServerHash = () => "";

export function ReviewTrigger({
  section,
  title,
  commentCount,
  compact,
}: {
  section: ReviewSectionKey;
  title: string;
  commentCount: number;
  compact?: boolean;
}) {
  const hash = useSyncExternalStore(subscribeToHash, getHash, getServerHash);
  const target = parseReviewHash(hash);
  const linked = target?.section === section ? target : null;
  const [open, setOpen] = useState(false);
  const isOpen = open || Boolean(linked);
  const label = commentCount === 1 ? "1 comment" : `${commentCount} comments`;

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next && linked) clearReviewHash();
  }

  const trigger = compact ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Review this code"
            className="hidden rounded-full [[data-review-mode]_&]:inline-flex"
          >
            <CodeXml className="size-4" />
          </Button>
        </SheetTrigger>
      </TooltipTrigger>
      <TooltipContent>Review this code</TooltipContent>
    </Tooltip>
  ) : (
    <SheetTrigger asChild>
      <Button
        variant="outline"
        className="h-8 rounded-full bg-background/80 px-3 font-mono text-xs backdrop-blur"
      >
        <CodeXml className="size-3.5" />
        Review this code
        {commentCount > 0 && <span className="text-muted-foreground">· {label}</span>}
      </Button>
    </SheetTrigger>
  );

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      {trigger}
      <SheetContent className="gap-0 data-[side=right]:w-full data-[side=right]:sm:max-w-3xl">
        <SheetHeader className="border-b pr-12">
          <p className="eyebrow">Code review</p>
          <SheetTitle className="text-xl tracking-tight">{title}</SheetTitle>
          <SheetDescription className="sr-only">
            The source code behind this part of the site, with comments from visitors.
          </SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {isOpen && (
            <Suspense fallback={<PanelSkeleton />}>
              <ReviewPanel request={loadPanel(section)} target={linked} />
            </Suspense>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function PanelSkeleton() {
  return (
    <div className="space-y-3 p-4" aria-busy="true">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="mt-6 h-96 w-full rounded-lg" />
    </div>
  );
}
