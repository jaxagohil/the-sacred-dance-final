import { Tabs } from "expo-router";

import {
  BookOpen,
  CircleUserRound,
  Compass,
  Orbit,
  Sparkles,
} from "lucide-react-native";

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

          backgroundColor:
            Colors.background,

          borderTopColor:
            "rgba(255,255,255,0.04)",

          height: 82,

          paddingBottom: 18,

          paddingTop: 3,
        },

        tabBarItemStyle: {

          paddingTop: 4,
        },

        tabBarActiveTintColor:
          Colors.gold,

        tabBarInactiveTintColor:
          Colors.mutedText,

        tabBarLabelStyle: {

          fontSize: 10,

          fontFamily:
            Fonts.light,

          marginTop: 4,
        },
      }}
    >

      {/* ✨ MIRROR */}

      <Tabs.Screen

        name="mirror"

        options={{

          title: "Mirror",

          tabBarIcon: ({
            color,
          }) => (

            <Sparkles

              size={19}

              color={color}

              strokeWidth={
                1.8
              }
            />
          ),
        }}
      />

      {/* 🧭 GUIDANCE */}

      <Tabs.Screen

        name="guidance"

        options={{

          title: "Guidance",

          tabBarIcon: ({
            color,
          }) => (

            <Compass

              size={19}

              color={color}

              strokeWidth={
                1.8
              }
            />
          ),
        }}
      />

      {/* 🌌 CONNECTIONS */}

      <Tabs.Screen

        name="connections"

        options={{

          title: "Connections",

          tabBarIcon: ({
            color,
          }) => (

            <Orbit

              size={19}

              color={color}

              strokeWidth={
                1.8
              }
            />
          ),
        }}
      />

      {/* 📖 REFLECTIONS */}

      <Tabs.Screen

        name="journal"

        options={{

          title: "Reflections",

          tabBarIcon: ({
            color,
          }) => (

            <BookOpen

              size={19}

              color={color}

              strokeWidth={
                1.8
              }
            />
          ),
        }}
      />      

      {/* 👤 YOU */}

      <Tabs.Screen

        name="you"

        options={{

          title: "You",

          tabBarIcon: ({
            color,
          }) => (

            <CircleUserRound

              size={19}

              color={color}

              strokeWidth={
                1.8
              }
            />
          ),
        }}
      />

    </Tabs>
  );
}