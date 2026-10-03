import { createBottomTabNavigator } from
  "@react-navigation/bottom-tabs";

import Ionicons from
  "@expo/vector-icons/Ionicons";

import { FavoritesScreen } from
  "../screens/FavoritesScreen";

import { HomeScreen } from
  "../screens/HomeScreen";

import { SearchScreen } from
  "../screens/SearchScreen";

import { WeeklyPlanScreen } from
  "../screens/WeeklyPlanScreen";

import {
  colors,
  fontSize,
  spacing,
} from "../theme/theme";

import type {
  BottomTabParamList,
} from "./navigationTypes";

const Tab =
  createBottomTabNavigator<BottomTabParamList>();

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerShadowVisible: false,
        headerTintColor: colors.text,
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontWeight: "700",
        },

        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor:
          colors.textSecondary,

        tabBarHideOnKeyboard: true,

        tabBarLabelStyle: {
          fontSize: fontSize.caption,
          fontWeight: "600",
        },

        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingTop: spacing.xs,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({
            focused,
            color,
            size,
          }) => (
            <Ionicons
              name={
                focused ? "home" : "home-outline"
              }
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
          tabBarIcon: ({
            focused,
            color,
            size,
          }) => (
            <Ionicons
              name={
                focused
                  ? "search"
                  : "search-outline"
              }
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
          tabBarIcon: ({
            focused,
            color,
            size,
          }) => (
            <Ionicons
              name={
                focused
                  ? "heart"
                  : "heart-outline"
              }
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

          tabBarIcon: ({
            focused,
            color,
            size,
          }) => (
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