import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "@/context/DashboardContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { suggestAiExpenseSplit } from "@/services/aiExpenseSplit";

const categories = [
  { value: "food", label: "Food" },
  { value: "utilities", label: "Utilities" },
  { value: "household", label: "Household" },
  { value: "entertainment", label: "Entertainment" },
  { value: "other", label: "Other" },
];

const roommates = [
  { value: "You", label: "You" },
  { value: "Sam", label: "Sam" },
  { value: "Alex", label: "Alex" },
];

const splitTypes = [
  { value: "equal", label: "Equal" },
  { value: "custom", label: "Custom" },
  { value: "ai_smart", label: "AI Smart" },
] as const;

export const AddExpensePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addExpense, expenses } = useDashboard();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState("");
  const [aiAnomalies, setAiAnomalies] = useState<string[]>([]);
  const [aiContext, setAiContext] = useState("");

  const [formData, setFormData] = useState({
    id: crypto.randomUUID(),
    description: "",
    amount: "",
    paidBy: "",
    date: new Date().toISOString().split("T")[0],
    category: "food",
    splitType: "custom" as (typeof splitTypes)[number]["value"],
    splitWith: [
      { name: "You", amount: 0 },
      { name: "Sam", amount: 0 },
      { name: "Alex", amount: 0 },
    ],
  });

  const handleSuggestAiSplit = async () => {
    // CRITICAL GUARD: Prevents multiple concurrent API calls
    if (aiLoading) return;

    if (!user) {
      toast({ title: "Auth Required", description: "Log in to use AI.", variant: "destructive" });
      return;
    }

    const amount = parseFloat(formData.amount);
    if (!formData.description || isNaN(amount) || amount <= 0) {
      toast({ title: "Missing Info", description: "Need description and amount.", variant: "destructive" });
      return;
    }

    setAiLoading(true);
    try {
      const suggestion = await suggestAiExpenseSplit({
        description: aiContext.trim() ? `${formData.description} (Context: ${aiContext})` : formData.description,
        amount,
        paidBy: formData.paidBy || "Unknown",
        memberNames: formData.splitWith.map(s => s.name),
        categoryOptions: categories.map(c => c.value),
        history: expenses.slice(-5), // Only send last 5 to save tokens/quota
      });

      setFormData(prev => ({
        ...prev,
        category: suggestion.category,
        splitType: "ai_smart",
        splitWith: suggestion.splits,
      }));
      setAiExplanation(suggestion.explanation);
      setAiAnomalies(suggestion.anomalies);

      toast({ title: "AI Split Applied!" });
    } catch (err: any) {
      toast({
        title: "AI Error",
        description: err.message || "Failed to get suggestion.",
        variant: "destructive",
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Basic validation logic here...
      const expenseAmount = parseFloat(formData.amount);
      const newExpense = {
        ...formData,
        amount: expenseAmount,
        paidByInitials: formData.paidBy.slice(0, 2).toUpperCase(),
        aiExplanation,
        aiAnomalies: aiAnomalies.length ? aiAnomalies : undefined,
      };
      await addExpense(newExpense);
      navigate("/expenses");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/expenses")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Add Expense</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Description & Amount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Dinner, Rent, etc."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Amount (₹)</Label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Paid By & Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Paid By</Label>
                <Select onValueChange={(v) => setFormData({ ...formData, paidBy: v })}>
                  <SelectTrigger><SelectValue placeholder="Who paid?" /></SelectTrigger>
                  <SelectContent>
                    {roommates.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
              </div>
            </div>

            {/* AI Section */}
            <div className="bg-slate-50 p-4 rounded-lg border-2 border-dashed border-slate-200 space-y-4">
              <div className="flex items-center gap-2 text-brand-purple font-semibold">
                <Sparkles className="h-4 w-4" />
                <span>Smart AI Split</span>
              </div>
              <Textarea
                placeholder="Optional: Add context like 'Sam didn't have drinks'..."
                value={aiContext}
                onChange={(e) => setAiContext(e.target.value)}
              />
              <Button
                type="button"
                onClick={handleSuggestAiSplit}
                disabled={aiLoading}
                className="w-full bg-brand-purple hover:bg-brand-purple-dark text-white"
              >
                {aiLoading ? "Consulting AI..." : "Magic Split"}
              </Button>

              {aiExplanation && (
                <div className="text-xs text-slate-600 bg-white p-2 rounded border">
                  <strong>AI Logic:</strong> {aiExplanation}
                </div>
              )}
            </div>

            {/* Manual Split Review */}
            <div className="space-y-4">
              <Label>Final Split Confirmation</Label>
              {formData.splitWith.map((split, i) => (
                <div key={split.name} className="flex items-center gap-4">
                  <span className="w-16 text-sm">{split.name}</span>
                  <Input
                    type="number"
                    value={split.amount}
                    onChange={(e) => {
                      const newSplits = [...formData.splitWith];
                      newSplits[i].amount = parseFloat(e.target.value) || 0;
                      setFormData({ ...formData, splitWith: newSplits, splitType: 'custom' });
                    }}
                  />
                </div>
              ))}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Save Expense"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddExpensePage;