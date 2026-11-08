import type { Metadata } from "next";

import { EmptyState } from "@/components/empty-state";
import { PhotoGallery } from "@/components/photo-gallery";
import { PageHeader } from "@/components/section-heading";
import { getPhotos } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Photography",
  description: "Sports, nature and travel photography.",
  alternates: { canonical: "/photography" },
};

export default async function PhotographyPage() {
  const photos = await getPhotos();

  return (
    <>
      <PageHeader
        eyebrow="Photography"
        title={
          <>
            Moments, <span className="font-serif font-normal italic">framed</span>
          </>
        }
      >
        Photography is how I express my creative side, from floorball and tennis to wildlife and
        city skylines.
      </PageHeader>

      <section className="container-page">
        {photos.length > 0 ? <PhotoGallery photos={photos} /> : <EmptyState type="photos" />}
      </section>
    </>
  );
}
