import Link from "next/link";

import { CopyEmailButton } from "@/components/copy-email-button";
import { SocialIcon, socialLabels } from "@/components/social-icon";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { navItems } from "@/lib/nav";
import { getSettings } from "@/lib/sanity/queries";

export async function SiteFooter() {
  const settings = await getSettings();
  const year = await currentYear();

  return (
    <footer className="mt-32">
      <Separator />
      <div className="container-page py-16 sm:py-24">
        <div className="grid gap-10 text-sm sm:grid-cols-3">
          <div className="space-y-2">
            <p className="eyebrow">Contact</p>
            {settings?.email && (
              <div className="flex items-center gap-1">
                <a href={`mailto:${settings.email}`} className="link-underline">
                  {settings.email}
                </a>
                <CopyEmailButton email={settings.email} />
              </div>
            )}
            {settings?.location && <p className="text-muted-foreground">{settings.location}</p>}
          </div>

          <nav aria-label="Footer" className="space-y-2">
            <p className="eyebrow">Pages</p>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="link-underline block w-fit">
                {item.label}
              </Link>
            ))}
          </nav>

          {settings?.socials && settings.socials.length > 0 && (
            <div className="space-y-3">
              <p className="eyebrow">Socials</p>
              <div className="flex flex-wrap gap-1">
                {settings.socials.map((social) => (
                  <Tooltip key={social._key}>
                    <TooltipTrigger asChild>
                      <Button asChild variant="outline" size="icon" className="rounded-full">
                        <a
                          href={social.url}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={socialLabels[social.platform]}
                        >
                          <SocialIcon platform={social.platform} />
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{socialLabels[social.platform]}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          )}
        </div>

        <Separator className="mt-16" />
        <div className="label mt-6 text-xs text-muted-foreground">
          <p>
            © {year} {settings?.name ?? "Lucas Ahlgren"}
          </p>
        </div>
      </div>
    </footer>
  );
}

async function currentYear() {
  "use cache";
  return new Date().getFullYear();
}
