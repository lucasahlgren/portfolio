import type { PortableTextBlock } from "@portfolio/content";
import { View } from "react-native";

import { Text } from "@/components/ui/text";

type Span = { _type: string; text?: string; marks?: string[] };

export function PortableText({ value }: { value: PortableTextBlock[] | null | undefined }) {
  if (!value?.length) return null;
  return (
    <View className="gap-4">
      {value
        .filter((block) => block._type === "block")
        .map((block) => (
          <Text key={block._key} className="text-[17px] leading-7 text-muted-foreground">
            {((block.children ?? []) as Span[]).map((span, i) => (
              <Text
                key={i}
                className="text-[17px] leading-7 text-muted-foreground"
                style={{
                  fontWeight: span.marks?.includes("strong") ? "600" : undefined,
                  fontStyle: span.marks?.includes("em") ? "italic" : undefined,
                }}
              >
                {span.text}
              </Text>
            ))}
          </Text>
        ))}
    </View>
  );
}
