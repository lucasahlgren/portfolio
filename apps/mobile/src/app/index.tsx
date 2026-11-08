import { formatJobPeriod, homeQuery, type HomeData } from "@portfolio/content";
import { Link } from "expo-router";
import { ArrowDownRight, ArrowRight, Sparkles } from "lucide-react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { ScrollView, View } from "react-native";

import { Headline } from "@/components/headline";
import { PhotoStrip } from "@/components/photo-strip";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { Screen, SectionTitle } from "@/components/screen";
import { TimelineItem } from "@/components/timeline-item";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useSanityQuery } from "@/hooks/use-sanity-query";
import { useTheme } from "@/hooks/use-theme";

const heroImage = require("@/assets/images/hero.png");
const HERO_RATIO = 1486 / 2000;
const HERO_OVERHANG = 64;

export default function HomeScreen() {
  const { data, loading, error, refreshing, refresh } = useSanityQuery<HomeData>(homeQuery);
  const settings = data?.settings;
  const theme = useTheme();
  const [heroHeight, setHeroHeight] = useState(0);
  const imageHeight = heroHeight + HERO_OVERHANG;
  const imageWidth = imageHeight * HERO_RATIO;

  return (
    <Screen loading={loading} error={error} refreshing={refreshing} onRefresh={refresh}>
      <View className="relative" onLayout={(e) => setHeroHeight(e.nativeEvent.layout.height)}>
        {heroHeight > 0 && (
          <View
            pointerEvents="none"
            className="absolute"
            style={{
              top: 0,
              left: "50%",
              width: imageWidth,
              height: imageHeight,
              transform: [{ translateX: -imageWidth * 0.6 }],
            }}
          >
            <Reveal delay={240} duration={700} style={{ flex: 1 }}>
              <View className="flex-1 opacity-60">
                <Image source={heroImage} contentFit="contain" style={{ flex: 1 }} />
              </View>
              <LinearGradient
                colors={["transparent", theme.background]}
                locations={[0.35, 0.88]}
                style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
              />
            </Reveal>
          </View>
        )}

        <View className="gap-6 pt-56">
          {settings?.availableForWork && (
            <Reveal delay={0} duration={700}>
              <Badge variant="outline" className="self-start rounded-full px-3 py-1">
                <Icon as={Sparkles} size={12} className="text-success" />
                <Text className="font-label-semi">Open to opportunities</Text>
              </Badge>
            </Reveal>
          )}

          <Reveal delay={80} duration={700}>
            <Headline
              text={settings?.headline ?? settings?.name ?? ""}
              className="text-[44px] leading-[46px] tracking-[-1.6px]"
            />
          </Reveal>
          {settings?.intro && (
            <Reveal delay={160} duration={700}>
              <Text className="text-[17px] leading-7 text-muted-foreground">{settings.intro}</Text>
            </Reveal>
          )}

          <Reveal delay={200} duration={700} className="flex-row flex-wrap gap-3">
            <Link href="/projects" asChild>
              <Button size="lg" className="rounded-full">
                <Text>See my projects</Text>
                <Icon as={ArrowDownRight} className="text-primary-foreground" size={16} />
              </Button>
            </Link>
            <Link href="/about" asChild>
              <Button size="lg" variant="outline" className="rounded-full">
                <Text>About me</Text>
              </Button>
            </Link>
          </Reveal>
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

      {data && data.photos.length > 0 && (
        <>
          <View className="flex-row items-end justify-between">
            <SectionTitle eyebrow="Photography" title="Through the *lens*" />
            <Link href="/photos" asChild>
              <Button variant="ghost" className="mb-6 rounded-full px-0">
                <Text className="text-muted-foreground">Gallery</Text>
                <Icon as={ArrowRight} className="text-muted-foreground" size={16} />
              </Button>
            </Link>
          </View>
          <PhotoStrip photos={data.photos} />
        </>
      )}
    </Screen>
  );
}
