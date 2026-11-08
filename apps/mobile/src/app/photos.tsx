import { photoCategoriesOf, photosQuery, shuffle, type Photo } from "@portfolio/content";
import { useState } from "react";
import { Pressable, useWindowDimensions, View } from "react-native";

import { SanityImage } from "@/components/sanity-image";
import { FilterPills } from "@/components/filter-pills";
import { PageHeader } from "@/components/page-header";
import { Screen } from "@/components/screen";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Text } from "@/components/ui/text";
import { useSanityQuery } from "@/hooks/use-sanity-query";

const GAP = 8;
const dateFormat = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" });

export default function PhotosScreen() {
  const { width } = useWindowDimensions();
  const [selected, setSelected] = useState<Photo | null>(null);
  const [category, setCategory] = useState("all");
  const [seed] = useState(Math.random);
  const { data, loading, error, refreshing, refresh } = useSanityQuery<Photo[]>(photosQuery);
  const columnWidth = (Math.min(width, 672) - 48 - GAP) / 2;

  const columns: Photo[][] = [[], []];
  const heights = [0, 0];
  const allPhotos = shuffle(data ?? [], seed);
  const categories = photoCategoriesOf(allPhotos);
  const photos =
    category === "all" ? allPhotos : allPhotos.filter((p) => p.category?.slug === category);

  for (const photo of photos) {
    const i = heights[0] <= heights[1] ? 0 : 1;
    columns[i].push(photo);
    heights[i] += 1 / (photo.image.dimensions?.aspectRatio ?? 1);
  }

  return (
    <Screen loading={loading} error={error} refreshing={refreshing} onRefresh={refresh}>
      <PageHeader eyebrow="Photography" title="Moments, *framed*">
        Photography is how I express my creative side, from floorball and tennis to wildlife and
        city skylines.
      </PageHeader>
      {categories.length > 1 && (
        <FilterPills
          value={category}
          onChange={setCategory}
          options={[
            { value: "all", label: "All", count: allPhotos.length },
            ...categories.map((c) => ({ value: c.slug, label: c.title, count: c.count })),
          ]}
        />
      )}
      <View className="flex-row" style={{ gap: GAP }}>
        {columns.map((column, c) => (
          <View key={c} style={{ width: columnWidth, gap: GAP }}>
            {column.map((photo) => (
              <Pressable
                key={photo._id}
                onPress={() => setSelected(photo)}
                accessibilityLabel={`Open ${photo.title}`}
                className="active:opacity-80"
              >
                <SanityImage
                  image={photo.image}
                  width={columnWidth}
                  className="w-full rounded-xl bg-muted"
                />
              </Pressable>
            ))}
          </View>
        ))}
      </View>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="w-[92vw] max-w-2xl gap-4 p-4">
          {selected && (
            <>
              <SanityImage
                image={selected.image}
                width={width}
                contentFit="contain"
                className="max-h-[65vh] w-full rounded-lg"
              />
              <DialogHeader className="items-start">
                <DialogTitle>{selected.title}</DialogTitle>
                <DialogDescription className="sr-only">Photo details</DialogDescription>
                <View className="flex-row flex-wrap gap-1.5">
                  {selected.category && (
                    <Badge variant="outline" className="rounded-full">
                      <Text className="font-label-semi">{selected.category.title}</Text>
                    </Badge>
                  )}
                  {selected.takenAt && (
                    <Badge variant="secondary" className="rounded-full">
                      <Text className="font-label-semi">
                        {dateFormat.format(new Date(selected.takenAt))}
                      </Text>
                    </Badge>
                  )}
                </View>
              </DialogHeader>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Screen>
  );
}
