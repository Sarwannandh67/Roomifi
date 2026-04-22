import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from "date-fns";
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
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  ArrowLeft, 
  Calendar, 
  Download, 
  Filter, 
  PieChart as PieChartIcon, 
  BarChart2, 
  TrendingUp 
} from "lucide-react";

// Mock data for expenses
const mockExpenses = [
  {
    id: "1",
    description: "Groceries",
    amount: 1800,
    paidBy: "You",
    paidByInitials: "YO",
    date: new Date(),
    category: "Food",
    splitWith: [
      { name: "You", amount: 600 },
      { name: "Sam", amount: 600 },
      { name: "Alex", amount: 600 },
    ],
  },
  {
    id: "2",
    description: "Electricity Bill",
    amount: 1200,
    paidBy: "Sam",
    paidByInitials: "SA",
    date: new Date(Date.now() - 2 * 86400000), // 2 days ago
    category: "Utilities",
    splitWith: [
      { name: "You", amount: 400 },
      { name: "Sam", amount: 400 },
      { name: "Alex", amount: 400 },
    ],
  },
  {
    id: "3",
    description: "Internet",
    amount: 999,
    paidBy: "Alex",
    paidByInitials: "AL",
    date: new Date(Date.now() - 5 * 86400000), // 5 days ago
    category: "Utilities",
    splitWith: [
      { name: "You", amount: 333 },
      { name: "Sam", amount: 333 },
      { name: "Alex", amount: 333 },
    ],
  },
  {
    id: "4",
    description: "Dinner at Restaurant",
    amount: 2500,
    paidBy: "You",
    paidByInitials: "YO",
    date: new Date(Date.now() - 7 * 86400000), // 7 days ago
    category: "Food",
    splitWith: [
      { name: "You", amount: 833 },
      { name: "Sam", amount: 833 },
      { name: "Alex", amount: 833 },
    ],
  },
  {
    id: "5",
    description: "Cleaning Supplies",
    amount: 450,
    paidBy: "Sam",
    paidByInitials: "SA",
    date: new Date(Date.now() - 10 * 86400000), // 10 days ago
    category: "Household",
    splitWith: [
      { name: "You", amount: 150 },
      { name: "Sam", amount: 150 },
      { name: "Alex", amount: 150 },
    ],
  },
  {
    id: "6",
    description: "Movie Night",
    amount: 750,
    paidBy: "Alex",
    paidByInitials: "AL",
    date: new Date(Date.now() - 15 * 86400000), // 15 days ago
    category: "Entertainment",
    splitWith: [
      { name: "You", amount: 250 },
      { name: "Sam", amount: 250 },
      { name: "Alex", amount: 250 },
    ],
  },
  {
    id: "7",
    description: "Gas Bill",
    amount: 800,
    paidBy: "You",
    paidByInitials: "YO",
    date: new Date(Date.now() - 20 * 86400000), // 20 days ago
    category: "Utilities",
    splitWith: [
      { name: "You", amount: 267 },
      { name: "Sam", amount: 267 },
      { name: "Alex", amount: 266 },
    ],
  },
];

// Time period options
const timePeriods = [
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "3months", label: "Last 3 Months" },
  { value: "year", label: "This Year" },
];

// Chart type options
const chartTypes = [
  { value: "bar", label: "Bar Chart" },
  { value: "pie", label: "Pie Chart" },
  { value: "trend", label: "Trend" },
];

// Colors for charts
const COLORS = ["#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#EC4899"];

