import { useEffect } from "react";
import { SafeAreaView, Text } from "react-native";
import { searchMealsByName } from "./src/api/mealDbApi";

export default function App() {
  useEffect(() => {
    async function mealDbApi() {
      try {
        const meals = await searchMealsByName("chicken");

        console.log("Meals:", meals);
      } catch (error) {
        console.error("MealDB error:", error);
      }
    }

    mealDbApi();
  }, []);

  return (
    <SafeAreaView>
      <Text>Testing TheMealDB API</Text>
    </SafeAreaView>
  );
}