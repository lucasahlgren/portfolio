import type { ReactNode } from "react";
import { View } from "react-native";

import { Headline } from "@/components/headline";
import { Eyebrow } from "@/components/screen";
import { Text } from "@/components/ui/text";

export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <View className="mb-10 gap-4 pt-2">
      <Eyebrow>{eyebrow}</Eyebrow>
      <Headline text={title} className="text-[42px] leading-[44px] tracking-[-1.4px]" />
      {children && <Text className="text-[17px] leading-7 text-muted-foreground">{children}</Text>}
    </View>
  );
}
