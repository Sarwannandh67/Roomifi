import React from "react";
import { format, isToday, isPast } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Chore {
  id: string;
  name: string;
  assignedTo: string;
  dueDate: Date;
  completed: boolean;
}

interface UpcomingChoresProps {
  chores: Chore[];
}

export const UpcomingChores: React.FC<UpcomingChoresProps> = ({ chores }) => {
  const getChoreStatusClass = (dueDate: Date) => {
    if (isPast(dueDate) && !isToday(dueDate)) return "chore-overdue";
    if (isToday(dueDate)) return "chore-today";
    return "chore-upcoming";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base sm:text-lg font-medium">Upcoming Chores</CardTitle>
        <Link to="/chores">
          <Button variant="ghost" size="sm" className="h-7 sm:h-8 text-brand-purple">
            <span className="text-xs sm:text-sm mr-1">View All</span>
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {chores.length > 0 ? (
          <div className="space-y-2 sm:space-y-3">
            {chores.slice(0, 3).map((chore) => (
              <div
                key={chore.id}
                className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-0 border-b border-border pb-2 sm:pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <div className="text-sm sm:text-base font-medium">{chore.name}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Assigned to {chore.assignedTo}
                  </div>
                </div>
                <div className={`text-xs sm:text-sm ${getChoreStatusClass(chore.dueDate)}`}>
                  <div className="flex items-center">
                    <CalendarClock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span>
                      {isToday(chore.dueDate)
                        ? "Today"
                        : format(chore.dueDate, "MMM d")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 sm:py-6 text-center">
            <CalendarClock className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground mb-2" />
            <p className="text-sm sm:text-base text-muted-foreground">No upcoming chores</p>
            <Link to="/chores/add">
              <Button className="mt-2 sm:mt-3 bg-brand-purple hover:bg-brand-purple-dark text-xs sm:text-sm">
                Add Chore
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingChores;
