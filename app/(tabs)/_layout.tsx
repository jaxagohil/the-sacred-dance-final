import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          backgroundColor: '#000',
          borderTopColor: 'rgba(255,255,255,0.1)',
          height: 70,
          paddingBottom: 10,
        },

        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',

        tabBarLabelStyle: {
          fontSize: 10,
        },
      }}
    >
      <Tabs.Screen
        name="mirror"
        options={{
          title: 'Mirror',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18 }}>✨</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18 }}>📖</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="guidance"
        options={{
          title: 'Guidance',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18 }}>🧭</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="connections"
        options={{
          title: 'Connections',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18 }}>🌐</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="you"
        options={{
          title: 'You',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18 }}>👤</Text>
          ),
        }}
      />
    </Tabs>
  );
}