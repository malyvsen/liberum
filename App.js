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
      "KwJ0wmWIX7scKUxChv+Vm2Q2NpO/PUfnAu1rAsVdrzkEPfyMNF/YrlJ5x0zoNugYmqh9vzBQ6Rg0TUqdK6UlAjg8azZYCTTSFNQbkM0FjgS4OC7GqNO7BQtVVIlaaiMLh50dU2JH1nZW7WWAq2WPyFPLzB6pnj5tZ2JspDacp4k9dy6szViCNWuUqqwgljy2XZGAr+B/HTMlwml4VVSxHr+Q+uW8WN7TvQnFfTmUD+GdX5AoHyrKJxt9jEv/yddOPS8jOX+DuORU7HfhnTpLkUi7EhZy4hS9wuxAE98SUFnNyb1iQrzG9n1UxvipHaUZ//JXvC+TqtPuxfCOUno+sw=="
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
