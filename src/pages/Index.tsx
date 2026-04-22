import React from "react";
import { Link } from "react-router-dom";
import { useDashboard } from "@/context/DashboardContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Home,
  DollarSign,
  CheckSquare,
  Bell,
  Calendar,
  MessageSquare,
  Settings,
  Plus,
  ArrowRight
} from "lucide-react";

export const IndexPage = () => {
  const { expenses, chores, reminders, loading, error } = useDashboard();

  // Calculate quick stats from real data
  const quickStats = [
    {
      title: "Pending Expenses",
      value: `₹${expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}`,
      change: "+12%", // TODO: Calculate real change
      trend: "up",
      link: "/expenses"
    },
    {
      title: "Active Chores",
      value: chores.filter(chore => chore.status === 'pending').length.toString(),
      change: "-2", // TODO: Calculate real change
      trend: "down",
      link: "/chores"
    },
    {
      title: "Reminders",
      value: reminders.filter(reminder => !reminder.completed).length.toString(),
      change: "+3", // TODO: Calculate real change
      trend: "up",
      link: "/reminders"
    },
    {
      title: "Messages",
      value: "12", // TODO: Implement chat functionality
      change: "+5",
      trend: "up",
      link: "/chat"
    }
  ];

  // Get upcoming events from chores and reminders
  const upcomingEvents = [
    ...chores
      .filter(chore => chore.status === 'pending')
      .map(chore => ({
        id: chore.id,
        title: chore.title,
        date: chore.dueDate,
        type: "chore"
      })),
    ...reminders
      .filter(reminder => !reminder.completed)
      .map(reminder => ({
        id: reminder.id,
        title: reminder.title,
        date: reminder.date,
        type: "reminder"
      }))
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
   .slice(0, 3); // Show only the next 3 events

  // Get recent activity from all sources
  const recentActivity = [
    ...expenses.map(expense => ({
      id: expense.id,
      user: expense.paidBy,
      userInitials: expense.paidByInitials,
      action: "paid",
      item: expense.description,
      time: expense.date
    })),
    ...chores.map(chore => ({
      id: chore.id,
      user: chore.assignedTo,
      userInitials: chore.assignedTo.slice(0, 2).toUpperCase(),
      action: chore.status === 'completed' ? "completed" : "assigned",
      item: chore.title,
      time: chore.dueDate
    }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
   .slice(0, 3); // Show only the 3 most recent activities

  // Quick actions remain the same
  const quickActions = [
    {
      title: "Add Expense",
      icon: <DollarSign className="h-4 w-4" />,
      link: "/expenses/add",
      color: "bg-green-500"
    },
    {
      title: "Add Chore",
      icon: <CheckSquare className="h-4 w-4" />,
      link: "/chores/add",
      color: "bg-blue-500"
    },
    {
      title: "Set Reminder",
      icon: <Bell className="h-4 w-4" />,
      link: "/reminders",
      color: "bg-purple-500"
    },
    {
      title: "Send Message",
      icon: <MessageSquare className="h-4 w-4" />,
      link: "/chat",
      color: "bg-orange-500"
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6 pb-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/3 bg-muted rounded"></div>
          <div className="h-4 w-1/2 bg-muted rounded"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 w-1/2 bg-muted rounded mb-2"></div>
                <div className="h-8 w-1/3 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 pb-8">
        <div className="text-red-500">Error loading dashboard data: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back!</h1>
        <p className="text-muted-foreground">
          Here's what's happening in your household today.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Link key={index} to={stat.link}>
            <Card className="hover:bg-accent/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium">{stat.title}</p>
                  <Badge variant={stat.trend === "up" ? "default" : "secondary"}>
                    {stat.change}
                  </Badge>
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Link key={index} to={action.link}>
            <Card className="hover:bg-accent/50 transition-colors">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
                <div className={`p-2 rounded-full ${action.color}`}>
                  {action.icon}
                </div>
                <p className="text-sm font-medium">{action.title}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Upcoming Events</CardTitle>
            <Button variant="ghost" size="icon">
              <Calendar className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {event.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {event.date}
                      </p>
                    </div>
                    <Badge variant="outline">{event.type}</Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No upcoming events
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
            <Button variant="ghost" size="icon">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>{activity.userInitials}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {activity.user} {activity.action} {activity.item}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent activity
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IndexPage;
