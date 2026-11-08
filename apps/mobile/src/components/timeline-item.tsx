import type { SanityImage as SanityImageType } from "@portfolio/content";
import type { ReactNode } from "react";
import { Image } from "expo-image";
import { View } from "react-native";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { imageUrl } from "@/lib/sanity";
import { cn } from "@/lib/utils";

type Props = {
  period: string;
  title: string;
  subtitle: string;
  logo?: SanityImageType | null;
  current?: boolean;
  first?: boolean;
  children?: ReactNode;
};

export function TimelineItem({ period, title, subtitle, logo, current, first, children }: Props) {
  const logoUri = imageUrl(logo, 144, "png");
  const initials = subtitle
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <View>
      {!first && <Separator />}
      <View className="flex-row gap-4 py-6">
        <View className="size-12 items-center justify-center overflow-hidden rounded-xl border border-border bg-white">
          {logoUri ? (
            <Image
              source={{ uri: logoUri }}
              accessibilityLabel={logo?.alt || subtitle}
              contentFit="contain"
              style={{ width: 40, height: 40 }}
            />
          ) : (
            <Text className="text-xs font-medium text-neutral-900">{initials}</Text>
          )}
        </View>
        <View className="flex-1 gap-1">
          <Badge
            variant="outline"
            className={cn(
              "mb-1 self-start rounded-full",
              current && "border-success/40 bg-success/10",
            )}
          >
            <Text className={cn("font-label-semi tabular-nums", current && "text-success")}>
              {period}
            </Text>
          </Badge>
          <Text className="text-lg font-semibold tracking-tight">{title}</Text>
          <Text className="text-muted-foreground">{subtitle}</Text>
          {children}
        </View>
      </View>
    </View>
  );
}
