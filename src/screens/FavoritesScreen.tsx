import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useNavigation } from
  "@react-navigation/native";

import type {
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

import { MealCard } from "../components/MealCard";
import { useFavorites } from
  "../context/FavoritesContext";

import type {
  RootStackParamList,
} from "../navigation/navigationTypes";

type FavoritesNavigation =
  NativeStackNavigationProp<RootStackParamList>;

export function FavoritesScreen() {
  const navigation =
    useNavigation<FavoritesNavigation>();

  const {
    favorites,
    isLoading,
    error,
  } = useFavorites();

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
          Loading favorites...
        </Text>
      </View>
    );
  }

  if (error && favorites.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyTitle}>
          No favorites yet
        </Text>

        <Text style={styles.message}>
          Open a meal and add it to your favorites.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && (
        <Text style={styles.error}>{error}</Text>
      )}

      <FlatList
        data={favorites}
        keyExtractor={(meal) => meal.idMeal}
        contentContainerStyle={styles.list}
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
  list: {
    paddingBottom: 30,
    paddingTop: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  message: {
    color: "#666666",
    marginTop: 8,
    textAlign: "center",
  },
  error: {
    color: "#b00020",
    marginVertical: 12,
    textAlign: "center",
  },
});