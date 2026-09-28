import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { MealDetailsScreen } from "../screens/MealDetailsScreen";
import { MainTabNavigator } from "./MainTabNavigator";
import type { RootStackParamList } from "./navigationTypes";
import { CategoryMealsScreen } from "../screens/CategoryMealsScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

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
        <Stack.Screen
          name="CategoryMeals"
          component={CategoryMealsScreen}
          options={({ route }) => ({
            title: route.params.category,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
