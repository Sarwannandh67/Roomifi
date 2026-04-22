export interface Reminder {
  id: string;
  title: string;
  description: string;
  type: "expense" | "chore" | "custom";
  dueDate: Date;
  priority: "high" | "medium" | "low";
  status: "pending" | "completed" | "overdue";
  assignedTo?: string;
  assignedToInitials?: string;
  amount?: number;
  category?: string;
  recurrence?: string;
  tone?: string;
  customTone?: string;
  isAI?: boolean;
} 