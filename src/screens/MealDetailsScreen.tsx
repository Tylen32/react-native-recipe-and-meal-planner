import {
  ActivityIndicator,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type {
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

import { useFavorites } from
  "../context/FavoritesContext";

import { useMealDetails } from
  "../hooks/useMealDetails";

import type {
  RootStackParamList,
} from "../navigation/navigationTypes";

type MealDetailsScreenProps =
  NativeStackScreenProps<
    RootStackParamList,
    "MealDetails"
  >;

export function MealDetailsScreen({
  route,
}: MealDetailsScreenProps) {
  const { mealId } = route.params;

  const {
    meal,
    isLoading,
    error: mealError,
  } = useMealDetails(mealId);

  const {
    isFavorite,
    toggleFavorite,
    error: favoriteError,
  } = useFavorites();

  const mealIsFavorite = meal
    ? isFavorite(meal.idMeal)
    : false;

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>
          Loading meal...
        </Text>
      </View>
    );
  }

  if (mealError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>
          {mealError}
        </Text>
      </View>
    );
  }

  if (!meal) {
    return (
      <View style={styles.centered}>
        <Text>Meal not found.</Text>
      </View>
    );
  }

  function handleFavoritePress() {
    if (!meal) {
      return;
    }

    void toggleFavorite(meal);
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >
      <Image
        source={{ uri: meal.strMealThumb }}
        style={styles.image}
      />

      <Text style={styles.title}>
        {meal.strMeal}
      </Text>

      <Text style={styles.metadata}>
        {meal.strCategory ?? "No category"}
        {" • "}
        {meal.strArea ?? "Unknown cuisine"}
      </Text>

      <View style={styles.favoriteButton}>
        <Button
          title={
            mealIsFavorite
              ? "Remove from Favorites"
              : "Add to Favorites"
          }
          onPress={handleFavoritePress}
          color={mealIsFavorite ? "#b00020" : "#d35400"}
        />
      </View>

      {favoriteError && (
        <Text style={styles.error}>
          {favoriteError}
        </Text>
      )}

      <Text style={styles.heading}>
        Instructions
      </Text>

      <Text style={styles.instructions}>
        {meal.strInstructions}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loadingText: {
    color: "#666666",
    marginTop: 12,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 16,
  },
  metadata: {
    color: "#666666",
    fontSize: 16,
    marginTop: 8,
  },
  favoriteButton: {
    marginTop: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 24,
  },
  instructions: {
    fontSize: 16,
    lineHeight: 24,
  },
  error: {
    color: "#b00020",
    marginTop: 12,
    textAlign: "center",
  },
});