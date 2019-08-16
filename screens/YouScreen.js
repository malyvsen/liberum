import React, { useContext } from "react";
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { BigMonoText, MonoText } from "../components/StyledText";
import { GraphContext } from "../App";

export default function YouScreen() {
  const graph = useContext(GraphContext);
  const { name, publicKey } = graph.currentAccount;
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <View style={{ padding: 24 }}>
        <BigMonoText>Hello @{name}!</BigMonoText>
        <MonoText>{publicKey}</MonoText>
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
