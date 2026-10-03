import {
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";

import { createNativeStackNavigator } from
  "@react-navigation/native-stack";

import { CategoryMealsScreen } from
  "../screens/CategoryMealsScreen";

import { MealDetailsScreen } from
  "../screens/MealDetailsScreen";

import {
  colors,
} from "../theme/theme";

import { MainTabNavigator } from
  "./MainTabNavigator";

import type {
  RootStackParamList,
} from "./navigationTypes";

const Stack =
  createNativeStackNavigator<RootStackParamList>();

const navigationTheme = {
  ...DefaultTheme,

  colors: {
    ...DefaultTheme.colors,

    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    notification: colors.favorite,
  },
};

export function AppNavigator() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          contentStyle: {
            backgroundColor: colors.background,
          },

          headerStyle: {
            backgroundColor: colors.surface,
          },

          headerShadowVisible: false,
          headerTintColor: colors.text,

          headerTitleStyle: {
            fontWeight: "700",
          },
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabNavigator}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="CategoryMeals"
          component={CategoryMealsScreen}
          options={({ route }) => ({
            title: route.params.category,
          })}
        />

        <Stack.Screen
          name="MealDetails"
          component={MealDetailsScreen}
          options={{
            title: "Meal Details",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}