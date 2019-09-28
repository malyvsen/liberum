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
      "hGsN2fJJOCqbM8eZsrJzBbLGYMhUIWMe5gQcpuSRaMr/3mJr/6ZfmpYNGdX2iwS/b295D0lE0y5Eqs24AK3jmjb/3mqyhrP64r6YN/umduFRTutqL+xZHsMP5TTjgv8CzFwzlqGO267ZJ4XT9kJ5oeIHUaVWdz1jHQ3PPZaTRgGgGWhILWoGPkLJ3CKukIPaHP4jJxYnOTx6EB01Ain24BMcGHqV21Ptvwcl3kmoQsOQ9iUZGh1RKkJe4RQm1JSPBvn8S6wz0oWELAVxsHBs13y0ZBHZZDcDwo46CW0cfI4+/sXI4SOQRkpwpoVzYB4u4FMvTQiPQ+UxQ7O9GG5X9Q=="
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
