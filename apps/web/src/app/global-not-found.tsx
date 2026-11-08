import type { Metadata } from "next";
import Link from "next/link";

import { fontVariables } from "@/lib/fonts";

import "./globals.css";

export const metadata: Metadata = {
  title: "Not found",
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${fontVariables} antialiased`}>
      <body className="grid min-h-dvh place-items-center bg-background text-foreground">
        <main className="container-page py-24">
          <p className="eyebrow">Error 404</p>
          <h1 className="mt-4 text-6xl font-medium tracking-tighter sm:text-8xl">
            Lost in the <span className="font-serif font-normal text-brand italic">frame</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has moved.
          </p>
          <Link
            href="/"
            className="mt-10 inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground"
          >
            Back home
          </Link>
        </main>
      </body>
    </html>
  );
}
