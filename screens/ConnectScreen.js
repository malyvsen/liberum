import React from "react";
import { Button, View, StyleSheet } from "react-native";
import { ExpoLinksView } from "@expo/samples";

export default function LinksScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "space-around", padding: 16 }}>
      <Button title="Sync" onPress={() => console.log("synchronizing")} />
      <Button title="Connect" onPress={() => console.log("connecting")} />
    </View>
  );
}

LinksScreen.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff"
  }
});
