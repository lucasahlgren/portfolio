import type { Photo } from "@portfolio/content";
import { Link } from "expo-router";
import { Pressable, ScrollView, useWindowDimensions } from "react-native";

import { SanityImage } from "@/components/sanity-image";

const HEIGHT = 240;

export function PhotoStrip({ photos }: { photos: Pick<Photo, "_id" | "title" | "image">[] }) {
  const { width: screenWidth } = useWindowDimensions();
  const maxWidth = screenWidth * 0.85;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      className="-mx-6"
      contentContainerClassName="gap-3 px-6"
    >
      {photos.map((photo) => {
        const ratio = Math.min(Math.max(photo.image.dimensions?.aspectRatio ?? 0.8, 0.5), 2);
        const width = Math.min(HEIGHT * ratio, maxWidth);
        return (
          <Link key={photo._id} href="/photos" asChild>
            <Pressable
              accessibilityLabel={photo.title}
              className="overflow-hidden rounded-xl active:opacity-80"
              style={{ width, height: HEIGHT }}
            >
              <SanityImage image={photo.image} width={width} fill className="bg-muted" />
            </Pressable>
          </Link>
        );
      })}
    </ScrollView>
  );
}
