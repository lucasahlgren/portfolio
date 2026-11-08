import { formatJobPeriod, homeQuery, type HomeData } from "@portfolio/content";
import { Link } from "expo-router";
import { ArrowRight, Sparkles } from "lucide-react-native";
import { Platform, ScrollView, View } from "react-native";

import { ProjectCard } from "@/components/project-card";
import { Screen, SectionTitle } from "@/components/screen";
import { TimelineItem } from "@/components/timeline-item";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useSanityQuery } from "@/hooks/use-sanity-query";

const serif = Platform.select({ ios: "ui-serif", default: "serif" });

export default function HomeScreen() {
  const { data, loading, error, refreshing, refresh } = useSanityQuery<HomeData>(homeQuery);
  const settings = data?.settings;

  return (
    <Screen loading={loading} error={error} refreshing={refreshing} onRefresh={refresh}>
      <View className="gap-6 pt-6">
        {settings?.availableForWork && (
          <Badge variant="outline" className="self-start rounded-full px-3 py-1">
            <Icon as={Sparkles} size={12} className="text-success" />
            <Text>Open to opportunities</Text>
          </Badge>
        )}

        <Text className="text-[44px] font-semibold leading-[46px] tracking-[-1.6px]">
          <Headline text={settings?.headline ?? settings?.name ?? ""} />
        </Text>
        {settings?.intro && (
          <Text className="text-[17px] leading-7 text-muted-foreground">{settings.intro}</Text>
        )}

        <View className="flex-row gap-3">
          <Link href="/about" asChild>
            <Button size="lg" variant="outline" className="rounded-full">
              <Text>About me</Text>
            </Button>
          </Link>
        </View>
      </View>

      {data && data.projects.length > 0 && (
        <>
          <SectionTitle eyebrow="Selected projects" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={300 + 16}
            decelerationRate="fast"
            className="-mx-6"
            contentContainerClassName="gap-4 px-6"
          >
            {data.projects.map((project) => (
              <ProjectCard key={project._id} project={project} width={300} />
            ))}
          </ScrollView>
          <Link href="/projects" asChild>
            <Button variant="ghost" className="mt-4 self-start rounded-full px-0">
              <Text className="text-muted-foreground">All projects</Text>
              <Icon as={ArrowRight} className="text-muted-foreground" size={16} />
            </Button>
          </Link>
        </>
      )}

      {data && data.jobs.length > 0 && (
        <>
          <SectionTitle eyebrow="Experience" />
          {data.jobs.map((job, i) => (
            <TimelineItem
              key={job._id}
              first={i === 0}
              period={formatJobPeriod(job)}
              title={job.role}
              subtitle={job.company}
              logo={job.logo}
              current={!job.endDate}
            />
          ))}
        </>
      )}
    </Screen>
  );
}

function Headline({ text }: { text: string }) {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith("*") && part.endsWith("*") ? (
      <Text
        key={i}
        className="text-[44px] font-normal italic leading-[46px]"
        style={{ fontFamily: serif }}
      >
        {part.slice(1, -1)}
      </Text>
    ) : (
      part
    ),
  );
}
