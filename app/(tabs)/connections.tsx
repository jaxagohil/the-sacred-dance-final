import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";

// ⚠️ replace with RN version later
import EarthField from "../../components/connections/EarthField";

type Profile = {
  id: number;
  name: string;
  line: string;
  location?: string;
};

const mockProfiles: Profile[] = [
  { id: 1, name: "Aisha", line: "i’m learning to speak more honestly", location: "london" },
  { id: 2, name: "Shabir", line: "i keep saying yes when i mean no", location: "srinagar" },
  { id: 3, name: "Elena", line: "i feel like i’m holding something in", location: "sydney" },
];

export default function Connections() {
  const [screen, setScreen] = useState<"entry" | "people" | "circles">("entry");

  const [index, setIndex] = useState(0);
  const [connectedIds, setConnectedIds] = useState<number[]>([]);
  const [message, setMessage] = useState("");

  const [circles, setCircles] = useState([{ name: "Inner Work" }]);

  const current = mockProfiles[index];
  const isConnected = connectedIds.includes(current.id);

  const next = () => {
    if (index < mockProfiles.length - 1) setIndex(index + 1);
  };

  const prev = () => {
    if (index > 0) setIndex(index - 1);
  };

  const connect = () => {
    if (!isConnected) setConnectedIds([...connectedIds, current.id]);
  };

  const addCircle = () => {
    if (circles.length < 3) {
      setCircles([...circles, { name: "New Circle" }]);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>

      {/* TOP NAV */}
      {screen !== "entry" && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: 30,
            paddingTop: 40,
            paddingBottom: 20,
          }}
        >
          <TouchableOpacity onPress={() => setScreen("people")}>
            <Text style={{ color: screen === "people" ? "white" : "#666" }}>
              people
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setScreen("circles")}>
            <Text style={{ color: screen === "circles" ? "white" : "#666" }}>
              circles
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* MAIN */}
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 20 }}>

        {/* ENTRY */}
        {screen === "entry" && (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>

            <EarthField />

            <View style={{ position: "absolute", bottom: 100, alignItems: "center" }}>
              <Text style={{ color: "#888", fontSize: 12 }}>
                You’ll Never Walk Alone
              </Text>

              <TouchableOpacity
                onPress={() => setScreen("people")}
                style={{ marginTop: 20 }}
              >
                <Text style={{ color: "#666", fontSize: 10, letterSpacing: 2 }}>
                  enter
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* PEOPLE */}
        {screen === "people" && (
          <View style={{ alignItems: "center" }}>

            <View
              style={{
                backgroundColor: "#111",
                borderRadius: 20,
                padding: 20,
                width: "100%",
                alignItems: "center",
              }}
            >

              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: "#222",
                  marginBottom: 10,
                }}
              />

              <Text style={{ color: "white", fontSize: 16 }}>
                {current.name}
              </Text>

              <Text style={{ color: "#aaa", fontSize: 12, marginTop: 5, fontStyle: "italic" }}>
                “{current.line}”
              </Text>

              {current.location && (
                <Text style={{ color: "#555", fontSize: 10, marginTop: 4 }}>
                  {current.location}
                </Text>
              )}

              {!isConnected ? (
                <TouchableOpacity
                  onPress={connect}
                  style={{
                    marginTop: 10,
                    backgroundColor: "white",
                    paddingHorizontal: 16,
                    paddingVertical: 6,
                    borderRadius: 20,
                  }}
                >
                  <Text style={{ color: "black", fontSize: 12 }}>
                    connect
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={{ color: "#aaa", marginTop: 10, fontSize: 10 }}>
                  connected
                </Text>
              )}

            </View>

            {/* NAV */}
            <View style={{ flexDirection: "row", gap: 40, marginTop: 20 }}>
              <TouchableOpacity onPress={prev}>
                <Text style={{ color: "#888" }}>←</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={next}>
                <Text style={{ color: "#888" }}>→</Text>
              </TouchableOpacity>
            </View>

          </View>
        )}

        {/* CIRCLES */}
        {screen === "circles" && (
          <View style={{ gap: 20 }}>

            {circles.map((c, i) => (
              <View
                key={i}
                style={{
                  backgroundColor: "#111",
                  borderRadius: 20,
                  padding: 16,
                }}
              >
                <TextInput
                  value={c.name}
                  onChangeText={(text) => {
                    const updated = [...circles];
                    updated[i].name = text;
                    setCircles(updated);
                  }}
                  style={{
                    color: "white",
                    marginBottom: 10,
                  }}
                />

                <View style={{ flexDirection: "row", gap: 8, marginBottom: 10 }}>
                  {[1, 2].map((m) => (
                    <View
                      key={m}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                        backgroundColor: "#222",
                      }}
                    />
                  ))}

                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      backgroundColor: "#111",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#888" }}>+</Text>
                  </TouchableOpacity>
                </View>

                <TextInput
                  placeholder="share something with the circle…"
                  placeholderTextColor="#666"
                  multiline
                  style={{
                    backgroundColor: "#222",
                    borderRadius: 10,
                    padding: 10,
                    color: "white",
                  }}
                />
              </View>
            ))}

            {circles.length < 3 && (
              <TouchableOpacity
                onPress={addCircle}
                style={{
                  padding: 10,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: "#333",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#666" }}>
                  + create / join another circle
                </Text>
              </TouchableOpacity>
            )}

          </View>
        )}

      </ScrollView>

      {/* CHAT (ONLY IF CONNECTED) */}
      {screen === "people" && isConnected && (
        <View
          style={{
            position: "absolute",
            bottom: 40,
            left: 20,
            right: 20,
          }}
        >
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="share something true…"
            placeholderTextColor="#666"
            multiline
            style={{
              backgroundColor: "#111",
              borderRadius: 12,
              padding: 12,
              color: "white",
            }}
          />
        </View>
      )}

    </View>
  );
}
