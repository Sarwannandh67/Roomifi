import React, { createContext, useContext, useState, useEffect } from 'react';

// Types for different data
interface Split {
  name: string;
  amount: number;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  paidByInitials: string;
  date: string;
  category: string;
  splitWith: Split[];
  splitType?: "equal" | "custom" | "ai_smart";
  aiExplanation?: string;
  aiAnomalies?: string[];
}

interface Chore {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: 'pending' | 'completed';
  frequency: 'daily' | 'weekly' | 'monthly';
}

interface Reminder {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

interface DashboardContextType {
  // Expenses
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  getExpense: (id: string) => Expense | undefined;

  // Chores
  chores: Chore[];
  addChore: (chore: Omit<Chore, 'id'>) => void;
  updateChore: (id: string, chore: Partial<Chore>) => void;
  deleteChore: (id: string) => void;
  getChore: (id: string) => Chore | undefined;

  // Reminders
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, 'id'>) => void;
  updateReminder: (id: string, reminder: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  getReminder: (id: string) => Reminder | undefined;

  // Loading and error states
  loading: boolean;
  error: string | null;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [chores, setChores] = useState<Chore[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all data from localStorage on initial mount
  useEffect(() => {
    try {
      const savedExpenses = localStorage.getItem('expenses');
      const savedChores = localStorage.getItem('chores');
      const savedReminders = localStorage.getItem('reminders');

      if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
      if (savedChores) setChores(JSON.parse(savedChores));
      if (savedReminders) setReminders(JSON.parse(savedReminders));
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('expenses', JSON.stringify(expenses));
      localStorage.setItem('chores', JSON.stringify(chores));
      localStorage.setItem('reminders', JSON.stringify(reminders));
    } catch (err) {
      setError('Failed to save dashboard data');
    }
  }, [expenses, chores, reminders]);

  // Expense functions
  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  const updateExpense = (id: string, updatedExpense: Partial<Expense>) => {
    setExpenses(prev =>
      prev.map(expense =>
        expense.id === id ? { ...expense, ...updatedExpense } : expense
      )
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const getExpense = (id: string) => {
    return expenses.find(expense => expense.id === id);
  };

  // Chore functions
  const addChore = (chore: Omit<Chore, 'id'>) => {
    const newChore: Chore = {
      ...chore,
      id: Date.now().toString(),
    };
    setChores(prev => [...prev, newChore]);
  };

  const updateChore = (id: string, updatedChore: Partial<Chore>) => {
    setChores(prev =>
      prev.map(chore =>
        chore.id === id ? { ...chore, ...updatedChore } : chore
      )
    );
  };

  const deleteChore = (id: string) => {
    setChores(prev => prev.filter(chore => chore.id !== id));
  };

  const getChore = (id: string) => {
    return chores.find(chore => chore.id === id);
  };

  // Reminder functions
  const addReminder = (reminder: Omit<Reminder, 'id'>) => {
    const newReminder: Reminder = {
      ...reminder,
      id: Date.now().toString(),
    };
    setReminders(prev => [...prev, newReminder]);
  };

  const updateReminder = (id: string, updatedReminder: Partial<Reminder>) => {
    setReminders(prev =>
      prev.map(reminder =>
        reminder.id === id ? { ...reminder, ...updatedReminder } : reminder
      )
    );
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
  };

  const getReminder = (id: string) => {
    return reminders.find(reminder => reminder.id === id);
  };

  return (
    <DashboardContext.Provider
      value={{
        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        getExpense,
        chores,
        addChore,
        updateChore,
        deleteChore,
        getChore,
        reminders,
        addReminder,
        updateReminder,
        deleteReminder,
        getReminder,
        loading,
        error,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}; 
