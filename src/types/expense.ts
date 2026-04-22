export interface Expense {
  id: string;
  title: string;
  description: string;
  amount: number;
  date: Date;
  category: string;
  paidBy: string;
  splitBetween: string[];
  status: "pending" | "settled";
  receipt?: string;
} 