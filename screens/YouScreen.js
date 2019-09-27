import React, { useContext } from "react";
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { BigMonoText, MonoText } from "../components/StyledText";
import GraphContext from "../GraphContext";

export default function YouScreen() {
  const graph = useContext(GraphContext);
  const { name, key } = graph ? graph.currentAccount : null;

  const formattedPublicKey = key.publicKey
    .slice(0, 16)
    .split("")
    .map((letter, index) => {
      return index !== 0 && (index + 1) % 4 === 0 ? letter + " " : letter;
    })
    .join("")
    .split("")
    .slice(0, -1)
    .join("");

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <View style={{ padding: 24 }}>
        <BigMonoText>Hello @{name}!</BigMonoText>
        <MonoText>{formattedPublicKey}</MonoText>
      </View>
      <View>
        <View
          style={{
            padding: 24,
            flex: 1,
            flexDirection: "row",
            // justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Feather style={{ marginRight: 8 }} size={20} name="check" />
          <MonoText>You're verifed</MonoText>
        </View>
        <View
          style={{
            padding: 24,
            flex: 1,
            flexDirection: "row",
            // justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Feather style={{ marginRight: 8 }} size={20} name="check" />
          <MonoText>You have recently synchronized</MonoText>
        </View>
      </View>
    </View>
  );
}

YouScreen.navigationOptions = {
  header: null
};
