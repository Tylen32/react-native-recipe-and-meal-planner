import { FavoritesProvider } from
  "./src/context/FavoritesContext";

import { MealPlanProvider } from
  "./src/context/MealPlanContext";

import { AppNavigator } from
  "./src/navigation/AppNavigator";


export default function App() {
  return (
    <FavoritesProvider>
      <MealPlanProvider>
        <AppNavigator />
      </MealPlanProvider>
    </FavoritesProvider>
  );
}