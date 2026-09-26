// the meal card is used to display a picture of the meal and its name

import {
  Image,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
import type { MealSummary } from "../models/Meal";

type MealCardProps = {
  meal: MealSummary;
  onPress: () => void;
};

export function MealCard({ meal, onPress }: MealCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: meal.strMealThumb }}
        style={styles.image}
      />

      <Text style={styles.name}>{meal.strMeal}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 180,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    padding: 12,
  },
});