import React from "react";
import { View, Share, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/Text";
import { CircularProgress } from "@/components/ui/CircularProgress";
import { WaterButton } from "@/components/ui/WaterButton";
import { useWater } from "@/context/WaterContext";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Pressable } from "react-native";

export default function HomeScreen() {
  const { currentIntake, dailyGoal, updateIntake } = useWater();
  const progress = currentIntake / dailyGoal;

  async function handleShare() {
    try {
      await Share.share({
        message: `I've drunk ${currentIntake}ml of water today! 💧`,
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1 gap-8">
        <View className="flex-row justify-between items-center p-4">
          <View />
          <Pressable
            onPress={handleShare}
            className="w-8 h-8 items-center justify-center"
          >
            <IconSymbol size={24} name="square.and.arrow.up" color="white" />
          </Pressable>
        </View>

        <View className="px-4 gap-6">
          <Text className="text-white text-3xl font-bold text-center">
            Water Reminder
          </Text>

          <View className="h-2" />

          <View className="items-center justify-center gap-4">
            <CircularProgress progress={progress} size={280} />

            <View className="absolute">
              <Text className="text-4xl font-bold text-center">
                {currentIntake}
                <Text className="text-2xl font-normal">ml</Text>
              </Text>
              <Text className="text-gray-500 text-center mt-2">
                of {dailyGoal}ml daily goal
              </Text>
              <Text className="text-center mt-2 text-sm">
                {(progress * 100).toFixed(1)}% completed
              </Text>
            </View>
          </View>

          <View className="h-2" />

          <View className="flex-row flex-wrap justify-around gap-4 mt-8">
            <View className="gap-4">
              <WaterButton
                type="add"
                amount={250}
                onPress={() => updateIntake(250)}
              />
              <WaterButton
                type="add"
                amount={50}
                onPress={() => updateIntake(50)}
                className="scale-75"
              />
            </View>
            <View className="gap-4">
              <WaterButton
                type="remove"
                amount={250}
                onPress={() => updateIntake(-250)}
              />
              <WaterButton
                type="remove"
                amount={50}
                onPress={() => updateIntake(-50)}
                className="scale-75"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
