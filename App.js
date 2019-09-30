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
      "HcMuTtsjP6FDmqljwsildtdJqoq5oUZzqQpt5JQ87xW75+EXPu2iflmy96n24aTZHEUgcAaimFsqlBzm1nBsV0OLMlit4hdn7i3oulXHxr99kay00jnOkVDWWI9wDvpA2C2sw0smQWEWdc/Wei8uDrPPNJVavM2rUx3CFt2TtgZIh8hsmYReRTD3shSMzBfF1szb0H8dkweCjx5nH065kMerUsNn0szmUsjIAVaRIRB7be/FjnZuqZqhBcXQXvk6jDAzXFa33VT1OlLgb1Dk9lWIfxTn7Yww5Si0BGIc0bfqhphq+uECWQGG5v7vkql+UoW30HIk2+fd0AAkyVs1Gw=="
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
