"use client";

import { photoCategoriesOf, shuffle } from "@portfolio/content";
import type { Photo } from "@portfolio/content/types";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useState, useSyncExternalStore, type KeyboardEvent } from "react";

import { SanityImage } from "@/components/sanity-image";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

const dateFormat = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" });

const visitSeed = Math.random();
const subscribe = () => () => {};

export function PhotoGallery({ photos: sourcePhotos }: { photos: Photo[] }) {
  const seed = useSyncExternalStore(
    subscribe,
    () => visitSeed,
    () => null,
  );
  const allPhotos = seed === null ? sourcePhotos : shuffle(sourcePhotos, seed);
  const [category, setCategory] = useState("all");
  const [openAt, setOpenAt] = useState<number | null>(null);
  const [loadedId, setLoadedId] = useState<string | null>(null);

  const categories = photoCategoriesOf(allPhotos);
  const photos =
    category === "all" ? allPhotos : allPhotos.filter((p) => p.category?.slug === category);
  const photo = openAt !== null ? photos[openAt] : null;
  const ratio = photo?.image.dimensions?.aspectRatio ?? 1.5;

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
          className="flex w-fit max-w-[92vw] flex-col gap-4 bg-background p-4 sm:max-w-[92vw] sm:p-6"
        >
          {photo && (
            <>
              <DialogTitle className="sr-only">{photo.title}</DialogTitle>
              <DialogDescription className="sr-only">
                Photo {openAt! + 1} of {photos.length}. Use the arrow keys to browse.
              </DialogDescription>

              <div
                className="relative mx-auto overflow-hidden rounded-lg"
                style={{
                  aspectRatio: ratio,
                  width: `min(calc(92vw - 3rem), calc(75dvh * ${ratio}))`,
                }}
              >
                <SanityImage
                  key={photo._id}
                  image={photo.image}
                  alt={photo.image.alt || photo.title}
                  fill
                  priority
                  blur={false}
                  onLoad={() => setLoadedId(photo._id)}
                  sizes="92vw"
                  className={cn(
                    "object-contain transition-opacity duration-300",
                    loadedId === photo._id ? "opacity-100" : "opacity-0",
                  )}
                />
                {loadedId !== photo._id && (
                  <Skeleton
                    className="absolute inset-0 flex items-center justify-center rounded-lg bg-foreground/10"
                    aria-hidden="true"
                  >
                    <Loader2 className="size-6 animate-spin text-muted-foreground" />
                  </Skeleton>
                )}
                {photos.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => step(-1)}
                      aria-label="Previous photo"
                      className="group/prev absolute inset-y-0 left-0 flex w-1/3 cursor-pointer items-center justify-start pl-3 focus-visible:outline-none"
                    >
                      <span className="grid size-10 place-items-center rounded-full bg-secondary/80 text-secondary-foreground shadow-sm backdrop-blur transition group-hover/prev:bg-secondary group-focus-visible/prev:ring-2 group-focus-visible/prev:ring-ring">
                        <ChevronLeft className="size-5" />
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => step(1)}
                      aria-label="Next photo"
                      className="group/next absolute inset-y-0 right-0 flex w-1/3 cursor-pointer items-center justify-end pr-3 focus-visible:outline-none"
                    >
                      <span className="grid size-10 place-items-center rounded-full bg-secondary/80 text-secondary-foreground shadow-sm backdrop-blur transition group-hover/next:bg-secondary group-focus-visible/next:ring-2 group-focus-visible/next:ring-ring">
                        <ChevronRight className="size-5" />
                      </span>
                    </button>
                  </>
                )}
              </div>

              <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
                <p className="font-medium">{photo.title}</p>
                <div className="flex items-center gap-1.5">
                  {photo.category && (
                    <Badge variant="outline" className="label rounded-full font-medium">
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
