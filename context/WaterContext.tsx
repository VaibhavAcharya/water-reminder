import React, { createContext, useContext, useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

type DailyRecord = {
  date: string;
  intake: number;
  goal: number;
  isCompleted: boolean;
};

type WaterContextType = {
  reminderEnabled: boolean;
  reminderInterval: number;
  toggleReminder: (enabled: boolean) => void;
  updateReminderInterval: (minutes: number) => void;
  currentIntake: number;
  dailyGoal: number;
  history: DailyRecord[];
  updateIntake: (amount: number) => void;
  updateDailyGoal: (goal: number) => void;
  clearHistory: () => void;
};

const WaterContext = createContext<WaterContextType | null>(null);

export function WaterProvider({ children }: { children: React.ReactNode }) {
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderInterval, setReminderInterval] = useState(60); // Default 60 minutes

  async function scheduleNotification() {
    // Cancel any existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    if (!reminderEnabled) return;

    // Schedule new notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time to drink water! 💧",
        body: `Stay hydrated! You've had ${currentIntake}ml of your ${dailyGoal}ml goal.`,
        sound: true,
      },
      trigger: {
        channelId: "water-reminder",
        seconds: reminderInterval * 60, // Convert minutes to seconds
        repeats: true,
      },
    });
  }

  async function toggleReminder(enabled: boolean) {
    setReminderEnabled(enabled);
    await AsyncStorage.setItem("reminderEnabled", JSON.stringify(enabled));
    if (enabled) {
      scheduleNotification();
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
  }

  async function updateReminderInterval(minutes: number) {
    setReminderInterval(minutes);
    await AsyncStorage.setItem("reminderInterval", String(minutes));
    if (reminderEnabled) {
      scheduleNotification();
    }
  }
  const [currentIntake, setCurrentIntake] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(2000); // Default 2L
  const [history, setHistory] = useState<DailyRecord[]>([]);

  // Load saved data on mount
  useEffect(() => {
    loadSavedData();
  }, []);

  async function loadSavedData() {
    try {
      const savedIntake = await AsyncStorage.getItem("currentIntake");
      const savedGoal = await AsyncStorage.getItem("dailyGoal");
      const savedHistory = await AsyncStorage.getItem("waterHistory");
      const savedReminderEnabled =
        await AsyncStorage.getItem("reminderEnabled");
      const savedReminderInterval =
        await AsyncStorage.getItem("reminderInterval");

      if (savedIntake) setCurrentIntake(Number(savedIntake));
      if (savedGoal) setDailyGoal(Number(savedGoal));
      if (savedHistory) setHistory(JSON.parse(savedHistory));
      if (savedReminderEnabled)
        setReminderEnabled(JSON.parse(savedReminderEnabled));
      if (savedReminderInterval)
        setReminderInterval(Number(savedReminderInterval));
    } catch (error) {
      console.error("Error loading water data:", error);
    }
  }

  async function updateHistory() {
    const today = new Date().toISOString().split("T")[0];
    const existingRecord = history.find((record) => record.date === today);

    if (existingRecord) {
      const updatedHistory = history.map((record) =>
        record.date === today
          ? {
              ...record,
              intake: currentIntake,
              isCompleted: currentIntake >= dailyGoal,
            }
          : record,
      );
      setHistory(updatedHistory);
    } else {
      const newRecord: DailyRecord = {
        date: today,
        intake: currentIntake,
        goal: dailyGoal,
        isCompleted: currentIntake >= dailyGoal,
      };
      setHistory([newRecord, ...history]);
    }
    await AsyncStorage.setItem("waterHistory", JSON.stringify(history));
  }

  async function updateIntake(amount: number) {
    const newIntake = Math.max(0, currentIntake + amount);
    setCurrentIntake(newIntake);
    await AsyncStorage.setItem("currentIntake", String(newIntake));
  }

  async function updateDailyGoal(goal: number) {
    setDailyGoal(goal);
    await AsyncStorage.setItem("dailyGoal", String(goal));
  }

  async function clearHistory() {
    setHistory([]);
    await AsyncStorage.setItem("waterHistory", JSON.stringify([]));
  }

  useEffect(() => {
    updateHistory();
  }, [currentIntake]);

  return (
    <WaterContext.Provider
      value={{
        currentIntake,
        dailyGoal,
        history,
        updateIntake,
        updateDailyGoal,
        clearHistory,
        reminderEnabled,
        reminderInterval,
        toggleReminder,
        updateReminderInterval,
      }}
    >
      {children}
    </WaterContext.Provider>
  );
}

export function useWater() {
  const context = useContext(WaterContext);
  if (!context) throw new Error("useWater must be used within WaterProvider");
  return context;
}
