import {
  employmentTypeLabel,
  experienceQuery,
  formatJobPeriod,
  formatYearRange,
  type Education,
  type Job,
} from "@portfolio/content";
import { Briefcase } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";

import { Badges } from "@/components/badges";
import { Screen, SectionTitle } from "@/components/screen";
import { TimelineItem } from "@/components/timeline-item";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { useSanityQuery } from "@/hooks/use-sanity-query";

export default function ExperienceScreen() {
  const [tab, setTab] = useState("work");
  const { data, loading, error, refreshing, refresh } = useSanityQuery<{
    jobs: Job[];
    education: Education[];
  }>(experienceQuery);

  return (
    <Screen loading={loading} error={error} refreshing={refreshing} onRefresh={refresh}>
      <SectionTitle eyebrow="Experience" title="Work & education" />
      <Tabs value={tab} onValueChange={setTab} className="gap-4">
        <TabsList className="w-full">
          <TabsTrigger value="work" className="flex-1">
            <Text>Work</Text>
          </TabsTrigger>
          <TabsTrigger value="education" className="flex-1">
            <Text>Education</Text>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="work">
          {data?.jobs.length ? (
            data.jobs.map((job, i) => (
              <TimelineItem
                key={job._id}
                first={i === 0}
                period={formatJobPeriod(job)}
                title={job.role}
                subtitle={[job.company, job.location, employmentTypeLabel(job.employmentType)]
                  .filter(Boolean)
                  .join(" · ")}
                logo={job.logo}
                current={!job.endDate}
              >
                {job.summary && <Text className="mt-2 text-muted-foreground">{job.summary}</Text>}
                {job.highlights && job.highlights.length > 0 && (
                  <View className="mt-2 gap-1">
                    {job.highlights.map((h) => (
                      <Text key={h} className="text-sm text-muted-foreground">
                        — {h}
                      </Text>
                    ))}
                  </View>
                )}
                {job.tools && job.tools.length > 0 && <Badges items={job.tools} />}
              </TimelineItem>
            ))
          ) : (
            <Alert icon={Briefcase}>
              <AlertTitle>No jobs posted yet</AlertTitle>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="education">
          {data?.education.map((item, i) => (
            <TimelineItem
              key={item._id}
              first={i === 0}
              period={formatYearRange(item.startYear, item.endYear)}
              title={item.degree}
              subtitle={item.school}
              logo={item.logo}
            >
              {item.description && (
                <Text className="mt-2 text-muted-foreground">{item.description}</Text>
              )}
            </TimelineItem>
          ))}
        </TabsContent>
      </Tabs>
    </Screen>
  );
}
