import type { SanityImage as SanityImageType } from "@portfolio/content";
import type { ReactNode } from "react";
import { View } from "react-native";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  const logoUri = imageUrl(logo, 120);
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
        <Avatar alt={subtitle} className="size-10 rounded-lg bg-white">
          {logoUri && <AvatarImage source={{ uri: logoUri }} className="rounded-lg" />}
          <AvatarFallback className="rounded-lg">
            <Text className="text-xs font-medium">{initials}</Text>
          </AvatarFallback>
        </Avatar>
        <View className="flex-1 gap-1">
          <Badge
            variant="outline"
            className={cn(
              "mb-1 self-start rounded-full",
              current && "border-success/40 bg-success/10",
            )}
          >
            <Text className={cn("font-medium tabular-nums", current && "text-success")}>
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
