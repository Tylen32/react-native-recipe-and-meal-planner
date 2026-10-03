import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Ionicons from
  "@expo/vector-icons/Ionicons";

import type {
  MealSummary,
} from "../models/Meal";

import {
  colors,
  fontSize,
  radius,
  shadows,
  spacing,
} from "../theme/theme";

type MealCardProps = {
  meal: MealSummary;
  onPress: () => void;
};

export function MealCard({
  meal,
  onPress,
}: MealCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Open ${meal.strMeal}`}
    >
      <Image
        source={{
          uri: meal.strMealThumb,
        }}
        style={styles.image}
        resizeMode="cover"
        accessible={false}
      />

      <View style={styles.content}>
        <Text
          style={styles.name}
          numberOfLines={2}
        >
          {meal.strMeal}
        </Text>

        <Ionicons
          name="chevron-forward"
          color={colors.textSecondary}
          size={22}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    overflow: "hidden",

    ...shadows.card,
  },

  pressed: {
    opacity: 0.85,
    transform: [
      {
        scale: 0.99,
      },
    ],
  },

  image: {
    backgroundColor: colors.surfaceMuted,
    height: 190,
    width: "100%",
  },

  content: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: 60,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },

  name: {
    color: colors.text,
    flex: 1,
    fontSize: fontSize.subtitle,
    fontWeight: "600",
    lineHeight: 24,
    marginRight: spacing.sm,
  },
});