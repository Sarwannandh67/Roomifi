import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Paperclip, Mic, Settings, ChevronLeft, Bot, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  id: string;
  sender: string;
  senderId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type: 'text' | 'image' | 'file' | 'ai';
  tone?: 'sarcastic' | 'friendly' | 'urgent';
}

interface GroupChat {
  id: string;
  name: string;
  avatar?: string;
  pinnedMessage?: string;
  members: string[];
}

const mockGroups: GroupChat[] = [
  {
    id: '1',
    name: 'Apartment 101',
    avatar: 'A1',
    pinnedMessage: 'Remember to stay respectful 🧘',
    members: ['Alice', 'Bob', 'Charlie']
  }
];

const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'AI Assistant',
    senderId: 'ai',
    content: 'Just a friendly reminder: Rent is due tomorrow! 💰',
    timestamp: '10:30 AM',
    isRead: true,
    type: 'ai',
    tone: 'friendly'
  },
  {
    id: '2',
    sender: 'Alice',
    senderId: '1',
    content: 'Thanks for the reminder! I\'ll transfer my share today.',
    timestamp: '10:32 AM',
    isRead: true,
    type: 'text'
  },
  {
    id: '3',
    sender: 'AI Assistant',
    senderId: 'ai',
    content: 'Oh great, another "I\'ll do it today" promise... 😏',
    timestamp: '10:33 AM',
    isRead: true,
    type: 'ai',
    tone: 'sarcastic'
  }
];

export const ChatPage = () => {
  const [activeGroup, setActiveGroup] = useState<GroupChat | null>(mockGroups[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: 'You',
        senderId: 'current-user',
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false,
        type: 'text'
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setActiveGroup(null)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="font-medium text-lg">{activeGroup?.name}</h2>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Chat Settings</DropdownMenuItem>
            <DropdownMenuItem>Notification Preferences</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Pinned Message */}
      {activeGroup?.pinnedMessage && (
        <div className="p-3 bg-muted/50 border-b">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Bell className="h-4 w-4" />
            <p>{activeGroup.pinnedMessage}</p>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.sender === 'You' ? "justify-end" : "justify-start"
              )}
            >
              {message.sender !== 'You' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {message.type === 'ai' ? <Bot className="h-4 w-4" /> : message.sender.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "max-w-[85%] rounded-lg p-3",
                  message.sender === 'You'
                    ? "bg-primary text-primary-foreground"
                    : message.type === 'ai'
                    ? "bg-secondary"
                    : "bg-muted"
                )}
              >
                {message.sender !== 'You' && (
                  <p className="text-xs font-medium mb-1">{message.sender}</p>
                )}
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp}
                </p>
                {message.type === 'ai' && message.tone && (
                  <Badge variant="outline" className="mt-2 text-xs">
                    {message.tone}
                  </Badge>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Generate Reminder Button */}
      <div className="px-4 py-2 border-t">
        <Button variant="outline" className="w-full">
          Generate AI Reminder
        </Button>
      </div>

      {/* Message Input Area */}
      <div className="p-4 border-t bg-background">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="h-10"
          />
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Mic className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="h-10 w-10"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage; 