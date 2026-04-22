import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format, isToday, isPast, addDays } from "date-fns";
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
  DropdownMenuLabel,
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
  RotateCcw,
  Trash2,
  Edit2,
  BarChart2,
  ClipboardList
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useDashboard } from "@/context/DashboardContext";

// Types
interface Chore {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: 'pending' | 'completed';
  frequency: 'daily' | 'weekly' | 'monthly';
}

const ChoresPage = () => {
  const navigate = useNavigate();
  const { chores, updateChore, deleteChore: deleteChoreFromContext, addChore } = useDashboard();
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterFrequency, setFilterFrequency] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [editingChore, setEditingChore] = useState<Chore | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [choreToDelete, setChoreToDelete] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newChore, setNewChore] = useState<Omit<Chore, 'id'>>({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    status: 'pending',
    frequency: 'daily'
  });

  const getChoreStatusClass = (dueDate: string, status: 'pending' | 'completed') => {
    if (status === 'completed') return "text-green-600";
    const date = new Date(dueDate);
    if (isPast(date) && !isToday(date)) return "text-destructive";
    if (isToday(date)) return "text-amber-500";
    return "text-muted-foreground";
  };

  const toggleComplete = (id: string) => {
    const chore = chores.find(c => c.id === id);
    if (chore) {
      updateChore(id, { 
        status: chore.status === 'completed' ? 'pending' : 'completed'
      });
      toast.success("Chore status updated");
    }
  };

  const deleteChore = (id: string) => {
    deleteChoreFromContext(id);
    setShowDeleteDialog(false);
    setChoreToDelete(null);
    toast.success("Chore deleted");
  };

  const editChore = (id: string, updatedChore: Partial<Chore>) => {
    updateChore(id, updatedChore);
    setEditingChore(null);
    toast.success("Chore updated");
  };

  const handleAddChore = () => {
    if (!newChore.title.trim()) {
      toast.error("Please enter a title for the chore");
      return;
    }
    
    addChore(newChore);
    setShowAddDialog(false);
    setNewChore({
      title: '',
      description: '',
      assignedTo: '',
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      status: 'pending',
      frequency: 'daily'
    });
    toast.success("Chore added successfully");
  };

  const handleEditChore = (id: string) => {
    const chore = chores.find(c => c.id === id);
    if (chore) {
      setEditingChore(chore);
    }
  };

  const handleSaveEdit = () => {
    if (editingChore) {
      editChore(editingChore.id, {
        title: editingChore.title,
        description: editingChore.description,
        assignedTo: editingChore.assignedTo,
        dueDate: editingChore.dueDate,
        frequency: editingChore.frequency
      });
      setEditingChore(null);
    }
  };

  const filteredAndSortedChores = useMemo(() => {
    let filtered = [...chores];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(chore => 
        chore.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chore.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus === "pending") {
      filtered = filtered.filter(chore => chore.status === 'pending');
    } else if (filterStatus === "completed") {
      filtered = filtered.filter(chore => chore.status === 'completed');
    }

    // Apply frequency filter
    if (filterFrequency !== "all") {
      filtered = filtered.filter(chore => chore.frequency === filterFrequency);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === "dueDate") {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return filtered;
  }, [chores, searchQuery, filterStatus, filterFrequency, sortBy]);

  const statistics = useMemo(() => {
    const total = chores.length;
    const completed = chores.filter(chore => chore.status === 'completed').length;
    const overdue = chores.filter(
      chore => chore.status === 'pending' && isPast(new Date(chore.dueDate)) && !isToday(new Date(chore.dueDate))
    ).length;
    const dueToday = chores.filter(
      chore => chore.status === 'pending' && isToday(new Date(chore.dueDate))
    ).length;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    return {
      total,
      completed,
      overdue,
      dueToday,
      completionRate,
    };
  }, [chores]);

  return (
    <div className="container mx-auto p-3 sm:p-4 space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Chores</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage and track household tasks</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button 
              className="w-full sm:w-auto bg-brand-purple hover:bg-brand-purple-dark"
              onClick={() => setShowAddDialog(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Chore
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Chore</DialogTitle>
              <DialogDescription>
                Create a new chore for your household.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Title
                </label>
                <Input
                  id="title"
                  value={newChore.title}
                  onChange={(e) => setNewChore({ ...newChore, title: e.target.value })}
                  placeholder="Enter chore title"
                  className="h-10 sm:h-11"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Input
                  id="description"
                  value={newChore.description}
                  onChange={(e) => setNewChore({ ...newChore, description: e.target.value })}
                  placeholder="Enter chore description"
                  className="h-10 sm:h-11"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="assignedTo" className="text-sm font-medium">
                  Assigned To
                </label>
                <Input
                  id="assignedTo"
                  value={newChore.assignedTo}
                  onChange={(e) => setNewChore({ ...newChore, assignedTo: e.target.value })}
                  placeholder="Enter assignee name"
                  className="h-10 sm:h-11"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="dueDate" className="text-sm font-medium">
                  Due Date
                </label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newChore.dueDate}
                  onChange={(e) => setNewChore({ ...newChore, dueDate: e.target.value })}
                  className="h-10 sm:h-11"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="frequency" className="text-sm font-medium">
                  Frequency
                </label>
                <Select
                  value={newChore.frequency}
                  onValueChange={(value: 'daily' | 'weekly' | 'monthly') => 
                    setNewChore({ ...newChore, frequency: value })
                  }
                >
                  <SelectTrigger className="h-10 sm:h-11">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setShowAddDialog(false)} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button onClick={handleAddChore} disabled={!newChore.title.trim()} className="w-full sm:w-auto">
                Add Chore
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="col-span-1">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Total</p>
                <p className="text-xl sm:text-2xl font-bold">{statistics.total}</p>
              </div>
              <div className="p-2 bg-muted rounded-full">
                <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Completed</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">{statistics.completed}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Overdue</p>
                <p className="text-xl sm:text-2xl font-bold text-destructive">{statistics.overdue}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-full">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Due Today</p>
                <p className="text-xl sm:text-2xl font-bold text-amber-500">{statistics.dueToday}</p>
              </div>
              <div className="p-2 bg-amber-100 rounded-full">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search chores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 sm:h-11"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterFrequency} onValueChange={setFilterFrequency}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Frequency</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Chores List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filteredAndSortedChores.map((chore) => (
              <div
                key={chore.id}
                className="p-3 sm:p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 sm:gap-4">
                  <div className="flex items-start gap-2 sm:gap-3 flex-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`rounded-full h-7 w-7 sm:h-8 sm:w-8 ${
                        chore.status === 'completed' ? "text-green-600" : ""
                      }`}
                      onClick={() => toggleComplete(chore.id)}
                    >
                      <CheckCircle2
                        className={`h-4 w-4 sm:h-5 sm:w-5 ${
                          chore.status === 'pending' && "text-muted-foreground/40"
                        }`}
                      />
                    </Button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm sm:text-base truncate">{chore.title}</h3>
                        <Badge variant="outline" className="text-xs shrink-0">
                          {chore.frequency}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                        {chore.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant="outline"
                          className={`text-xs ${getChoreStatusClass(
                            chore.dueDate,
                            chore.status
                          )}`}
                        >
                          <Calendar className="mr-1 h-3 w-3 inline" />
                          {chore.status === 'pending'
                            ? format(new Date(chore.dueDate), "MMM d")
                            : "Completed"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 sm:h-9 sm:w-9"
                      onClick={() => handleEditChore(chore.id)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 sm:h-9 sm:w-9 text-destructive"
                      onClick={() => {
                        setChoreToDelete(chore.id);
                        setShowDeleteDialog(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingChore} onOpenChange={() => setEditingChore(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Chore</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={editingChore?.title || ''}
                onChange={(e) => setEditingChore(prev => prev ? { ...prev, title: e.target.value } : null)}
                className="h-10 sm:h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                value={editingChore?.description || ''}
                onChange={(e) => setEditingChore(prev => prev ? { ...prev, description: e.target.value } : null)}
                className="h-10 sm:h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Assigned To</label>
              <Input
                value={editingChore?.assignedTo || ''}
                onChange={(e) => setEditingChore(prev => prev ? { ...prev, assignedTo: e.target.value } : null)}
                className="h-10 sm:h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Frequency</label>
              <Select
                value={editingChore?.frequency || 'daily'}
                onValueChange={(value: 'daily' | 'weekly' | 'monthly') => 
                  setEditingChore(prev => prev ? { ...prev, frequency: value } : null)
                }
              >
                <SelectTrigger className="h-10 sm:h-11">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Due Date</label>
              <Input
                type="date"
                value={editingChore?.dueDate || format(new Date(), 'yyyy-MM-dd')}
                onChange={(e) => setEditingChore(prev => prev ? { ...prev, dueDate: e.target.value } : null)}
                className="h-10 sm:h-11"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setEditingChore(null)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} className="w-full sm:w-auto">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Chore</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this chore? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => choreToDelete && deleteChore(choreToDelete)}
              className="w-full sm:w-auto"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChoresPage;
