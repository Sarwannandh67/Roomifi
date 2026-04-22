import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AreaChart, 
  CheckIcon, 
  ClipboardCheck, 
  CreditCard, 
  MoreVertical, 
  PlusCircle, 
  UserCircle, 
  UserPlus 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

// Mock roommate data
const mockRoommates = [
  {
    id: "1",
    name: "You",
    initials: "YO",
    email: "you@example.com",
    balance: 1067,
    isPositive: true,
    choresCompleted: 24,
    choresTotal: 30,
    choresOnTime: 0.85,
    isCurrentUser: true,
  },
  {
    id: "2",
    name: "Sam",
    initials: "SA",
    email: "sam@example.com",
    balance: -600,
    isPositive: false,
    choresCompleted: 18,
    choresTotal: 30,
    choresOnTime: 0.70,
    isCurrentUser: false,
  },
  {
    id: "3",
    name: "Alex",
    initials: "AL",
    email: "alex@example.com",
    balance: -467,
    isPositive: false,
    choresCompleted: 27,
    choresTotal: 30,
    choresOnTime: 0.95,
    isCurrentUser: false,
  },
  {
    id: "4",
    name: "Jordan",
    initials: "JO",
    email: "jordan@example.com",
    balance: 0,
    isPositive: true,
    choresCompleted: 22,
    choresTotal: 30,
    choresOnTime: 0.80,
    isCurrentUser: false,
  },
];

export const RoommatesPage = () => {
  return (
    <div>
      <h1>Roommates</h1>
    </div>
  );
};
