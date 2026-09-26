import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { FavoritesScreen } from "../screens/FavoritesScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { SearchScreen } from "../screens/SearchScreen";
import { WeeklyPlanScreen } from "../screens/WeeklyPlanScreen";
import type { BottomTabParamList } from "./navigationTypes";

const Tab =
  createBottomTabNavigator<BottomTabParamList>();

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerTitleAlign: "center",
        tabBarActiveTintColor: "#d35400",
        tabBarInactiveTintColor: "#777777",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />

      <Tab.Screen
        name="Search"
        component={SearchScreen}
      />

      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
      />

      <Tab.Screen
        name="WeeklyPlan"
        component={WeeklyPlanScreen}
        options={{
          title: "Weekly Plan",
          tabBarLabel: "Planner",
        }}
      />
    </Tab.Navigator>
  );
}