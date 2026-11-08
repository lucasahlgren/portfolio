import { CircleAlert } from "lucide-react-native";
import type { ReactNode } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/hooks/use-theme";
import { isSanityConfigured } from "@/lib/sanity";

type Props = {
  children: ReactNode;
  loading?: boolean;
  error?: Error | null;
  refreshing?: boolean;
  onRefresh?: () => void;
  hasHeader?: boolean;
};

export function Screen({ children, loading, error, refreshing, onRefresh, hasHeader }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="items-center pb-32"
      contentContainerStyle={{ paddingTop: hasHeader ? 16 : insets.top + 24 }}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={Boolean(refreshing)}
            onRefresh={onRefresh}
            tintColor={theme.mutedForeground}
          />
        ) : undefined
      }
    >
      <View className="w-full max-w-2xl px-6">
        {loading ? (
          <LoadingSkeleton />
        ) : error || !isSanityConfigured ? (
          <Alert icon={CircleAlert} variant="destructive" className="mt-8">
            <AlertTitle>Couldn’t load content</AlertTitle>
            <AlertDescription>Pull down to try again.</AlertDescription>
          </Alert>
        ) : (
          children
        )}
      </View>
    </ScrollView>
  );
}

function LoadingSkeleton() {
  return (
    <View className="gap-4 pt-6">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-10 w-4/5" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="mt-4 aspect-[4/3] w-full rounded-2xl" />
    </View>
  );
}

export function SectionTitle({ eyebrow, title }: { eyebrow: string; title?: string }) {
  return (
    <View className="mb-6 mt-16 gap-2">
      <Eyebrow>{eyebrow}</Eyebrow>
      {title && <Text className="text-3xl font-semibold tracking-tight">{title}</Text>}
    </View>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <Text className="text-sm font-medium text-muted-foreground">{children}</Text>;
}
