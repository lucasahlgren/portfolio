"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function CopyEmailButton({ email }: { email: string }) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      toast.success("Email copied", { description: email });
    } catch {
      toast.error("Couldn't copy — try selecting the address instead.");
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon-sm" onClick={copy} aria-label="Copy email address">
          <Copy />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Copy email</TooltipContent>
    </Tooltip>
  );
}
