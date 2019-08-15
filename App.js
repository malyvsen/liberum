import React from "react";
import { createAppContainer } from "react-navigation";
import TabNavigator from "./navigation/TabNavigator";

const AppContainer = createAppContainer(TabNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
