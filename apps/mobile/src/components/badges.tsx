import { View } from "react-native";

import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";

export function Badges({ items }: { items: string[] }) {
  return (
    <View className="mt-3 flex-row flex-wrap gap-1.5">
      {items.map((item) => (
        <Badge key={item} variant="secondary" className="rounded-full px-3 py-1">
          <Text className="font-label-semi text-xs">{item}</Text>
        </Badge>
      ))}
    </View>
  );
}
