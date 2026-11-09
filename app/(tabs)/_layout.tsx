
import { Tabs } from "expo-router";

import { Gem } from "lucide-react-native";

import {
  Colors,
  Fonts,
} from "../../constants/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

tabBarStyle: {
  display: "none",
},

        tabBarItemStyle: {
          paddingTop: 4,
        },

        tabBarActiveTintColor: Colors.gold,
        tabBarInactiveTintColor: Colors.mutedText,

        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: Fonts.light,
          marginTop: 4,
        },
      }}
    >
      {/* MAIN EXPERIENCE */}
      <Tabs.Screen
        name="livingSpace"
        options={{
          title: "Living Space",
          tabBarIcon: ({ color }) => (
            <Gem
              size={19}
              color={color}
              strokeWidth={1.8}
            />
          ),
        }}
      />

      {/* CIRCLES — opened from Living Space */}
      <Tabs.Screen
        name="connections"
        options={{
          title: "Circles",
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />

      {/* YOU — profile overlay is opened from Living Space */}
      <Tabs.Screen
        name="you"
        options={{
          title: "You",
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
    </Tabs>
  );
}
