import { Compass } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[60dvh] py-24">
      <Empty>
        <EmptyHeader className="max-w-xl">
          <EmptyMedia variant="icon">
            <Compass />
          </EmptyMedia>
          <p className="eyebrow">Error 404</p>
          <EmptyTitle className="text-5xl font-medium tracking-tighter sm:text-7xl">
            Lost in the <span className="font-serif font-normal text-brand italic">frame</span>
          </EmptyTitle>
          <EmptyDescription className="text-lg">
            The page you&apos;re looking for doesn&apos;t exist or has moved.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild size="lg" className="h-11 rounded-full px-6">
            <Link href="/">Back home</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </section>
  );
}
