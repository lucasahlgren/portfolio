import type { Metadata, Viewport } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { fontVariables } from "@/lib/fonts";
import { siteUrl } from "@/lib/sanity/env";
import { imageUrl } from "@/lib/sanity/image";
import { getSettings } from "@/lib/sanity/queries";

import "../globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const name = settings?.name ?? "Lucas Ahlgren";
  const title = settings?.seo?.title ?? `${name} — ${settings?.role ?? "Media engineer"}`;
  const description = settings?.seo?.description ?? settings?.intro ?? undefined;
  const ogImage = imageUrl(settings?.seo?.ogImage ?? settings?.portrait, 1200);

  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s — ${name}` },
    description,
    openGraph: {
      type: "website",
      siteName: name,
      title,
      description,
      images: ogImage ? [{ url: ogImage, width: 1200 }] : undefined,
    },
    twitter: { card: "summary_large_image" },
    alternates: { canonical: "/" },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfcfc" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
};

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${fontVariables} antialiased`}
    >
      <body className="min-h-dvh">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <TooltipProvider delayDuration={200}>
            <div className="flex min-h-dvh flex-col">
              <a
                href="#main"
                className="sr-only z-50 rounded-full bg-foreground px-4 py-2 text-background focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
              >
                Skip to content
              </a>
              <SiteHeader />
              <main id="main" className="flex-1">
                {children}
              </main>
              <SiteFooter />
            </div>
          </TooltipProvider>
          <Toaster position="bottom-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
