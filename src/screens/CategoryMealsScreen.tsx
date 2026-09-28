import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type {
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

import { MealCard } from
  "../components/MealCard";

import { useCategoryMeals } from
  "../hooks/useCategoryMeals";

import type {
  RootStackParamList,
} from "../navigation/navigationTypes";

type CategoryMealsScreenProps =
  NativeStackScreenProps<
    RootStackParamList,
    "CategoryMeals"
  >;

export function CategoryMealsScreen({
  route,
  navigation,
}: CategoryMealsScreenProps) {
  const { category } = route.params;

  const {
    meals,
    isLoading,
    error,
    reloadCategoryMeals,
  } = useCategoryMeals(category);

  function handleMealPress(mealId: string) {
    navigation.navigate("MealDetails", {
      mealId,
    });
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />

        <Text style={styles.message}>
          Loading {category} meals...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>
          {error}
        </Text>

        <Pressable
          style={styles.retryButton}
          onPress={() =>
            void reloadCategoryMeals()
          }
        >
          <Text style={styles.retryButtonText}>
            Try Again
          </Text>
        </Pressable>
      </View>
    );
  }

  if (meals.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyTitle}>
          No meals found
        </Text>

        <Text style={styles.message}>
          There are currently no meals in the{" "}
          {category} category.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.resultsText}>
        {meals.length}{" "}
        {meals.length === 1 ? "meal" : "meals"}
      </Text>

      <FlatList
        data={meals}
        keyExtractor={(meal) => meal.idMeal}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <MealCard
            meal={item}
            onPress={() =>
              handleMealPress(item.idMeal)
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    paddingHorizontal: 16,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  resultsText: {
    color: "#666666",
    fontSize: 15,
    paddingTop: 16,
  },
  list: {
    paddingBottom: 30,
    paddingTop: 12,
  },
  message: {
    color: "#666666",
    lineHeight: 21,
    marginTop: 8,
    textAlign: "center",
  },
  error: {
    color: "#b00020",
    fontSize: 16,
    textAlign: "center",
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  retryButton: {
    backgroundColor: "#d35400",
    borderRadius: 8,
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  retryButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
});