import React from "react";
import { Platform } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";

import TabBarIcon from "../components/TabBarIcon";
import ConnectScreen from "../screens/ConnectScreen";
import YouScreen from "../screens/YouScreen";
import VerificationScreen from "../screens/VerificationScreen";

const config = Platform.select({
  web: { headerMode: "screen" },
  default: {}
});

const ConnectStack = createStackNavigator(
  {
    Connect: ConnectScreen
  },
  config
);

ConnectStack.navigationOptions = {
  tabBarLabel: "Connect",
  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name={"link"} />
};

ConnectStack.path = "";

const YouStack = createStackNavigator(
  {
    You: YouScreen
  },
  config
);

YouStack.navigationOptions = {
  tabBarLabel: "You",
  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name={"user"} />
};

YouStack.path = "";

const VerificationStack = createStackNavigator(
  {
    Verification: VerificationScreen
  },
  config
);

VerificationStack.navigationOptions = {
  tabBarLabel: "Verification",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={"check-circle"} />
  )
};

VerificationStack.path = "";

const tabNavigator = createBottomTabNavigator(
  {
    ConnectStack,
    YouStack,
    VerificationStack
  },
  {
    initialRouteName: "YouStack"
  }
);

tabNavigator.path = "";

export default tabNavigator;
