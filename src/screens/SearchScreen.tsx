import { useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
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

import { useMealSearch } from
  "../hooks/useMealSearch";

import type {
  BottomTabParamList,
  RootStackParamList,
} from "../navigation/navigationTypes";

import {
  colors,
  fontSize,
  radius,
  shadows,
  spacing,
} from "../theme/theme";

type SearchScreenNavigation =
  CompositeNavigationProp<
    BottomTabNavigationProp<
      BottomTabParamList,
      "Search"
    >,
    NativeStackNavigationProp<RootStackParamList>
  >;

export function SearchScreen() {
  const [searchTerm, setSearchTerm] =
    useState("");

  const navigation =
    useNavigation<SearchScreenNavigation>();

  const {
    meals,
    isLoading,
    hasSearched,
    error,
    search,
  } = useMealSearch();

  function handleSearch() {
    void search(searchTerm);
  }

  function handleMealPress(mealId: string) {
    navigation.navigate("MealDetails", {
      mealId,
    });
  }

  const shouldShowResults =
    !isLoading &&
    !error &&
    meals.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.introduction}>
        <Text style={styles.title}>
          Find a Meal
        </Text>

        <Text style={styles.subtitle}>
          Search by meal name or a common food.
        </Text>
      </View>

      <View style={styles.searchPanel}>
        <View style={styles.inputContainer}>
          <Ionicons
            name="search-outline"
            color={colors.textSecondary}
            size={21}
          />

          <TextInput
            style={styles.input}
            placeholder="Chicken, pasta, curry..."
            placeholderTextColor={
              colors.textSecondary
            }
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel="Search for a meal"
          />
        </View>

        <AppButton
          title="Search"
          onPress={handleSearch}
          isLoading={isLoading}
          disabled={!searchTerm.trim()}
        />
      </View>

      {isLoading && (
        <View style={styles.stateContainer}>
          <ActivityIndicator
            color={colors.primary}
            size="large"
          />

          <Text style={styles.stateMessage}>
            Searching for meals...
          </Text>
        </View>
      )}

      {!isLoading && error && (
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

          <AppButton
            title="Try Again"
            variant="outline"
            onPress={handleSearch}
            style={styles.stateButton}
          />
        </View>
      )}

      {!isLoading &&
        !error &&
        hasSearched &&
        meals.length === 0 && (
          <View style={styles.stateContainer}>
            <View style={styles.stateIcon}>
              <Ionicons
                name="search-outline"
                color={colors.primary}
                size={32}
              />
            </View>

            <Text style={styles.stateTitle}>
              No meals found
            </Text>

            <Text style={styles.stateMessage}>
              Try another meal name or browse
              categories from Home.
            </Text>
          </View>
        )}

      {shouldShowResults && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>
            {meals.length}{" "}
            {meals.length === 1
              ? "meal"
              : "meals"}{" "}
            found
          </Text>

          <FlatList
            data={meals}
            keyExtractor={(meal) => meal.idMeal}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },

  introduction: {
    marginBottom: spacing.lg,
  },

  title: {
    color: colors.text,
    fontSize: fontSize.screenTitle,
    fontWeight: "700",
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
    lineHeight: 22,
    marginTop: spacing.xs,
  },

  searchPanel: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,

    ...shadows.card,
  },

  inputContainer: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: spacing.md,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },

  input: {
    color: colors.text,
    flex: 1,
    fontSize: fontSize.body,
    marginLeft: spacing.sm,
    paddingVertical: spacing.md,
  },

  resultsContainer: {
    flex: 1,
    marginTop: spacing.xl,
  },

  resultsText: {
    color: colors.textSecondary,
    fontSize: 15,
    marginBottom: spacing.md,
  },

  list: {
    paddingBottom: spacing.xxl,
  },

  stateContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingBottom: 80,
    paddingHorizontal: spacing.xl,
  },

  stateIcon: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    height: 62,
    justifyContent: "center",
    marginBottom: spacing.md,
    width: 62,
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

  errorText: {
    color: colors.error,
    fontSize: fontSize.body,
    textAlign: "center",
  },

  stateButton: {
    marginTop: spacing.lg,
    minWidth: 140,
  },
});