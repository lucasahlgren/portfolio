"use client";

import { photoCategoriesOf } from "@portfolio/content";
import type { Photo } from "@portfolio/content/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, type KeyboardEvent } from "react";

import { SanityImage } from "@/components/sanity-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const dateFormat = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" });

export function PhotoGallery({ photos: allPhotos }: { photos: Photo[] }) {
  const [category, setCategory] = useState("all");
  const [openAt, setOpenAt] = useState<number | null>(null);

  const categories = photoCategoriesOf(allPhotos);
  const photos =
    category === "all" ? allPhotos : allPhotos.filter((p) => p.category?.slug === category);
  const photo = openAt !== null ? photos[openAt] : null;

  const step = (direction: 1 | -1) =>
    setOpenAt((i) => (i === null ? i : (i + direction + photos.length) % photos.length));

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") step(1);
    if (event.key === "ArrowLeft") step(-1);
  };

  return (
    <>
      {categories.length > 1 && (
        <ToggleGroup
          type="single"
          variant="outline"
          value={category}
          onValueChange={(value) => {
            if (value) setCategory(value);
          }}
          aria-label="Filter by category"
          className="mb-10 flex-wrap"
        >
          <ToggleGroupItem value="all" className="label rounded-full px-4">
            All <span className="text-muted-foreground tabular-nums">{allPhotos.length}</span>
          </ToggleGroupItem>
          {categories.map((c) => (
            <ToggleGroupItem key={c.slug} value={c.slug} className="label rounded-full px-4">
              {c.title} <span className="text-muted-foreground tabular-nums">{c.count}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      )}

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {photos.map((item, i) => (
          <button
            key={`${category}-${item._id}`}
            type="button"
            onClick={() => setOpenAt(i)}
            aria-label={`Open ${item.title}`}
            className="group relative block w-full animate-fade-up cursor-zoom-in break-inside-avoid overflow-hidden rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <SanityImage
              image={item.image}
              alt={item.image.alt || item.title}
              priority={i < 3}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="h-auto w-full transition duration-700 group-hover:scale-[1.03]"
            />
            <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/70 to-transparent p-4 pt-16 text-left text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="font-medium">{item.title}</span>
            </span>
          </button>
        ))}
      </div>

      <Dialog open={photo !== null} onOpenChange={(open) => !open && setOpenAt(null)}>
        <DialogContent
          onKeyDown={onKeyDown}
          className="flex w-[min(92vw,80rem)] max-w-none flex-col gap-4 bg-background p-4 sm:max-w-none sm:p-6"
        >
          {photo && (
            <>
              <DialogTitle className="sr-only">{photo.title}</DialogTitle>
              <DialogDescription className="sr-only">
                Photo {openAt! + 1} of {photos.length}. Use the arrow keys to browse.
              </DialogDescription>

              <div className="relative h-[70dvh] w-full">
                <SanityImage
                  key={photo._id}
                  image={photo.image}
                  alt={photo.image.alt || photo.title}
                  fill
                  priority
                  sizes="92vw"
                  className="object-contain"
                />
                {photos.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => step(-1)}
                      aria-label="Previous photo"
                      className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full opacity-80 hover:opacity-100"
                    >
                      <ChevronLeft />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => step(1)}
                      aria-label="Next photo"
                      className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full opacity-80 hover:opacity-100"
                    >
                      <ChevronRight />
                    </Button>
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pr-8">
                <p className="font-medium">{photo.title}</p>
                <div className="flex items-center gap-1.5">
                  {photo.category && (
                    <Badge variant="outline" className="rounded-full">
                      {photo.category.title}
                    </Badge>
                  )}
                  {photo.takenAt && (
                    <Badge
                      variant="secondary"
                      className="label rounded-full font-medium tabular-nums"
                    >
                      {dateFormat.format(new Date(photo.takenAt))}
                    </Badge>
                  )}
                  <span className="label ml-1 text-xs text-muted-foreground tabular-nums">
                    {openAt! + 1}/{photos.length}
                  </span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
