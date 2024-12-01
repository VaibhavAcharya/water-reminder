import React from "react";
import { Pressable, PressableProps } from "react-native";
import { Text } from "./Text";
import * as Haptics from "expo-haptics";
import { cn } from "@/utils/styling";

type WaterButtonProps = {
  onPress: () => void;
  amount: number;
  type: "add" | "remove";
} & PressableProps;

export const WaterButton: React.ComponentType<WaterButtonProps> = ({
  onPress,
  amount,
  type,
  className,
  ...props
}) => {
  function handlePress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }
  function getColorClassname() {
    if (amount <= 150) return type === "add" ? "bg-blue-500" : "bg-red-500";
    return type === "add" ? "bg-blue-700" : "bg-red-700";
  }

  return (
    <Pressable
      onPress={handlePress}
      className={cn("px-6 py-3 rounded-full", getColorClassname(), className)}
      {...props}
    >
      <Text className="text-white text-lg font-semibold">
        {type === "add" ? "+" : "-"}
        {amount}ml
      </Text>
    </Pressable>
  );
};
