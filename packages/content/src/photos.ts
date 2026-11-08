import type { Photo, PhotoCategory } from "./types";

export function photoCategoriesOf(photos: Photo[]): (PhotoCategory & { count: number })[] {
  const bySlug = new Map<string, PhotoCategory & { count: number }>();
  for (const photo of photos) {
    if (!photo.category) continue;
    const existing = bySlug.get(photo.category.slug);
    if (existing) existing.count++;
    else bySlug.set(photo.category.slug, { ...photo.category, count: 1 });
  }
  return [...bySlug.values()].sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}
