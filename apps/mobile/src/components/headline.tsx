import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

export const SERIF_ITALIC = "InstrumentSerif_400Regular_Italic";

export function Headline({ text, className }: { text: string; className?: string }) {
  return (
    <Text className={cn("font-medium tracking-tight", className)}>
      {text.split(/(\*[^*]+\*)/g).map((part, i) =>
        part.startsWith("*") && part.endsWith("*") ? (
          <Text
            key={i}
            className={cn("font-normal", className)}
            style={{ fontFamily: SERIF_ITALIC }}
          >
            {part.slice(1, -1)}
          </Text>
        ) : (
          part
        ),
      )}
    </Text>
  );
}
