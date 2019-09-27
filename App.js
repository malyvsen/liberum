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
      "vzii6nDeIs+SWbsZUujf/SBgGs0DpQi0OA+weJu+TZ+tKrFdp9LagXbUYkjansbtGmyaWcej5DOwj+eZd9l1Avibbh0eHZ7gEc/bN+BpwYYikbjNFE95Z/wxpl4skLypiChUPxAmOAiC21V28vNTbAMZyr+yO5jyCDu3/rJglaL1FV77BVnxep8bJ7h/mvH55IgkZN1ZBgG5P8/Or1DWWxQMxRCiuukK5JlV/NMGI/GgV0SGTdSqKEUa6IJ0z3iSyvug4PSs0oOKZcBip3WdqJdZytA1Fcn9zXaR/p7/C3gQFFkdYfYNA9o5m1vrU7Z1cB7U+YXbkRu0T9GqY6MIvw=="
    );
    newGraph.logIn(newAccount, "testPassword").then(() => {
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
