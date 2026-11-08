import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

export function SectionHeading({
  id,
  eyebrow,
  title,
  href,
  linkLabel = "View all",
}: {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4 sm:mb-14">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id} className="mt-3 text-3xl font-medium tracking-tighter sm:text-5xl">
          {title}
        </h2>
      </div>
      {href && (
        <Button asChild variant="ghost" className="group rounded-full text-muted-foreground">
          <Link href={href}>
            {linkLabel}
            <ArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      )}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="container-page pt-16 pb-12 sm:pt-24 sm:pb-16">
      <p className="eyebrow animate-fade-up">{eyebrow}</p>
      <h1 className="mt-4 max-w-4xl animate-fade-up text-5xl font-medium tracking-tighter text-balance [animation-delay:80ms] sm:text-7xl lg:text-8xl">
        {title}
      </h1>
      {children && (
        <div className="mt-6 max-w-2xl animate-fade-up text-lg text-pretty text-muted-foreground [animation-delay:160ms]">
          {children}
        </div>
      )}
    </header>
  );
}
