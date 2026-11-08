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

export function shuffle<T>(items: T[], seed: number): T[] {
  let state = Math.floor(seed * 2 ** 32) >>> 0;
  const random = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