export const ExpenseGraphPage = () => {
  const [timePeriod, setTimePeriod] = useState("month");
  const [chartType, setChartType] = useState("bar");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Filter expenses based on time period and category
  const filteredExpenses = useMemo(() => {
    let result = [...mockExpenses];
    
    // Apply time period filter
    const now = new Date();
    const startDate = new Date();
    
    switch (timePeriod) {
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "3months":
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        break;
    }
    
    result = result.filter(expense => expense.date >= startDate);
    
    // Apply category filter
    if (categoryFilter !== "all") {
      result = result.filter(
        expense => expense.category.toLowerCase() === categoryFilter
      );
    }
    
    return result;
  }, [timePeriod, categoryFilter]);

  // Prepare data for category chart
  const categoryData = useMemo(() => {
    const categoryMap = new Map();
    
    filteredExpenses.forEach(expense => {
      const category = expense.category;
      const amount = expense.amount;
      
      if (categoryMap.has(category)) {
        categoryMap.set(category, categoryMap.get(category) + amount);
      } else {
        categoryMap.set(category, amount);
      }
    });
    
    return Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value
    }));
  }, [filteredExpenses]);

  // Prepare data for paid by chart
  const paidByData = useMemo(() => {
    const paidByMap = new Map();
    
    filteredExpenses.forEach(expense => {
      const paidBy = expense.paidBy;
      const amount = expense.amount;
      
      if (paidByMap.has(paidBy)) {
        paidByMap.set(paidBy, paidByMap.get(paidBy) + amount);
      } else {
        paidByMap.set(paidBy, amount);
      }
    });
    
    return Array.from(paidByMap.entries()).map(([name, value]) => ({
      name,
      value
    }));
  }, [filteredExpenses]);

  // Prepare data for daily trend
  const dailyTrendData = useMemo(() => {
    const now = new Date();
    const startDate = new Date();
    
    switch (timePeriod) {
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "3months":
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        break;
    }
    
    const days = eachDayOfInterval({ start: startDate, end: now });
    
    return days.map(day => {
      const dayExpenses = filteredExpenses.filter(expense => 
        isSameMonth(expense.date, day) && 
        expense.date.getDate() === day.getDate()
      );
      
      const total = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      return {
        date: format(day, "MMM d"),
        amount: total
      };
    });
  }, [filteredExpenses, timePeriod]);

  // Calculate total expenses
  const totalExpenses = useMemo(() => {
    return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [filteredExpenses]);

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-sm text-xs sm:text-sm">
          <p className="font-medium">{label}</p>
          <p className="text-brand-purple">₹{payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto py-3 sm:py-6 space-y-3 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
        <div className="flex items-center gap-2">
          <Link to="/expenses">
            <Button variant="ghost" size="sm" className="h-7 sm:h-9 px-2 sm:px-3">
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm ml-1">Back</span>
            </Button>
          </Link>
          <h1 className="text-lg sm:text-2xl font-bold">Expense Graph</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-7 sm:h-9">
            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="text-xs sm:text-sm">Export</span>
          </Button>
        </div>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader className="pb-1 sm:pb-2">
          <CardTitle className="text-sm sm:text-lg font-medium">Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <span className="text-sm sm:text-lg font-semibold">₹{totalExpenses.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm sm:text-lg font-medium">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1 sm:space-y-2">
              <label htmlFor="timePeriod" className="text-xs sm:text-sm font-medium">
                Time Period
              </label>
              <Select value={timePeriod} onValueChange={setTimePeriod}>
                <SelectTrigger id="timePeriod" className="h-8 sm:h-9">
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  {timePeriods.map((period) => (
                    <SelectItem key={period.value} value={period.value}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <label htmlFor="chartType" className="text-xs sm:text-sm font-medium">
                Chart Type
              </label>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger id="chartType" className="h-8 sm:h-9">
                  <SelectValue placeholder="Select chart type" />
                </SelectTrigger>
                <SelectContent>
                  {chartTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <label htmlFor="category" className="text-xs sm:text-sm font-medium">
                Category
              </label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger id="category" className="h-8 sm:h-9">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Array.from(new Set(mockExpenses.map(expense => expense.category))).map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <Tabs defaultValue="category" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="category" className="text-xs sm:text-sm">
            <PieChartIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            By Category
          </TabsTrigger>
          <TabsTrigger value="paidby" className="text-xs sm:text-sm">
            <BarChart2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            By Person
          </TabsTrigger>
          <TabsTrigger value="trend" className="text-xs sm:text-sm">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            Daily Trend
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="category" className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg font-medium">Expenses by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-60 sm:h-80">
                {chartType === "pie" ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={categoryData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="value" name="Amount" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="paidby" className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg font-medium">Expenses by Person</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-60 sm:h-80">
                {chartType === "pie" ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paidByData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {paidByData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={paidByData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="value" name="Amount" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trend" className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg font-medium">Daily Expense Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-60 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dailyTrendData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="amount" name="Amount" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExpenseGraphPage; 