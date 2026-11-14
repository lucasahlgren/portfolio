"use client";

import { ScanEye } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";

import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { parseReviewHash, subscribeToHash } from "@/lib/review/browser";

const getHash = () => window.location.hash;
const getServerHash = () => "";

export function ReviewModeToggle() {
  const hash = useSyncExternalStore(subscribeToHash, getHash, getServerHash);
  const linked = parseReviewHash(hash) !== null;
  const [enabled, setEnabled] = useState(false);
  const [wasLinked, setWasLinked] = useState(false);

  if (linked !== wasLinked) {
    setWasLinked(linked);
    if (linked) setEnabled(true);
  }

  useEffect(() => {
    document.documentElement.toggleAttribute("data-review-mode", enabled);
    return () => document.documentElement.removeAttribute("data-review-mode");
  }, [enabled]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle
          pressed={enabled}
          onPressedChange={setEnabled}
          aria-label="Show the parts of this page you can review"
          className="size-8 rounded-full"
        >
          <ScanEye className="size-4" />
        </Toggle>
      </TooltipTrigger>
      <TooltipContent>{enabled ? "Hide review mode" : "Review mode"}</TooltipContent>
    </Tooltip>
  );
}
