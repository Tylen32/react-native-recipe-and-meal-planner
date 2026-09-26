import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { MealDetailsScreen } from "../screens/MealDetailsScreen";
import { MainTabNavigator } from "./MainTabNavigator";
import type { RootStackParamList } from "./navigationTypes";

const Stack =
  createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainTabs"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="MealDetails"
          component={MealDetailsScreen}
          options={{ title: "Meal Details" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}