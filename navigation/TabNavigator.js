import { createBottomTabNavigator } from "react-navigation";
import SearchScreen from "../screens/SearchScreen";
import LinkScreen from "../screens/LinkScreen";

const TabNavigator = createBottomTabNavigator(
  {
    Link: LinkScreen,
    Search: SearchScreen
  },
  {
    initialRouteName: "Link"
  }
);

export default TabNavigator;
