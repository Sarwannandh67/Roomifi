import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useExpenses } from "@/context/ExpensesContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const categories = [
  { value: "food", label: "Food" },
  { value: "utilities", label: "Utilities" },
  { value: "household", label: "Household" },
  { value: "entertainment", label: "Entertainment" },
  { value: "other", label: "Other" },
];

export const EditExpensePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const { getExpense, updateExpense } = useExpenses();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    paidBy: "",
    paidByInitials: "",
    date: "",
    category: "food",
    splitWith: [
      { name: "You", amount: 0 },
      { name: "Sam", amount: 0 },
      { name: "Alex", amount: 0 },
    ],
  });

  useEffect(() => {
    const expense = getExpense(id || "");
    if (expense) {
      setFormData({
        description: expense.description,
        amount: expense.amount.toString(),
        paidBy: expense.paidBy,
        paidByInitials: expense.paidByInitials,
        date: expense.date.split("T")[0],
        category: expense.category,
        splitWith: expense.splitWith,
      });
    }
  }, [id, getExpense]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSplitChange = (index: number, value: string) => {
    const amount = parseFloat(value) || 0;
    const newSplitWith = [...formData.splitWith];
    newSplitWith[index] = {
      ...newSplitWith[index],
      amount,
    };
    setFormData(prev => ({
      ...prev,
      splitWith: newSplitWith,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!id) throw new Error("Expense ID is required");

      updateExpense(id, {
        ...formData,
        amount: parseFloat(formData.amount),
        splitWith: formData.splitWith.map(split => ({
          ...split,
          amount: parseFloat(split.amount.toString()),
        })),
      });

      toast({
        title: "Expense updated",
        description: "The expense has been successfully updated.",
      });

      navigate("/expenses");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update expense. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!id) {
    return (
      <div className="container mx-auto py-4 px-4">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-600">Expense ID is required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 px-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paidBy">Paid By</Label>
              <Input
                id="paidBy"
                name="paidBy"
                value={formData.paidBy}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paidByInitials">Paid By Initials</Label>
              <Input
                id="paidByInitials"
                name="paidByInitials"
                value={formData.paidByInitials}
                onChange={handleChange}
                required
                maxLength={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData(prev => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Split With</Label>
              {formData.splitWith.map((split, index) => (
                <div key={split.name} className="flex items-center gap-2">
                  <span className="w-20">{split.name}</span>
                  <Input
                    type="number"
                    value={split.amount}
                    onChange={(e) => handleSplitChange(index, e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/expenses")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Expense"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}; 