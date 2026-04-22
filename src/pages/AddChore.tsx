import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { CalendarIcon, Plus, Save, ArrowLeft } from "lucide-react";

// Mock roommates data
const mockRoommates = [
  { id: "1", name: "You", initials: "YO" },
  { id: "2", name: "Sam", initials: "SA" },
  { id: "3", name: "Alex", initials: "AL" },
  { id: "4", name: "Jordan", initials: "JO" },
];

// Mock chore templates
const choreTemplates = [
  { id: "1", name: "Take out trash", description: "Empty all trash bins and take to the dumpster", frequency: "Daily" },
  { id: "2", name: "Clean bathroom", description: "Clean shower, toilet, sink, and mop floor", frequency: "Weekly" },
  { id: "3", name: "Vacuum living room", description: "Vacuum carpet and dust furniture", frequency: "Weekly" },
  { id: "4", name: "Wash dishes", description: "Wash and put away all dishes in the sink", frequency: "Daily" },
  { id: "5", name: "Water plants", description: "Water all indoor plants", frequency: "Weekly" },
];

export const AddChorePage = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(new Date());
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [assignedTo, setAssignedTo] = useState<string>("");
  const [frequency, setFrequency] = useState<string>("");
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [customChore, setCustomChore] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save the chore to your backend
    console.log("Chore added:", {
      name: selectedTemplate ? choreTemplates.find(t => t.id === selectedTemplate)?.name : customChore.name,
      description: selectedTemplate ? choreTemplates.find(t => t.id === selectedTemplate)?.description : customChore.description,
      assignedTo,
      dueDate: date,
      frequency: selectedTemplate ? choreTemplates.find(t => t.id === selectedTemplate)?.frequency : frequency,
      isRecurring,
    });
    // Navigate back to chores page
    navigate("/chores");
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = choreTemplates.find(t => t.id === templateId);
    if (template) {
      setCustomChore({
        name: template.name,
        description: template.description,
      });
      setFrequency(template.frequency);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/chores")}
            className="hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Add Chore</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Chore Details</CardTitle>
            <CardDescription>
              Create a new chore or use a template
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template">Use Template (Optional)</Label>
                <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {choreTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name} ({template.frequency})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Chore Name</Label>
                <Input
                  id="name"
                  value={customChore.name}
                  onChange={(e) => setCustomChore({ ...customChore, name: e.target.value })}
                  placeholder="e.g., Clean kitchen"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={customChore.description}
                  onChange={(e) => setCustomChore({ ...customChore, description: e.target.value })}
                  placeholder="Describe what needs to be done"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assign To</Label>
                <Select value={assignedTo} onValueChange={setAssignedTo} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select roommate" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockRoommates.map((roommate) => (
                      <SelectItem key={roommate.id} value={roommate.id}>
                        {roommate.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={frequency} onValueChange={setFrequency} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Once">One-time</SelectItem>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="recurring"
                  checked={isRecurring}
                  onCheckedChange={(checked) => setIsRecurring(checked as boolean)}
                />
                <Label htmlFor="recurring" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Make this a recurring chore
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate("/chores")}>
            Cancel
          </Button>
          <Button type="submit" className="bg-brand-purple hover:bg-brand-purple-dark">
            <Save className="mr-2 h-4 w-4" />
            Save Chore
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddChorePage; 