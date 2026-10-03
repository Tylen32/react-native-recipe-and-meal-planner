import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Ionicons from
  "@expo/vector-icons/Ionicons";

import { useNavigation } from
  "@react-navigation/native";

import type {
  CompositeNavigationProp,
} from "@react-navigation/native";

import type {
  BottomTabNavigationProp,
} from "@react-navigation/bottom-tabs";

import type {
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

import { AppButton } from
  "../components/AppButton";

import { MealCard } from
  "../components/MealCard";

import { useFavorites } from
  "../context/FavoritesContext";

import type {
  BottomTabParamList,
  RootStackParamList,
} from "../navigation/navigationTypes";

import {
  colors,
  fontSize,
  radius,
  spacing,
} from "../theme/theme";

type FavoritesNavigation =
  CompositeNavigationProp<
    BottomTabNavigationProp<
      BottomTabParamList,
      "Favorites"
    >,
    NativeStackNavigationProp<RootStackParamList>
  >;

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

  function handleFindMeals() {
    navigation.navigate("Search");
  }

  if (isLoading) {
    return (
      <View style={styles.stateContainer}>
        <ActivityIndicator
          color={colors.primary}
          size="large"
        />

        <Text style={styles.stateMessage}>
          Loading favorites...
        </Text>
      </View>
    );
  }

  if (error && favorites.length === 0) {
    return (
      <View style={styles.stateContainer}>
        <View style={styles.stateIcon}>
          <Ionicons
            name="alert-circle-outline"
            color={colors.error}
            size={32}
          />
        </View>

        <Text style={styles.errorText}>
          {error}
        </Text>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.stateContainer}>
        <View style={styles.stateIcon}>
          <Ionicons
            name="heart-outline"
            color={colors.favorite}
            size={32}
          />
        </View>

        <Text style={styles.stateTitle}>
          No favorites yet
        </Text>

        <Text style={styles.stateMessage}>
          Save meals you enjoy so you can easily
          find them again.
        </Text>

        <AppButton
          title="Find Meals"
          onPress={handleFindMeals}
          style={styles.stateButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={styles.title}>
          Favorite Meals
        </Text>

        <Text style={styles.subtitle}>
          {favorites.length} saved{" "}
          {favorites.length === 1
            ? "meal"
            : "meals"}
        </Text>
      </View>

      {error && (
        <Text style={styles.errorBanner}>
          {error}
        </Text>
      )}

      <FlatList
        data={favorites}
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
    backgroundColor: colors.background,
    flex: 1,
    paddingHorizontal: spacing.lg,
  },

  heading: {
    paddingBottom: spacing.md,
    paddingTop: spacing.lg,
  },

  title: {
    color: colors.text,
    fontSize: fontSize.sectionTitle,
    fontWeight: "700",
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: spacing.xs,
  },

  list: {
    paddingBottom: spacing.xxl,
  },

  stateContainer: {
    alignItems: "center",
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
    padding: spacing.xl,
  },

  stateIcon: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    height: 64,
    justifyContent: "center",
    marginBottom: spacing.md,
    width: 64,
  },

  stateTitle: {
    color: colors.text,
    fontSize: fontSize.sectionTitle,
    fontWeight: "700",
    textAlign: "center",
  },

  stateMessage: {
    color: colors.textSecondary,
    lineHeight: 21,
    marginTop: spacing.sm,
    textAlign: "center",
  },

  stateButton: {
    marginTop: spacing.lg,
    minWidth: 150,
  },

  errorText: {
    color: colors.error,
    fontSize: fontSize.body,
    textAlign: "center",
  },

  errorBanner: {
    color: colors.error,
    marginBottom: spacing.md,
    textAlign: "center",
  },
});