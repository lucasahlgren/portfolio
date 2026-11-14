"use client";

import { ScanEye } from "lucide-react";
import { useEffect, useState } from "react";

import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function ReviewModeToggle() {
  const [enabled, setEnabled] = useState(false);

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
