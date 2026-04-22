import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, 
  Paperclip, 
  MoreVertical, 
  Image as ImageIcon, 
  File, 
  X 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type ChatUser = {
  id: string;
  name: string;
  avatar: string;
  initials: string;
};

type ChatMessageType = "text" | "image" | "file";

type ChatMessage = {
  id: string;
  sender: ChatUser;
  content: string;
  timestamp: Date;
  type: ChatMessageType;
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
};

// Mock data for messages
const mockMessages: ChatMessage[] = [
  {
    id: "1",
    sender: {
      id: "1",
      name: "You",
      avatar: "",
      initials: "YO"
    },
    content: "Hey everyone! How's it going?",
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    type: "text"
  },
  {
    id: "2",
    sender: {
      id: "2",
      name: "Sam",
      avatar: "",
      initials: "SA"
    },
    content: "Good! Just finished my chores for the week.",
    timestamp: new Date(Date.now() - 3500000),
    type: "text"
  },
  {
    id: "3",
    sender: {
      id: "1",
      name: "You",
      avatar: "",
      initials: "YO"
    },
    content: "Great job! I still need to do mine.",
    timestamp: new Date(Date.now() - 3400000),
    type: "text"
  },
  {
    id: "4",
    sender: {
      id: "3",
      name: "Alex",
      avatar: "",
      initials: "AL"
    },
    content: "I've attached the receipt for the groceries we bought yesterday.",
    timestamp: new Date(Date.now() - 3300000),
    type: "text"
  },
  {
    id: "5",
    sender: {
      id: "3",
      name: "Alex",
      avatar: "",
      initials: "AL"
    },
    content: "grocery-receipt.pdf",
    timestamp: new Date(Date.now() - 3200000),
    type: "file",
    fileName: "grocery-receipt.pdf",
    fileSize: "245 KB",
    fileUrl: ""
  }
];

// Mock data for roommates
const mockRoommates = [
  { id: "1", name: "You", avatar: "", initials: "YO", online: true },
  { id: "2", name: "Sam", avatar: "", initials: "SA", online: true },
  { id: "3", name: "Alex", avatar: "", initials: "AL", online: false }
];

