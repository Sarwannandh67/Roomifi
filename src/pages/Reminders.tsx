import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { format, isToday, isPast, isTomorrow, isThisWeek } from "date-fns";
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
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Badge, 
  BadgeProps 
} from "@/components/ui/badge";
import { 
  Avatar, 
  AvatarFallback 
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Plus, 
  MoreHorizontal, 
  Bell, 
  Calendar, 
  Filter,
  Search,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Send,
  Save,
  Clock,
  Bot,
  MessageSquare,
  Settings,
  Copy,
  Share2,
  Loader2,
  Receipt,
  Edit,
  Check,
  DollarSign
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { reminderService, roommateService } from "@/services/dataService";
import { Reminder } from "@/types/reminder";
import { Roommate } from "@/types/roommate";

// Tone options
const toneOptions = [
  { value: "sarcastic", label: "Sarcastic", icon: "😏" },
  { value: "friendly", label: "Friendly", icon: "😊" },
  { value: "passive-aggressive", label: "Passive-aggressive", icon: "😬" },
  { value: "professional", label: "Professional", icon: "👔" },
  { value: "chill", label: "Chill", icon: "🧘" },
  { value: "custom", label: "Custom", icon: "🎛" }
];

// Recurrence options
const recurrenceOptions = [
  { value: "none", label: "No Recurrence" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Every 2 Weeks" },
  { value: "monthly", label: "Monthly" }
];

// Priority options
const priorities = [
  { value: "high", label: "High Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "low", label: "Low Priority" }
];

// Category options
const categories = [
  { value: "bills", label: "Bills" },
  { value: "chores", label: "Chores" },
  { value: "shopping", label: "Shopping" },
  { value: "maintenance", label: "Maintenance" },
  { value: "social", label: "Social" },
  { value: "personal", label: "Personal" }
];

export function RemindersPage() {
  // State
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [roommates, setRoommates] = useState<Roommate[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("dueDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [selectedTone, setSelectedTone] = useState("friendly");
  const [aiGeneratedReminder, setAiGeneratedReminder] = useState<Reminder | null>(null);
  const [showAIReminderModal, setShowAIReminderModal] = useState(false);
  const [showCustomReminderModal, setShowCustomReminderModal] = useState(false);
  const [newReminder, setNewReminder] = useState<Partial<Reminder>>({
    title: "",
    description: "",
    type: "custom",
    dueDate: new Date(Date.now() + 86400000),
    priority: "medium",
    status: "pending",
    category: "personal"
  });

  // Load data on mount
  useEffect(() => {
    setReminders(reminderService.getAll());
    setRoommates(roommateService.getAll());
  }, []);

  // Filter and sort reminders
  const filteredAndSortedChores = useMemo(() => {
    return reminders
      .filter((reminder) => {
        const matchesSearch = reminder.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            reminder.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || reminder.status === statusFilter;
        const matchesPriority = priorityFilter === "all" || reminder.priority === priorityFilter;
        const matchesCategory = categoryFilter === "all" || reminder.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "dueDate") {
          return sortOrder === "asc" 
            ? a.dueDate.getTime() - b.dueDate.getTime()
            : b.dueDate.getTime() - a.dueDate.getTime();
        }
        if (sortBy === "priority") {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return sortOrder === "asc"
            ? priorityOrder[a.priority] - priorityOrder[b.priority]
            : priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return 0;
      });
  }, [reminders, searchQuery, statusFilter, priorityFilter, categoryFilter, sortBy, sortOrder]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const total = reminders.length;
    const completed = reminders.filter(reminder => reminder.status === "completed").length;
    const overdue = reminders.filter(reminder => 
      reminder.status === "pending" && isPast(reminder.dueDate)
    ).length;
    const dueToday = reminders.filter(reminder => 
      reminder.status === "pending" && isToday(reminder.dueDate)
    ).length;

    return { total, completed, overdue, dueToday };
  }, [reminders]);

  // Handle reminder status change
  const handleStatusChange = (reminderId: string, newStatus: "pending" | "completed" | "overdue") => {
    reminderService.update(reminderId, { status: newStatus });
    setReminders(reminderService.getAll());
  };

  // Handle reminder deletion
  const handleDeleteReminder = (reminderId: string) => {
    reminderService.delete(reminderId);
    setReminders(reminderService.getAll());
    toast.success("Reminder deleted successfully");
  };

  // Handle AI reminder generation
  const handleGenerateAIReminder = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Please enter a prompt for the AI");
      return;
    }

    setIsGenerating(true);
    try {
      const generatedReminder = await generateAIReminder(aiPrompt, selectedTone);
      setAiGeneratedReminder(generatedReminder);
      toast.success("Reminder generated successfully");
    } catch (error) {
      toast.error("Failed to generate reminder");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle adding AI generated reminder
  const handleAddGeneratedReminder = () => {
    if (aiGeneratedReminder) {
      reminderService.add(aiGeneratedReminder);
      setReminders(reminderService.getAll());
      setAiGeneratedReminder(null);
      setAiPrompt("");
      setShowAIReminderModal(false);
      toast.success("Reminder added successfully");
    }
  };

  // Handle adding custom reminder
  const handleAddCustomReminder = () => {
    if (!newReminder.title || !newReminder.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const reminder: Reminder = {
      id: (reminders.length + 1).toString(),
      title: newReminder.title,
      description: newReminder.description,
      type: "custom",
      dueDate: newReminder.dueDate || new Date(Date.now() + 86400000),
      priority: newReminder.priority || "medium",
      status: "pending",
      category: newReminder.category || "personal",
      tone: newReminder.tone,
      customTone: newReminder.customTone
    };

    reminderService.add(reminder);
    setReminders(reminderService.getAll());
    setNewReminder({
      title: "",
      description: "",
      type: "custom",
      dueDate: new Date(Date.now() + 86400000),
      priority: "medium",
      status: "pending",
      category: "personal"
    });
    setShowCustomReminderModal(false);
    toast.success("Reminder added successfully");
  };

  // Mock function for generating reminders
  const generateAIReminder = async (prompt: string, tone: string): Promise<Reminder> => {
    return new Promise((resolve) => {
    setTimeout(() => {
        let priority: "high" | "medium" | "low" = "medium";
    if (prompt.toLowerCase().includes("urgent") || 
        prompt.toLowerCase().includes("asap") || 
        prompt.toLowerCase().includes("emergency")) {
      priority = "high";
    } else if (prompt.toLowerCase().includes("when you can") || 
               prompt.toLowerCase().includes("no rush")) {
      priority = "low";
    }
    
        let category = "personal";
    if (prompt.toLowerCase().includes("bill") || prompt.toLowerCase().includes("pay")) {
          category = "bills";
    } else if (prompt.toLowerCase().includes("clean") || prompt.toLowerCase().includes("do laundry")) {
          category = "chores";
    } else if (prompt.toLowerCase().includes("buy") || prompt.toLowerCase().includes("shop")) {
          category = "shopping";
        }

    let description = "";
    switch (tone) {
          case "sarcastic":
            description = `Oh great, another thing to do: ${prompt}. Just what I needed... 😏`;
            break;
      case "friendly":
            description = `Hey! Just a friendly reminder about: ${prompt}. Let me know if you need any help! 😊`;
        break;
          case "passive-aggressive":
            description = `I'm sure you'll get to this eventually... ${prompt}. No rush, really. 😬`;
        break;
          case "professional":
            description = `This is a formal notification regarding: ${prompt}. Please address this matter at your earliest convenience. 👔`;
        break;
          case "chill":
            description = `Hey there! Don't forget about: ${prompt}. No pressure, just a gentle nudge. 🧘`;
        break;
      default:
            description = prompt;
        }

        resolve({
          id: (reminders.length + 1).toString(),
          title: prompt.length > 30 ? prompt.substring(0, 30) + "..." : prompt,
      description,
          type: "custom",
          dueDate: new Date(Date.now() + 86400000),
      priority,
          status: "pending",
      category,
          tone,
          isAI: true
        });
      }, 1000);
    });
  };

  return (
    <div className="container mx-auto py-4 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Reminders</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Dialog open={showAIReminderModal} onOpenChange={setShowAIReminderModal}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto gap-2">
                <Sparkles className="h-4 w-4" />
                Generate AI Reminder
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Generate AI Reminder</DialogTitle>
                <DialogDescription>
                  Let AI help you create a reminder with the perfect tone.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="prompt" className="text-sm font-medium">
                    What's the reminder about?
                  </label>
                  <Textarea
                    id="prompt"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="E.g., Pay the electricity bill by Friday"
                    className="min-h-[100px]"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="tone" className="text-sm font-medium">
                    Select Tone
                  </label>
                  <Select value={selectedTone} onValueChange={setSelectedTone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sarcastic">Sarcastic 😏</SelectItem>
                      <SelectItem value="friendly">Friendly 😊</SelectItem>
                      <SelectItem value="passive-aggressive">Passive-aggressive 😬</SelectItem>
                      <SelectItem value="professional">Professional 👔</SelectItem>
                      <SelectItem value="chill">Chill 🧘</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {isGenerating && (
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating reminder...</span>
                  </div>
                )}
                {aiGeneratedReminder && (
                  <div className="border rounded-lg p-4 space-y-4">
                    <div>
                      <h4 className="font-medium">Generated Reminder</h4>
                      <p className="text-sm text-muted-foreground">{aiGeneratedReminder.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{aiGeneratedReminder.priority}</Badge>
                      <Badge variant="outline">{aiGeneratedReminder.category}</Badge>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setAiGeneratedReminder(null);
                    setAiPrompt("");
                    setShowAIReminderModal(false);
                  }}
                >
                  Cancel
                </Button>
                {aiGeneratedReminder ? (
                  <Button onClick={handleAddGeneratedReminder}>
                    <Save className="mr-2 h-4 w-4" />
                    Add Reminder
                  </Button>
                ) : (
                  <Button onClick={handleGenerateAIReminder} disabled={isGenerating}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={showCustomReminderModal} onOpenChange={setShowCustomReminderModal}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto gap-2">
                <Plus className="h-4 w-4" />
                Add Custom Reminder
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add Custom Reminder</DialogTitle>
                <DialogDescription>
                  Create a new reminder with custom details.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Title
                  </label>
                  <Input
                    id="title"
                    value={newReminder.title}
                    onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                    placeholder="Enter reminder title"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Content
                  </label>
                  <Textarea
                    id="description"
                    value={newReminder.description}
                    onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                    placeholder="Enter reminder content"
                    className="min-h-[100px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="priority" className="text-sm font-medium">
                      Priority
                    </label>
                    <Select
                      value={newReminder.priority}
                      onValueChange={(value) => setNewReminder({ ...newReminder, priority: value as "high" | "medium" | "low" })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="category" className="text-sm font-medium">
                      Category
                    </label>
                    <Select
                      value={newReminder.category}
                      onValueChange={(value) => setNewReminder({ ...newReminder, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="bills">Bills</SelectItem>
                        <SelectItem value="chores">Chores</SelectItem>
                        <SelectItem value="shopping">Shopping</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="dueDate" className="text-sm font-medium">
                    Due Date
                  </label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newReminder.dueDate ? format(newReminder.dueDate, "yyyy-MM-dd") : ""}
                    onChange={(e) => setNewReminder({ ...newReminder, dueDate: new Date(e.target.value) })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setNewReminder({
                      title: "",
                      description: "",
                      type: "custom",
                      dueDate: new Date(Date.now() + 86400000),
                      priority: "medium",
                      status: "pending",
                      category: "personal"
                    });
                    setShowCustomReminderModal(false);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddCustomReminder}>
                  <Save className="mr-2 h-4 w-4" />
                  Add Reminder
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total</CardTitle>
            <Bell className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{statistics.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{statistics.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{statistics.overdue}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Due Today</CardTitle>
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{statistics.dueToday}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reminders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="grid grid-cols-2 sm:flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="bills">Bills</SelectItem>
              <SelectItem value="chores">Chores</SelectItem>
              <SelectItem value="shopping">Shopping</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reminders List */}
      {filteredAndSortedChores.length > 0 ? (
        <div className="space-y-4">
          {filteredAndSortedChores.map((reminder) => (
            <Card key={reminder.id} className="overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <h3 className="font-medium">{reminder.title}</h3>
                    <p className="text-sm text-muted-foreground">{reminder.description}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(reminder.id, "completed")}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Mark as Completed
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(reminder.id, "pending")}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Mark as Pending
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDeleteReminder(reminder.id)}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge
                    variant={
                      reminder.priority === "high"
                        ? "destructive"
                        : reminder.priority === "medium"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {reminder.priority}
                  </Badge>
                  <Badge variant="outline">{reminder.category}</Badge>
                  <Badge
                    variant={
                      reminder.status === "completed"
                        ? "default"
                        : reminder.status === "overdue"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {reminder.status}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {format(reminder.dueDate, "MMM d, yyyy")}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Bell className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No reminders yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Get started by creating your first reminder
          </p>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Dialog open={showAIReminderModal} onOpenChange={setShowAIReminderModal}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto gap-2">
                  <Sparkles className="h-4 w-4" />
                  Generate AI Reminder
                </Button>
              </DialogTrigger>
            </Dialog>
            <Dialog open={showCustomReminderModal} onOpenChange={setShowCustomReminderModal}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto gap-2">
                  <Plus className="h-4 w-4" />
                  Add Custom Reminder
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </div>
      )}
    </div>
  );
}

export default RemindersPage;
