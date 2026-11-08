import "@/global.css";

import { PortalHost } from "@rn-primitives/portal";
import { ThemeProvider } from "expo-router";
import { NativeTabs } from "expo-router/native-tabs";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";

import { NAV_THEME, THEME } from "@/lib/theme";

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const scheme = colorScheme === "dark" ? "dark" : "light";
  const colors = THEME[scheme];

  return (
    <ThemeProvider value={NAV_THEME[scheme]}>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <NativeTabs
        minimizeBehavior="onScrollDown"
        backgroundColor={colors.background}
        indicatorColor={colors.secondary}
        labelStyle={{ selected: { color: colors.foreground } }}
        tintColor={colors.foreground}
      >
        <NativeTabs.Trigger name="index">
          <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf={{ default: "house", selected: "house.fill" }} md="home" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="projects">
          <NativeTabs.Trigger.Label>Projects</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            sf={{ default: "square.grid.2x2", selected: "square.grid.2x2.fill" }}
            md="grid_view"
          />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="experience">
          <NativeTabs.Trigger.Label>Experience</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            sf={{ default: "briefcase", selected: "briefcase.fill" }}
            md="work"
          />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="photos">
          <NativeTabs.Trigger.Label>Photos</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            sf={{ default: "camera", selected: "camera.fill" }}
            md="photo_camera"
          />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="about">
          <NativeTabs.Trigger.Label>About</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            sf={{ default: "person", selected: "person.fill" }}
            md="person"
          />
        </NativeTabs.Trigger>
      </NativeTabs>
      <PortalHost />
    </ThemeProvider>
  );
}
