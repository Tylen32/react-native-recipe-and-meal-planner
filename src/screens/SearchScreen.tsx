import { useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import type {
  CompositeNavigationProp,
} from "@react-navigation/native";
import type {
  BottomTabNavigationProp,
} from "@react-navigation/bottom-tabs";
import type {
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

import { MealCard } from "../components/MealCard";
import { useMealSearch } from "../hooks/useMealSearch";
import type {
  BottomTabParamList,
  RootStackParamList,
} from "../navigation/navigationTypes";

type SearchScreenNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, "Search">,
  NativeStackNavigationProp<RootStackParamList>
>;

export function SearchScreen() {
  const [searchTerm, setSearchTerm] = useState("");

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
    search(searchTerm);
  }

  function handleMealPress(mealId: string) {
    navigation.navigate("MealDetails", {
      mealId,
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find a Meal</Text>

      <TextInput
        style={styles.input}
        placeholder="Search for chicken, pasta..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Button
        title="Search"
        onPress={handleSearch}
        disabled={isLoading || !searchTerm.trim()}
      />

      {isLoading && (
        <ActivityIndicator
          size="large"
          style={styles.message}
        />
      )}

      {!isLoading && error && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}

      {!isLoading &&
        !error &&
        hasSearched &&
        meals.length === 0 && (
          <Text style={styles.message}>
            No meals were found.
          </Text>
        )}

      {!isLoading && !error && (
        <FlatList
          data={meals}
          keyExtractor={(meal) => meal.idMeal}
          contentContainerStyle={styles.list}
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#ffffff",
    borderColor: "#cccccc",
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 12,
    padding: 12,
  },
  list: {
    paddingBottom: 30,
    paddingTop: 20,
  },
  message: {
    marginTop: 20,
    textAlign: "center",
  },
  error: {
    color: "#b00020",
    marginTop: 20,
    textAlign: "center",
  },
});