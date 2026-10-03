import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type {
  MealCategory,
} from "../models/MealCategory";

import {
  colors,
  fontSize,
  radius,
  shadows,
  spacing,
} from "../theme/theme";

type CategoryCardProps = {
  category: MealCategory;
  onPress: () => void;
};

export function CategoryCard({
  category,
  onPress,
}: CategoryCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={
        `Browse ${category.strCategory} meals`
      }
    >
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: category.strCategoryThumb,
          }}
          style={styles.image}
          resizeMode="contain"
          accessible={false}
        />
      </View>

      <View style={styles.content}>
        <Text
          style={styles.name}
          numberOfLines={1}
        >
          {category.strCategory}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginRight: spacing.md,
    overflow: "hidden",
    width: 145,

    ...shadows.card,
  },

  pressed: {
    opacity: 0.85,
    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  imageContainer: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    height: 110,
    justifyContent: "center",
    padding: spacing.sm,
  },

  image: {
    height: "100%",
    width: "100%",
  },

  content: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
  },

  name: {
    color: colors.text,
    fontSize: fontSize.body,
    fontWeight: "600",
    textAlign: "center",
  },
});