import { Reminder } from "@/types/reminder";
import { Roommate } from "@/types/roommate";
import { Expense } from "@/types/expense";

// Data keys for localStorage
const DATA_KEYS = {
  REMINDERS: "reminders",
  ROOMMATES: "roommates",
  SETTINGS: "settings",
  EXPENSES: "expenses"
};

// Load data from localStorage
export const loadData = <T>(key: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(key);
    if (data) {
      const parsedData = JSON.parse(data);
      // Convert string dates back to Date objects for reminders
      if (key === DATA_KEYS.REMINDERS) {
        return parsedData.map((reminder: any) => ({
          ...reminder,
          dueDate: new Date(reminder.dueDate)
        }));
      }
      return parsedData;
    }
    return defaultValue;
  } catch (error) {
    console.error(`Error loading ${key}:`, error);
    return defaultValue;
  }
};

// Save data to localStorage
export const saveData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
  }
};

// Reminder operations
export const reminderService = {
  getAll: (): Reminder[] => loadData(DATA_KEYS.REMINDERS, []),
  save: (reminders: Reminder[]): void => saveData(DATA_KEYS.REMINDERS, reminders),
  add: (reminder: Reminder): void => {
    const reminders = reminderService.getAll();
    reminders.push(reminder);
    reminderService.save(reminders);
  },
  update: (id: string, updates: Partial<Reminder>): void => {
    const reminders = reminderService.getAll();
    const index = reminders.findIndex(r => r.id === id);
    if (index !== -1) {
      reminders[index] = { ...reminders[index], ...updates };
      reminderService.save(reminders);
    }
  },
  delete: (id: string): void => {
    const reminders = reminderService.getAll();
    const filteredReminders = reminders.filter(r => r.id !== id);
    reminderService.save(filteredReminders);
  }
};

// Roommate operations
export const roommateService = {
  getAll: (): Roommate[] => loadData(DATA_KEYS.ROOMMATES, []),
  save: (roommates: Roommate[]): void => saveData(DATA_KEYS.ROOMMATES, roommates),
  add: (roommate: Roommate): void => {
    const roommates = roommateService.getAll();
    roommates.push(roommate);
    roommateService.save(roommates);
  },
  update: (id: string, updates: Partial<Roommate>): void => {
    const roommates = roommateService.getAll();
    const index = roommates.findIndex(r => r.id === id);
    if (index !== -1) {
      roommates[index] = { ...roommates[index], ...updates };
      roommateService.save(roommates);
    }
  },
  delete: (id: string): void => {
    const roommates = roommateService.getAll();
    const filteredRoommates = roommates.filter(r => r.id !== id);
    roommateService.save(filteredRoommates);
  }
};

// Settings operations
export const settingsService = {
  get: (): any => loadData(DATA_KEYS.SETTINGS, {}),
  save: (settings: any): void => saveData(DATA_KEYS.SETTINGS, settings),
  update: (updates: any): void => {
    const settings = settingsService.get();
    settingsService.save({ ...settings, ...updates });
  }
};

// Expense operations
export const expenseService = {
  getAll: (): Expense[] => loadData(DATA_KEYS.EXPENSES, []),
  save: (expenses: Expense[]): void => saveData(DATA_KEYS.EXPENSES, expenses),
  add: (expense: Expense): void => {
    const expenses = expenseService.getAll();
    expenses.push(expense);
    expenseService.save(expenses);
  },
  update: (id: string, updates: Partial<Expense>): void => {
    const expenses = expenseService.getAll();
    const index = expenses.findIndex(e => e.id === id);
    if (index !== -1) {
      expenses[index] = { ...expenses[index], ...updates };
      expenseService.save(expenses);
    }
  },
  delete: (id: string): void => {
    const expenses = expenseService.getAll();
    const filteredExpenses = expenses.filter(e => e.id !== id);
    expenseService.save(filteredExpenses);
  }
}; 