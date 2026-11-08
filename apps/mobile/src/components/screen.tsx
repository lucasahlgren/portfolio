import { CircleAlert } from "lucide-react-native";
import type { ReactNode } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { Headline } from "@/components/headline";
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
    <View className="flex-1 bg-background">
      {!hasHeader && (
        <View
          className="z-10 items-center border-b-hairline border-border/50 bg-background"
          style={{ paddingTop: insets.top }}
        >
          <View className="w-full max-w-2xl px-6 py-3">
            <AppHeader />
          </View>
        </View>
      )}
      <ScrollView
        className="flex-1"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="items-center pb-16"
        contentContainerStyle={{ paddingTop: hasHeader ? 16 : 24 }}
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
    </View>
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
      {title && <Headline text={title} className="text-3xl tracking-tight" />}
    </View>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <Text className="font-label text-[11px] uppercase tracking-[1.6px] text-muted-foreground">
      {children}
    </Text>
  );
}
