import { Ionicons } from "@expo/vector-icons";
import { AppLoading } from "expo";
import * as Font from "expo-font";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Account from "./backend/account";
import Graph from "./backend/graph";
import GraphContext from "./GraphContext";
import AppNavigator from "./navigation/AppNavigator";

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [graph, setGraph] = useState(null);

  useEffect(() => {
    const newGraph = new Graph();
    const newAccount = new Account(
      "createdAccount",
      "A297gUHgdKlWLRHCjUeltRVqy+bMroZF5K7D2z0evSW+drb8vTHZirSKXU6QHPcgTp6d9BvpC99Cg4CK1Y3WoPjLseHz82Dkuk4g1CTrBJ3xjRP4EmdYPktsNsmIbUTPv02C7N7Mb2uoJrnU8AqAylfHJ6q3vhcwvtFoxkVDxfPEgqD5d/de1DJvY/ZebeQ7qQ9Jf/WlG/uCGHb4OzmBvu/mItYMWQUZVzHtAU0Lzoyll6i6tPTahyZQjKW3SFixjI//IEFtI3uMW/+AeAsHvoE60USGQ5vqsEHhoeIg8u5PZOAS8zhKXDUhG/rFAYFF5PT1ge2R0BnD1MTDRO1LBQ=="
    );
    newGraph.logIn(newAccount, "Here we go!").then(() => {
      setGraph(newGraph);
    });
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else {
    return (
      <View style={styles.container}>
        <GraphContext.Provider value={graph}>
          <AppNavigator />
        </GraphContext.Provider>
      </View>
    );
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf")
    })
  ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
