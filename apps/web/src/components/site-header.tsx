import Link from "next/link";

import { Logo } from "@/components/logo";
import { DesktopNav, MobileNav } from "@/components/site-nav";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-background/75 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          aria-label="Home"
          className="rounded-sm transition-opacity hover:opacity-70 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <Logo className="h-5 w-auto sm:h-6" />
        </Link>

        <DesktopNav />

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
