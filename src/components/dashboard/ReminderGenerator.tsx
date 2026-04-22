import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

// Mocked AI response generator - in a real app, this would call an API
const mockGenerateAIReminder = (type: string, tone: string, roommate: string): string => {
  const reminders = {
    chore: {
      funny: `Hey ${roommate}, if your dirty dishes were a band, they'd be called "The Mold Growth Experience" 😂 Time to give them their final curtain call!`,
      kind: `Hi ${roommate}! Just a gentle reminder that the dishes need some attention when you get a chance. Thanks for helping keep our space clean! 💫`,
      passive: `Oh, those dishes in the sink? They've been asking for you, ${roommate}. Something about "it's been 3 days now..." 🙃`,
      formal: `Dear ${roommate}, this is a notification that household maintenance, specifically dishwashing, requires your immediate attention as per our agreed rotation. Regards.`,
    },
    expense: {
      funny: `${roommate}, your share of the WiFi bill is like your dating life - pending and needs attention ASAP! 😜`,
      kind: `Hi ${roommate}! When you have a moment, would you mind settling up for the internet bill? No rush, just a friendly reminder! 💚`,
      passive: `Just wondering if you remembered we all need to pay for the internet we're using, ${roommate}? The bill's been sitting there for a week... 🙄`,
      formal: `Dear ${roommate}, this is to inform you that your portion of the internet utility expense (₹450) is currently outstanding and requires settlement.`,
    },
  };

  return reminders[type as keyof typeof reminders][tone as keyof typeof reminders.chore] || 
    "Hey, remember to take care of your responsibilities!";
};

const toneOptions = [
  { value: "funny", label: "Funny" },
  { value: "kind", label: "Kind" },
  { value: "passive", label: "Passive-Aggressive" },
  { value: "formal", label: "Formal" },
];

const reminderTypes = [
  { value: "chore", label: "Chore Reminder" },
  { value: "expense", label: "Expense Reminder" },
];

const roommates = [
  { value: "alex", label: "Alex" },
  { value: "sam", label: "Sam" },
  { value: "jordan", label: "Jordan" },
];

export const ReminderGenerator = () => {
  const [tone, setTone] = useState<string>("kind");
  const [reminderType, setReminderType] = useState<string>("chore");
  const [selectedRoommate, setSelectedRoommate] = useState<string>("alex");
  const [generatedText, setGeneratedText] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate API delay
    setTimeout(() => {
      const text = mockGenerateAIReminder(
        reminderType,
        tone,
        roommates.find((r) => r.value === selectedRoommate)?.label || ""
      );
      setGeneratedText(text);
      setIsGenerating(false);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base sm:text-lg font-medium">AI Reminder Generator</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Generate friendly reminders for chores and expenses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1 sm:space-y-2">
              <label htmlFor="type" className="text-xs sm:text-sm font-medium">
                Reminder Type
              </label>
              <Select value={reminderType} onValueChange={setReminderType}>
                <SelectTrigger id="type" className="h-8 sm:h-9">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {reminderTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <label htmlFor="tone" className="text-xs sm:text-sm font-medium">
                Tone
              </label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger id="tone" className="h-8 sm:h-9">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  {toneOptions.map((tone) => (
                    <SelectItem key={tone.value} value={tone.value}>
                      {tone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <label htmlFor="roommate" className="text-xs sm:text-sm font-medium">
                Roommate
              </label>
              <Select value={selectedRoommate} onValueChange={setSelectedRoommate}>
                <SelectTrigger id="roommate" className="h-8 sm:h-9">
                  <SelectValue placeholder="Select roommate" />
                </SelectTrigger>
                <SelectContent>
                  {roommates.map((roommate) => (
                    <SelectItem key={roommate.value} value={roommate.value}>
                      {roommate.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            className="w-full h-8 sm:h-9 bg-brand-purple hover:bg-brand-purple-dark text-xs sm:text-sm"
            disabled={isGenerating}
          >
            <Sparkles className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            {isGenerating ? "Generating..." : "Generate Reminder"}
          </Button>
        </div>

        {generatedText && (
          <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-brand-purple-light rounded-lg">
            <p className="text-xs sm:text-sm text-brand-purple-dark">{generatedText}</p>
          </div>
        )}
      </CardContent>
      {generatedText && (
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" className="h-8 sm:h-9 text-xs sm:text-sm">Edit</Button>
          <Button className="h-8 sm:h-9 bg-brand-purple hover:bg-brand-purple-dark text-xs sm:text-sm">
            Send
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ReminderGenerator;
