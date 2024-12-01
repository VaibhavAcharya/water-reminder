import React from "react";
import { View } from "react-native";
import Animated, { useAnimatedProps } from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type CircularProgressProps = {
  progress: number;
  size?: number;
  strokeWidth?: number;
  backgroundColor?: string;
};

export function CircularProgress({
  progress,
  size = 250,
  strokeWidth = 20,
  backgroundColor = "#E5E7EB",
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progressValue = Math.min(Math.max(progress, 0), 1);
  const strokeDashoffset = circumference * (1 - progressValue);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset,
  }));

  function getProgressColor(progress: number) {
    if (progress < 0.3) return "#ef4444";
    if (progress < 0.7) return "#f59e0b";
    return "#22c55e";
  }

  return (
    <View className="items-center justify-center">
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getProgressColor(progress)}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedProps}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}
