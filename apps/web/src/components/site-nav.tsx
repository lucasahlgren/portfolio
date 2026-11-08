"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navItems } from "@/lib/nav";
import { cn } from "@/lib/utils";

const mobileNavItems = [{ href: "/", label: "Home" }, ...navItems];

function useIsActive() {
  const pathname = usePathname();
  return (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function DesktopNav() {
  const isActive = useIsActive();
  return (
    <NavigationMenu viewport={false} className="hidden md:flex">
      <NavigationMenuList className="gap-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <NavigationMenuItem key={item.href}>
              <NavigationMenuLink
                asChild
                active={active}
                className="rounded-full px-3.5 py-1.5 text-sm text-muted-foreground underline-offset-[6px] transition-colors hover:bg-transparent hover:text-foreground focus:bg-transparent data-active:bg-transparent data-active:font-medium data-active:text-foreground data-active:underline data-active:decoration-[1.5px] data-active:hover:bg-transparent data-active:focus:bg-transparent"
              >
                <Link href={item.href} aria-current={active ? "page" : undefined}>
                  {item.label}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const isActive = useIsActive();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full md:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="top"
        className="justify-center gap-0 py-16 data-[side=top]:h-dvh data-[side=top]:border-b-0"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>Site navigation</SheetDescription>
        </SheetHeader>
        <nav aria-label="Main" className="container-page flex flex-col">
          {mobileNavItems.map((item, i) => (
            <Fragment key={item.href}>
              {i > 0 && <Separator />}
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "flex items-center gap-4 py-4 text-3xl font-medium tracking-tight text-muted-foreground transition-colors",
                  isActive(item.href) && "text-foreground",
                )}
              >
                <span
                  className={cn(
                    "label text-xs font-medium text-muted-foreground tabular-nums",
                    isActive(item.href) && "text-brand",
                  )}
                >
                  0{i + 1}
                </span>
                <span
                  className={cn(
                    isActive(item.href) && "underline decoration-2 underline-offset-[10px]",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            </Fragment>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
