import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

import type {
  StyleProp,
  ViewStyle,
} from "react-native";

import {
  colors,
  fontSize,
  radius,
  spacing,
} from "../theme/theme";

export type AppButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "outline";

type AppButtonProps = {
  title: string;
  onPress: () => void | Promise<void>;
  variant?: AppButtonVariant;
  disabled?: boolean;
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function AppButton({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  isLoading = false,
  style,
}: AppButtonProps) {
  const isUnavailable = disabled || isLoading;

  const loadingColor =
    variant === "outline"
      ? colors.primary
      : colors.textOnPrimary;

  function handlePress() {
    if (isUnavailable) {
      return;
    }

    void onPress();
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        styles[`${variant}Button`],
        pressed &&
          !isUnavailable &&
          styles.pressed,
        isUnavailable && styles.disabled,
        style,
      ]}
      onPress={handlePress}
      disabled={isUnavailable}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{
        disabled: isUnavailable,
        busy: isLoading,
      }}
    >
      {isLoading ? (
        <ActivityIndicator
          color={loadingColor}
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.label,
            styles[`${variant}Label`],
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: radius.md,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },

  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  dangerButton: {
    backgroundColor: colors.error,
  },
  outlineButton: {
    backgroundColor: colors.transparent,
    borderColor: colors.primary,
    borderWidth: 1.5,
  },

  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },

  label: {
    fontSize: fontSize.body,
    fontWeight: "600",
    textAlign: "center",
  },
  primaryLabel: {
    color: colors.textOnPrimary,
  },
  secondaryLabel: {
    color: colors.textOnPrimary,
  },
  dangerLabel: {
    color: colors.textOnPrimary,
  },
  outlineLabel: {
    color: colors.primary,
  },
});