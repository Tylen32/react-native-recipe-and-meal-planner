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
        />
      </View>

      <Text
        style={styles.name}
        numberOfLines={1}
      >
        {category.strCategory}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    marginRight: 12,
    overflow: "hidden",
    width: 140,
  },
  pressed: {
    opacity: 0.7,
  },
  imageContainer: {
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    height: 105,
    justifyContent: "center",
    padding: 8,
  },
  image: {
    height: "100%",
    width: "100%",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingVertical: 12,
    textAlign: "center",
  },
});