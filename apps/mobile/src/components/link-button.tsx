import { openBrowserAsync } from "expo-web-browser";
import { ArrowUpRight } from "lucide-react-native";
import { Linking } from "react-native";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

export function LinkButton({ label, url }: { label: string; url: string }) {
  const open = () => (url.startsWith("mailto:") ? Linking.openURL(url) : openBrowserAsync(url));

  return (
    <Button
      variant="outline"
      size="lg"
      onPress={open}
      accessibilityRole="link"
      className="justify-between rounded-full"
    >
      <Text>{label}</Text>
      <Icon as={ArrowUpRight} className="text-brand" size={18} />
    </Button>
  );
}
