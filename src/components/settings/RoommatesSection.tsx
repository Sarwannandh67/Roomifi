import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  UserPlus, 
  MoreVertical,
  Home,
  X,
  Mail
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { toast } from "sonner";

// Mock roommates data
const mockRoommates = [
  {
    id: "1",
    name: "Rahul Agarwal",
    email: "rahul@example.com",
    initials: "RA",
    role: "Admin",
    avatar: ""
  },
  {
    id: "2",
    name: "Priya Reddy",
    email: "priya@example.com",
    initials: "PR",
    role: "Member",
    avatar: ""
  },
  {
    id: "3",
    name: "Sanjay Kumar",
    email: "sanjay@example.com",
    initials: "SK",
    role: "Member",
    avatar: ""
  }
];

export const RoommatesSection = () => {
  // Household settings
  const [householdName, setHouseholdName] = useState("Sunshine Apartments #304");
  const [householdAddress, setHouseholdAddress] = useState("304 Sunshine Apartments, Koramangala, Bangalore");
  
  // Invite dialog state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Member");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  
  // Handle invite roommate
  const handleInviteRoommate = () => {
    setIsInviteDialogOpen(true);
  };
  
  // Handle send invite
  const handleSendInvite = () => {
    if (!inviteEmail) {
      toast.error("Please enter an email address");
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    // Check if email already exists in roommates
    const emailExists = mockRoommates.some(roommate => roommate.email === inviteEmail);
    if (emailExists) {
      toast.error("This email is already a member of your household");
      return;
    }
    
    setIsInviting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsInviting(false);
      setIsInviteDialogOpen(false);
      setInviteEmail("");
      toast.success(`Invitation sent to ${inviteEmail}`);
    }, 1500);
  };
  
  // Handle transfer ownership
  const handleTransferOwnership = () => {
    // In a real app, this would open a transfer dialog
    console.log("Transfer ownership");
  };
  
  // Handle leave household
  const handleLeaveHousehold = () => {
    if (window.confirm("Are you sure you want to leave this household? You will lose access to all household data.")) {
      // In a real app, this would remove the user from the household
      console.log("Left household");
    }
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2">
          <div>
            <CardTitle className="text-base sm:text-lg">Household Members</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Manage your roommates and household access
            </CardDescription>
          </div>
          <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                className="h-7 sm:h-9 bg-brand-purple hover:bg-brand-purple-dark w-full sm:w-auto"
                onClick={handleInviteRoommate}
              >
                <UserPlus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="text-xs sm:text-sm">Invite</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-base sm:text-lg">Invite Roommate</DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">
                  Send an invitation to join your household
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="invite-email" className="text-xs sm:text-sm">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="invite-email"
                      placeholder="roommate@example.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="h-8 sm:h-9 pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invite-role" className="text-xs sm:text-sm">Role</Label>
                  <select
                    id="invite-role"
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full h-8 sm:h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="Member">Member</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 sm:h-9"
                  onClick={() => setIsInviteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  className="h-7 sm:h-9 bg-brand-purple hover:bg-brand-purple-dark"
                  onClick={handleSendInvite}
                  disabled={isInviting}
                >
                  {isInviting ? "Sending..." : "Send Invitation"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRoommates.map((roommate, index) => (
              <div 
                key={roommate.id} 
                className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${index < mockRoommates.length - 1 ? 'border-b pb-4' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                    {roommate.avatar ? (
                      <AvatarImage src={roommate.avatar} alt={roommate.name} />
                    ) : (
                      <AvatarFallback className={`${
                        roommate.role === 'Admin' 
                          ? 'bg-brand-purple-light text-brand-purple-dark' 
                          : roommate.initials === 'PR' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-blue-100 text-blue-700'
                      }`}>
                        {roommate.initials}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{roommate.name}</p>
                    <p className="text-xs text-muted-foreground">{roommate.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-12 sm:ml-0">
                  <Badge variant={roommate.role === 'Admin' ? 'default' : 'outline'} className="text-xs">
                    {roommate.role}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 p-0 hover:bg-muted"
                      >
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuItem className="text-sm">
                        <span>Change Role</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-sm text-destructive">
                        <span>Remove</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base sm:text-lg">Household Settings</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Manage your household information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="household-name" className="text-xs sm:text-sm">Household Name</Label>
            <Input 
              id="household-name" 
              value={householdName} 
              onChange={(e) => setHouseholdName(e.target.value)}
              className="h-8 sm:h-9"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="household-address" className="text-xs sm:text-sm">Address</Label>
            <Input 
              id="household-address" 
              value={householdAddress} 
              onChange={(e) => setHouseholdAddress(e.target.value)}
              className="h-8 sm:h-9"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-4">
            <div>
              <h3 className="text-sm font-medium">Transfer Ownership</h3>
              <p className="text-xs text-muted-foreground">
                Transfer the household to another member
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 sm:h-9 w-full sm:w-auto"
              onClick={handleTransferOwnership}
            >
              Transfer
            </Button>
          </div>
          
          <Separator />
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="text-sm font-medium text-destructive">Leave Household</h3>
              <p className="text-xs text-muted-foreground">
                You will lose access to all household data
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 sm:h-9 w-full sm:w-auto text-destructive"
              onClick={handleLeaveHousehold}
            >
              Leave
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 