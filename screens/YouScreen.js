import * as WebBrowser from "expo-web-browser";
import React from "react";
import {
  ProgressBarAndroid,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { BigMonoText, MonoText } from "../components/StyledText";

export default function YouScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <View style={{ padding: 24 }}>
        <BigMonoText>Hello @malysven!</BigMonoText>
        <MonoText>FEAA E8CC CF68 5A36</MonoText>
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
