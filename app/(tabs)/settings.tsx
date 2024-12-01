import React from "react";
import { View, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/Text";
import { WaterButton } from "@/components/ui/WaterButton";
import { useWater } from "@/context/WaterContext";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { cn } from "@/utils/styling";

export default function SettingsScreen() {
  const {
    dailyGoal,
    updateDailyGoal,
    history,
    clearHistory,
    reminderEnabled,
    reminderInterval,
    toggleReminder,
    updateReminderInterval,
  } = useWater();

  function handleClearHistory() {
    Alert.alert(
      "Clear History",
      "Are you sure you want to clear all history? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear", style: "destructive", onPress: clearHistory },
      ],
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1">
        <View className="gap-8 p-4">
          <View className="gap-4">
            <Text className="text-3xl font-bold text-center">Daily goal</Text>

            <View className="flex-row justify-center items-center gap-6">
              <WaterButton
                type="remove"
                amount={50}
                onPress={() => updateDailyGoal(Math.max(500, dailyGoal - 50))}
                className="scale-75"
              />
              <View>
                <Text className="text-2xl font-bold text-center">
                  {dailyGoal}ml
                </Text>
              </View>
              <WaterButton
                type="add"
                amount={50}
                onPress={() => updateDailyGoal(dailyGoal + 50)}
                className="scale-75"
              />
            </View>
          </View>

          <View className="h-px bg-white/25 rounded-full w-full" />
          <View className="gap-4">
            <Text className="text-3xl font-bold">Reminders</Text>

            <View className="bg-white/5 rounded-lg p-4 gap-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg">Enable Reminders</Text>
                <Pressable
                  onPress={() => toggleReminder(!reminderEnabled)}
                  className={cn(
                    "w-14 h-8 rounded-full transition-colors",
                    reminderEnabled ? "bg-blue-600" : "bg-neutral-600",
                  )}
                >
                  <View
                    className={cn(
                      "w-6 h-6 rounded-full bg-white m-1 transition-transform",
                      reminderEnabled ? "translate-x-6" : "translate-x-0",
                    )}
                  />
                </Pressable>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-lg">Reminder Interval</Text>
                <View className="flex-row items-center gap-2">
                  <Text>{reminderInterval} min</Text>
                  <Pressable
                    onPress={() =>
                      updateReminderInterval(
                        Math.max(15, reminderInterval - 15),
                      )
                    }
                    className="w-8 h-8 bg-white/10 rounded-full items-center justify-center"
                  >
                    <IconSymbol name="minus" size={20} color="white" />
                  </Pressable>
                  <Pressable
                    onPress={() =>
                      updateReminderInterval(reminderInterval + 15)
                    }
                    className="w-8 h-8 bg-white/10 rounded-full items-center justify-center"
                  >
                    <IconSymbol name="plus" size={20} color="white" />
                  </Pressable>
                </View>
              </View>
            </View>
          </View>

          <View className="h-px bg-white/25 rounded-full w-full" />

          <View className="gap-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-3xl font-bold">History</Text>
              <Pressable
                onPress={handleClearHistory}
                className="w-8 h-8 items-center justify-center"
              >
                <IconSymbol name="trash" size={24} color="white" />
              </Pressable>
            </View>

            <View />

            <View className="gap-2">
              {history.map((record) => (
                <View
                  key={record.date}
                  className="flex-row items-center justify-between p-4 bg-white/5 rounded-lg"
                >
                  <View>
                    <Text className="font-semibold">
                      {new Date(record.date).toLocaleDateString(undefined, {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                    <Text className="text-sm text-neutral-400">
                      {record.intake}ml of {record.goal}ml
                    </Text>
                  </View>
                  <IconSymbol
                    name={
                      record.isCompleted
                        ? "checkmark.circle.fill"
                        : "x.circle.fill"
                    }
                    size={24}
                    color={record.isCompleted ? "#22c55e" : "#ef4444"}
                  />
                </View>
              ))}
              {history.length === 0 && (
                <Text className="text-center text-neutral-500 py-4">
                  No history available
                </Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
