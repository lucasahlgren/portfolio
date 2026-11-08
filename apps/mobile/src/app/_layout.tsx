import "@/global.css";

import { Geist_400Regular } from "@expo-google-fonts/geist/400Regular";
import { Geist_500Medium } from "@expo-google-fonts/geist/500Medium";
import { Geist_600SemiBold } from "@expo-google-fonts/geist/600SemiBold";
import { Geist_700Bold } from "@expo-google-fonts/geist/700Bold";
import { InstrumentSerif_400Regular } from "@expo-google-fonts/instrument-serif/400Regular";
import { InstrumentSerif_400Regular_Italic } from "@expo-google-fonts/instrument-serif/400Regular_Italic";
import { PortalHost } from "@rn-primitives/portal";
import { ThemeProvider } from "expo-router";
import { NativeTabs } from "expo-router/native-tabs";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";

import { AnimatedSplash } from "@/components/animated-splash";
import { ThemePreferenceProvider } from "@/components/theme-preference";
import { NAV_THEME, THEME } from "@/lib/theme";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
    InstrumentSerif_400Regular,
    InstrumentSerif_400Regular_Italic,
    "ArchivoExpanded-Medium": require("../../assets/fonts/ArchivoExpanded-Medium.ttf"),
    "ArchivoSemiExpanded-Medium": require("../../assets/fonts/ArchivoSemiExpanded-Medium.ttf"),
  });
  if (!fontsLoaded) return null;

  return (
    <ThemePreferenceProvider>
      <AppTabs />
      <AnimatedSplash />
    </ThemePreferenceProvider>
  );
}

function AppTabs() {
  const { colorScheme } = useColorScheme();
  const scheme = colorScheme === "dark" ? "dark" : "light";
  const colors = THEME[scheme];

  return (
    <ThemeProvider value={NAV_THEME[scheme]}>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <NativeTabs
        disableTransparentOnScrollEdge
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
