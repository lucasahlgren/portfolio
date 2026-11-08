import { Pressable, ScrollView } from "react-native";

import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

export type FilterOption = { value: string; label: string; count: number };

export function FilterPills({
  options,
  value,
  onChange,
}: {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="-mx-6 mb-8"
      contentContainerClassName="gap-2 px-6"
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={`${option.label}, ${option.count}`}
            className={cn(
              "h-9 flex-row items-center gap-1.5 rounded-full border border-border px-4 active:opacity-70",
              selected && "bg-secondary",
            )}
          >
            <Text className="font-label-semi px-0.5 text-sm">{option.label}</Text>
            <Text className="font-label-semi text-sm text-muted-foreground">{option.count}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