export const GroupChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Handle sending a new message
  const handleSendMessage = () => {
    if (newMessage.trim() === "" && attachments.length === 0) return;

    const newMessages = [...messages];
    
    // Add text message if there's text
    if (newMessage.trim() !== "") {
      newMessages.push({
        id: Date.now().toString(),
        sender: {
          id: "1",
          name: "You",
          avatar: "",
          initials: "YO"
        },
        content: newMessage,
        timestamp: new Date(),
        type: "text"
      });
    }

    // Add file attachments if any
    attachments.forEach((file, index) => {
      const fileType = file.type.startsWith("image/") ? "image" : "file";
      
      newMessages.push({
        id: `${Date.now()}-${index}`,
        sender: {
          id: "1",
          name: "You",
          avatar: "",
          initials: "YO"
        },
        content: file.name,
        timestamp: new Date(),
        type: fileType,
        fileName: file.name,
        fileSize: `${Math.round(file.size / 1024)} KB`,
        fileUrl: previewUrls[index]
      });
    });

    setMessages(newMessages);
    setNewMessage("");
    setAttachments([]);
    setPreviewUrls([]);
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setAttachments([...attachments, ...newFiles]);
      
      // Create preview URLs for images
      const newPreviewUrls = newFiles.map(file => {
        if (file.type.startsWith("image/")) {
          return URL.createObjectURL(file);
        }
        return "";
      });
      
      setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    }
  };

  // Remove an attachment
  const removeAttachment = (index: number) => {
    const newAttachments = [...attachments];
    const newPreviewUrls = [...previewUrls];
    
    // Revoke object URL if it's an image
    if (newPreviewUrls[index]) {
      URL.revokeObjectURL(newPreviewUrls[index]);
    }
    
    newAttachments.splice(index, 1);
    newPreviewUrls.splice(index, 1);
    
    setAttachments(newAttachments);
    setPreviewUrls(newPreviewUrls);
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return format(date, "h:mm a");
  };

  // Format date
  const formatDate = (date: Date) => {
    return format(date, "MMM d, yyyy");
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: { [key: string]: typeof messages } = {};
    
    messages.forEach(message => {
      const date = formatDate(message.timestamp);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate();

  return (
    <Card className="w-full h-[calc(100vh-12rem)] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <CardTitle>Household Chat</CardTitle>
          <div className="flex -space-x-2">
            {mockRoommates.map(roommate => (
              <Avatar 
                key={roommate.id} 
                className={cn(
                  "h-6 w-6 border-2 border-background",
                  roommate.online ? "ring-2 ring-green-500" : ""
                )}
              >
                <AvatarImage src={roommate.avatar} />
                <AvatarFallback className="text-xs">{roommate.initials}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="p-0 hover:bg-muted">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem>Clear Chat</DropdownMenuItem>
            <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
            <DropdownMenuItem>Leave Chat</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-1 p-0 flex flex-col">
        <ScrollArea className="flex-1 p-4">
          {Object.entries(messageGroups).map(([date, dateMessages]) => (
            <div key={date} className="mb-6">
              <div className="flex items-center justify-center my-4">
                <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                  {date}
                </div>
              </div>
              <div className="space-y-4">
                {dateMessages.map(message => (
                  <div 
                    key={message.id} 
                    className={cn(
                      "flex items-start gap-2 max-w-[80%]",
                      message.sender.id === "1" ? "ml-auto flex-row-reverse" : ""
                    )}
                  >
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarImage src={message.sender.avatar} />
                      <AvatarFallback>{message.sender.initials}</AvatarFallback>
                    </Avatar>
                    <div 
                      className={cn(
                        "rounded-lg p-3",
                        message.sender.id === "1" 
                          ? "bg-brand-purple text-primary-foreground" 
                          : "bg-muted"
                      )}
                    >
                      <div className="font-medium text-sm mb-1">
                        {message.sender.name}
                      </div>
                      {message.type === "text" && (
                        <p className="text-sm">{message.content}</p>
                      )}
                      {message.type === "file" && (
                        <div className="flex items-center gap-2 p-2 bg-background/20 rounded-md">
                          <File className="h-4 w-4" />
                          <div className="text-xs">
                            <div>{message.fileName}</div>
                            <div className="text-muted-foreground">{message.fileSize}</div>
                          </div>
                        </div>
                      )}
                      {message.type === "image" && (
                        <div className="mt-2">
                          <img 
                            src={message.fileUrl} 
                            alt={message.fileName} 
                            className="max-w-full rounded-md"
                          />
                        </div>
                      )}
                      <div className="text-xs mt-1 opacity-70">
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>
        
        {/* Attachments preview */}
        {attachments.length > 0 && (
          <div className="px-4 py-2 border-t border-border">
            <div className="flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <div 
                  key={index} 
                  className="relative group flex items-center gap-2 bg-muted p-2 rounded-md"
                >
                  {file.type.startsWith("image/") ? (
                    <ImageIcon className="h-4 w-4" />
                  ) : (
                    <File className="h-4 w-4" />
                  )}
                  <span className="text-xs truncate max-w-[150px]">{file.name}</span>
                  <button 
                    onClick={() => removeAttachment(index)}
                    className="absolute top-0 right-0 p-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Message input */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => fileInputRef.current?.click()}
              className="shrink-0"
            >
              <Paperclip className="h-4 w-4" />
              <span className="sr-only">Attach file</span>
            </Button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              className="hidden" 
              multiple 
            />
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage} 
              size="icon" 
              className="shrink-0"
              disabled={newMessage.trim() === "" && attachments.length === 0}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 
