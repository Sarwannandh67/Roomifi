import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  paidByInitials: string;
  date: Date;
  splitWith: { name: string; amount: number }[];
}

interface RecentExpensesProps {
  expenses: Expense[];
}

export const RecentExpenses: React.FC<RecentExpensesProps> = ({ expenses }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base sm:text-lg font-medium">Recent Expenses</CardTitle>
        <div className="flex gap-1 sm:gap-2">
          <Link to="/expenses/add">
            <Button variant="outline" size="sm" className="h-7 sm:h-8">
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="text-xs sm:text-sm">Add</span>
            </Button>
          </Link>
          <Link to="/expenses">
            <Button variant="ghost" size="sm" className="h-7 sm:h-8 text-brand-purple">
              <span className="text-xs sm:text-sm mr-1">View All</span>
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {expenses.length > 0 ? (
          <div className="space-y-2 sm:space-y-3">
            {expenses.slice(0, 3).map((expense) => (
              <div
                key={expense.id}
                className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-0 border-b border-border pb-2 sm:pb-3 last:border-0 last:pb-0"
              >
                <div className="flex gap-2 sm:gap-3">
                  <Avatar className="h-7 w-7 sm:h-9 sm:w-9">
                    <AvatarFallback className="text-[10px] sm:text-xs bg-brand-purple-light text-brand-purple-dark">
                      {expense.paidByInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm sm:text-base font-medium">{expense.description}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      {expense.paidBy} paid • {formatDistanceToNow(expense.date, { addSuffix: true })}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm sm:text-base font-bold">₹{expense.amount.toFixed(2)}</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">
                    {expense.splitWith.length} people
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 sm:py-6 text-center">
            <Receipt className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground mb-2" />
            <p className="text-sm sm:text-base text-muted-foreground">No recent expenses</p>
            <Link to="/expenses/add">
              <Button className="mt-2 sm:mt-3 bg-brand-purple hover:bg-brand-purple-dark text-xs sm:text-sm">
                Add Expense
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentExpenses;
