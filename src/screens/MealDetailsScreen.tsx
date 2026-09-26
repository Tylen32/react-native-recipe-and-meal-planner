import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMealDetails } from "../hooks/useMealDetails";
import type { RootStackParamList } from "../navigation/navigationTypes";

type MealDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "MealDetails"
>;

export function MealDetailsScreen({
  route,
}: MealDetailsScreenProps) {
  const { mealId } = route.params;
  const { meal, isLoading, error } = useMealDetails(mealId);

  if (isLoading) {
    return <ActivityIndicator style={styles.centered} size="large" />;
  }

  if (error) {
    return <Text style={styles.centered}>{error}</Text>;
  }

  if (!meal) {
    return <Text style={styles.centered}>Meal not found.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: meal.strMealThumb }}
        style={styles.image}
      />

      <Text style={styles.title}>{meal.strMeal}</Text>

      <Text style={styles.metadata}>
        {meal.strCategory ?? "No category"}
        {" • "}
        {meal.strArea ?? "Unknown cuisine"}
      </Text>

      <Text style={styles.heading}>Instructions</Text>
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
    marginTop: 60,
    textAlign: "center",
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
});