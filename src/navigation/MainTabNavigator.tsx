import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

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
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tab.Screen
        name="WeeklyPlan"
        component={WeeklyPlanScreen}
        options={{
          title: "Weekly Plan",
          tabBarLabel: "Planner",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={
                focused
                  ? "calendar"
                  : "calendar-outline"
              }
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}