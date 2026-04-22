import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useDashboard } from "@/context/DashboardContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Plus, 
  MoreHorizontal, 
  Receipt, 
  BarChart2, 
  Filter, 
  Search,
  X,
  Pencil,
  Trash2
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

// Categories for filtering
const categories = [
  { value: "all", label: "All Categories" },
  { value: "food", label: "Food" },
  { value: "utilities", label: "Utilities" },
  { value: "household", label: "Household" },
  { value: "entertainment", label: "Entertainment" },
  { value: "other", label: "Other" },
];

// Sort options
const sortOptions = [
  { value: "date-desc", label: "Date (Newest)" },
  { value: "date-asc", label: "Date (Oldest)" },
  { value: "amount-desc", label: "Amount (Highest)" },
  { value: "amount-asc", label: "Amount (Lowest)" },
];

export const ExpensesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { expenses, deleteExpense, addExpense, loading, error } = useDashboard();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Filter and sort expenses
  const filteredExpenses = useMemo(() => {
    let result = [...expenses];
    
    // Apply category filter
    if (categoryFilter !== "all") {
      result = result.filter(
        expense => expense.category.toLowerCase() === categoryFilter
      );
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        expense => 
          expense.description.toLowerCase().includes(query) ||
          expense.paidBy.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "amount-desc":
          return b.amount - a.amount;
        case "amount-asc":
          return a.amount - b.amount;
        default:
          return 0;
      }
    });
    
    return result;
  }, [expenses, categoryFilter, sortBy, searchQuery]);

  // Calculate total expenses
  const totalExpenses = useMemo(() => {
    return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [filteredExpenses]);

  // Calculate your share of expenses
  const yourShare = useMemo(() => {
    return filteredExpenses.reduce((sum, expense) => {
      const yourSplit = expense.splitWith.find(split => split.name === "You");
      return sum + (yourSplit?.amount || 0);
    }, 0);
  }, [filteredExpenses]);

  // Handle expense deletion
  const handleDeleteExpense = (id: string) => {
    setExpenseToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (expenseToDelete) {
      deleteExpense(expenseToDelete);
      toast({
        title: "Expense deleted",
        description: "The expense has been successfully deleted.",
      });
    }
    setIsDeleteDialogOpen(false);
    setExpenseToDelete(null);
  };

  // Handle expense editing
  const handleEditExpense = (id: string) => {
    navigate(`/expenses/edit/${id}`);
  };

  // Add new expense handler
  const handleAddExpense = async (expenseData: any) => {
    try {
      await addExpense(expenseData);
      toast({
        title: "Expense added",
        description: "The expense has been successfully added.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get category badge variant
  const getCategoryBadgeVariant = (category: string): BadgeProps["variant"] => {
    switch (category.toLowerCase()) {
      case "food":
        return "default";
      case "utilities":
        return "secondary";
      case "household":
        return "outline";
      case "entertainment":
        return "destructive";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-4 px-4">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading expenses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-4 px-4">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 px-4 space-y-4 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Expenses</h1>
          <div className="flex gap-2 w-full sm:w-auto">
            <Link to="/expenses/graph" className="flex-1 sm:flex-none">
              <Button variant="outline" size="icon" className="h-9 w-full sm:w-9 md:w-auto md:px-4">
                <BarChart2 className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Insights</span>
              </Button>
            </Link>
            <Link to="/expenses/add" className="flex-1 sm:flex-none">
              <Button 
                className="h-9 w-full sm:w-9 md:w-auto md:px-4 bg-brand-purple hover:bg-brand-purple-dark"
                onClick={() => navigate("/expenses/add")}
              >
                <Plus className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Add</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1.5 h-7 w-7"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-full sm:w-9">
                <Filter className="h-4 w-4" />
                <span className="ml-2 sm:hidden">Filters</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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
                  <label className="text-sm font-medium">Sort by</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Stats Cards */}
      {expenses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Receipt className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-2xl font-bold">₹{totalExpenses.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Your Share</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BarChart2 className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-2xl font-bold">₹{yourShare.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Expenses List */}
      <div className="space-y-4">
        {expenses.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <Receipt className="h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="text-lg font-medium">No expenses yet</p>
                  <p className="text-muted-foreground">Add your first expense to get started</p>
                </div>
                <Button 
                  className="bg-brand-purple hover:bg-brand-purple-dark"
                  onClick={() => navigate("/expenses/add")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : filteredExpenses.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No expenses match your current filters.</p>
            </CardContent>
          </Card>
        ) : (
          filteredExpenses.map((expense) => (
            <Card key={expense.id} className="relative">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{expense.paidByInitials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{expense.description}</CardTitle>
                    <CardDescription>
                      {format(new Date(expense.date), "MMM d, yyyy")} • {expense.paidBy}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                  <Badge variant={getCategoryBadgeVariant(expense.category)}>
                    {expense.category}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditExpense(expense.id)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="text-2xl font-bold">₹{expense.amount.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">
                    Your share: ₹{expense.splitWith.find(split => split.name === "You")?.amount.toFixed(2)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the expense.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ExpensesPage;
