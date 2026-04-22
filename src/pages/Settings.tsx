import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  User,
  ChevronRight,
  Crown,
  Users,
  Clock,
  Globe,
  DollarSign,
  MessageSquare,
  Lightbulb,
  Lock,
  LogOut,
  UserX,
  Plus,
  Mail,
  Phone,
  Trash2,
  Edit2,
  BedDouble,
  Calendar,
  Shield,
  Star,
  Settings2,
  Bell,
  CreditCard,
  Home,
  Building2,
  MapPin
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Roommate {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'member';
  avatar?: string;
  room?: string;
  rentShare?: number;
  preferences?: {
    quietHours?: string;
    guests?: boolean;
    pets?: boolean;
    smoking?: boolean;
  };
  paymentStatus?: 'paid' | 'pending' | 'overdue';
  lastPaymentDate?: string;
  nextPaymentDate?: string;
}

interface Room {
  id: string;
  name: string;
  capacity: number;
  currentOccupants: number;
  rent: number;
  amenities: string[];
}

export const SettingsPage = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [roommates, setRoommates] = useState<Roommate[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 234 567 8900',
      role: 'admin',
      avatar: 'JD'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 234 567 8901',
      role: 'member',
      avatar: 'JS'
    }
  ]);
  const [showAddRoommateDialog, setShowAddRoommateDialog] = useState(false);
  const [newRoommate, setNewRoommate] = useState<Omit<Roommate, 'id'>>({
    name: '',
    email: '',
    phone: '',
    role: 'member'
  });
  const [editingRoommate, setEditingRoommate] = useState<Roommate | null>(null);
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: '1',
      name: 'Master Bedroom',
      capacity: 1,
      currentOccupants: 1,
      rent: 1200,
      amenities: ['Private Bathroom', 'Walk-in Closet']
    },
    {
      id: '2',
      name: 'Room 2',
      capacity: 1,
      currentOccupants: 1,
      rent: 900,
      amenities: ['Shared Bathroom']
    },
    {
      id: '3',
      name: 'Room 3',
      capacity: 1,
      currentOccupants: 0,
      rent: 800,
      amenities: ['Shared Bathroom']
    }
  ]);
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = async () => {
    try {
      console.log('Logging out user');
      // Show a loading toast while logging out
      const loadingToast = toast.loading('Logging out...');
      
      try {
        // Call the signOut function from AuthContext
        const success = await signOut();
        
        if (success) {
          // Dismiss the loading toast and show success
          toast.dismiss(loadingToast);
          toast.success('Logged out successfully');
          
          console.log('Logout successful, redirecting to sign-in page');
          
          // Force a small delay to ensure state is cleared before redirect
          setTimeout(() => {
            // Immediately redirect to the sign-in page
            navigate('/auth', { replace: true });
          }, 100);
        } else {
          throw new Error('Logout returned false');
        }
      } catch (innerError) {
        toast.dismiss(loadingToast);
        throw innerError;
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  const handleAddRoommate = () => {
    if (!newRoommate.name.trim() || !newRoommate.email.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const newRoommateWithId: Roommate = {
      ...newRoommate,
      id: Date.now().toString(),
      avatar: newRoommate.name.split(' ').map(n => n[0]).join('').toUpperCase()
    };
    
    setRoommates([...roommates, newRoommateWithId]);
    setShowAddRoommateDialog(false);
    setNewRoommate({
      name: '',
      email: '',
      phone: '',
      role: 'member'
    });
    toast.success("Roommate added successfully");
  };

  const handleEditRoommate = (roommate: Roommate) => {
    setEditingRoommate(roommate);
  };

  const handleSaveEdit = () => {
    if (!editingRoommate) return;
    
    setRoommates(roommates.map(r => 
      r.id === editingRoommate.id ? editingRoommate : r
    ));
    setEditingRoommate(null);
    toast.success("Roommate updated successfully");
  };

  const handleDeleteRoommate = (id: string) => {
    setRoommates(roommates.filter(r => r.id !== id));
    toast.success("Roommate removed successfully");
  };

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-lg">
      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Profile Settings</CardTitle>
          <CardDescription>Manage your personal information and account settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center text-center space-y-2 pb-4">
            <Avatar className="h-20 w-20 md:h-24 md:w-24">
              <AvatarFallback className="bg-blue-400 text-white text-xl md:text-2xl">
                S
              </AvatarFallback>
            </Avatar>
            <h2 className="text-lg md:text-xl font-bold">SARWAN NANDH</h2>
            <p className="text-xs md:text-sm text-muted-foreground">sarwannandhofficial672007@gmail.com</p>
            <Button variant="outline" className="mt-2 text-sm" onClick={() => navigate("/profile")}>
              Update profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Settings Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Account Settings</CardTitle>
          <CardDescription>Manage your account preferences and security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full flex items-center justify-between p-3 md:p-4 h-auto"
              onClick={() => navigate("/settings/language")}
            >
              <div className="flex items-center gap-2 md:gap-3">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Globe className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                </div>
                <span className="text-sm">Language</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs md:text-sm text-muted-foreground">English</span>
                <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
              </div>
            </Button>
            <Button 
              variant="ghost" 
              className="w-full flex items-center justify-between p-3 md:p-4 h-auto"
              onClick={() => navigate("/settings/currency")}
            >
              <div className="flex items-center gap-2 md:gap-3">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                </div>
                <span className="text-sm">Currency</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs md:text-sm text-muted-foreground">USD</span>
                <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
              </div>
            </Button>
            <Button 
              variant="ghost" 
              className="w-full flex items-center justify-between p-3 md:p-4 h-auto"
              onClick={() => navigate("/settings/change-password")}
            >
              <div className="flex items-center gap-2 md:gap-3">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Lock className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
                </div>
                <span className="text-sm">Change Password</span>
              </div>
              <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Premium Features Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Premium Features</CardTitle>
          <CardDescription>Unlock additional features with premium</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Card className="bg-gradient-to-r from-orange-400 to-amber-300 text-white border-none">
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="text-base md:text-lg font-semibold">Invite friends, Get Premium</h3>
                <p className="text-xs md:text-sm opacity-90">Unlock all features</p>
              </div>
            </CardContent>
          </Card>
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full flex items-center justify-between p-3 md:p-4 h-auto"
              onClick={() => navigate("/subscription")}
            >
              <div className="flex items-center gap-2 md:gap-3">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Crown className="h-4 w-4 md:h-5 md:w-5 text-amber-600" />
                </div>
                <span className="text-sm">Manage Subscription</span>
              </div>
              <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
            <Button 
              variant="ghost" 
              className="w-full flex items-center justify-between p-3 md:p-4 h-auto"
              onClick={() => navigate("/subscription")}
            >
              <div className="flex items-center gap-2 md:gap-3">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                </div>
                <span className="text-sm">Refer friends</span>
              </div>
              <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Roommates & Housing Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
            <div>
              <CardTitle className="text-lg md:text-xl">Roommates & Housing</CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Manage your household members and living arrangements
              </CardDescription>
            </div>
            <Dialog open={showAddRoommateDialog} onOpenChange={setShowAddRoommateDialog}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-brand-purple hover:bg-brand-purple-dark w-full md:w-auto"
                  onClick={() => setShowAddRoommateDialog(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Roommate
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Roommate</DialogTitle>
                  <DialogDescription>
                    Add a new member to your household and assign them a room.
                  </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="preferences">Preferences</TabsTrigger>
                  </TabsList>
                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Name
                        </label>
                        <Input
                          id="name"
                          value={newRoommate.name}
                          onChange={(e) => setNewRoommate({ ...newRoommate, name: e.target.value })}
                          placeholder="Enter roommate name"
                        />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email
                        </label>
                        <Input
                          id="email"
                          type="email"
                          value={newRoommate.email}
                          onChange={(e) => setNewRoommate({ ...newRoommate, email: e.target.value })}
                          placeholder="Enter roommate email"
                        />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="phone" className="text-sm font-medium">
                          Phone
                        </label>
                        <Input
                          id="phone"
                          value={newRoommate.phone}
                          onChange={(e) => setNewRoommate({ ...newRoommate, phone: e.target.value })}
                          placeholder="Enter roommate phone"
                        />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="role" className="text-sm font-medium">
                          Role
                        </label>
                        <Select
                          value={newRoommate.role}
                          onValueChange={(value: 'admin' | 'member') => 
                            setNewRoommate({ ...newRoommate, role: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="room" className="text-sm font-medium">
                          Room Assignment
                        </label>
                        <Select
                          value={newRoommate.room}
                          onValueChange={(value) => 
                            setNewRoommate({ ...newRoommate, room: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select room" />
                          </SelectTrigger>
                          <SelectContent>
                            {rooms.map((room) => (
                              <SelectItem 
                                key={room.id} 
                                value={room.id}
                                disabled={room.currentOccupants >= room.capacity}
                              >
                                {room.name} - ${room.rent}/month
                                {room.currentOccupants >= room.capacity && ' (Full)'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="preferences" className="space-y-4">
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Quiet Hours</label>
                        <Input
                          type="text"
                          placeholder="e.g., 10 PM - 7 AM"
                          value={newRoommate.preferences?.quietHours}
                          onChange={(e) => setNewRoommate({
                            ...newRoommate,
                            preferences: {
                              ...newRoommate.preferences,
                              quietHours: e.target.value
                            }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>House Rules</Label>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Allow Guests</Label>
                              <p className="text-sm text-muted-foreground">
                                Can bring guests overnight
                              </p>
                            </div>
                            <Switch
                              checked={newRoommate.preferences?.guests}
                              onCheckedChange={(checked) => setNewRoommate({
                                ...newRoommate,
                                preferences: {
                                  ...newRoommate.preferences,
                                  guests: checked
                                }
                              })}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Allow Pets</Label>
                              <p className="text-sm text-muted-foreground">
                                Can have pets in the house
                              </p>
                            </div>
                            <Switch
                              checked={newRoommate.preferences?.pets}
                              onCheckedChange={(checked) => setNewRoommate({
                                ...newRoommate,
                                preferences: {
                                  ...newRoommate.preferences,
                                  pets: checked
                                }
                              })}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Allow Smoking</Label>
                              <p className="text-sm text-muted-foreground">
                                Can smoke in designated areas
                              </p>
                            </div>
                            <Switch
                              checked={newRoommate.preferences?.smoking}
                              onCheckedChange={(checked) => setNewRoommate({
                                ...newRoommate,
                                preferences: {
                                  ...newRoommate.preferences,
                                  smoking: checked
                                }
                              })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddRoommateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddRoommate} disabled={!newRoommate.name.trim() || !newRoommate.email.trim()}>
                    Add Roommate
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground grid w-full grid-cols-2">
              <TabsTrigger 
                value="overview" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="rooms" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Rooms
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              {roommates.map((roommate) => (
                <div key={roommate.id} className="flex flex-col md:flex-row md:items-center justify-between p-3 md:p-4 border rounded-lg gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 md:h-12 md:w-12">
                      <AvatarFallback>{roommate.avatar || roommate.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm md:text-base">{roommate.name}</h3>
                        {roommate.role === 'admin' && (
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                            Admin
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-col gap-1 text-xs md:text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 md:h-4 md:w-4" />
                          <span>{roommate.email}</span>
                        </div>
                        {roommate.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3 md:h-4 md:w-4" />
                            <span>{roommate.phone}</span>
                          </div>
                        )}
                        {roommate.room && (
                          <div className="flex items-center gap-2">
                            <BedDouble className="h-3 w-3 md:h-4 md:w-4" />
                            <span>{rooms.find(r => r.id === roommate.room)?.name || 'Unassigned'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 md:h-10 md:w-10"
                      onClick={() => handleEditRoommate(roommate)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 md:h-10 md:w-10 text-destructive"
                      onClick={() => handleDeleteRoommate(roommate.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="rooms" className="space-y-4">
              {rooms.map((room) => (
                <Card key={room.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{room.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          ${room.rent}/month
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Users className="h-4 w-4" />
                          <span className="text-sm">
                            {room.currentOccupants}/{room.capacity} occupants
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {room.currentOccupants >= room.capacity ? 'Full' : 'Available'}
                      </Badge>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {room.amenities.map((amenity, index) => (
                          <Badge key={index} variant="secondary">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Support & Feedback Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Support & Feedback</CardTitle>
          <CardDescription>Help us improve your experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="ghost" 
            className="w-full flex items-center justify-between p-3 md:p-4 h-auto"
            onClick={() => navigate("/settings/feedback")}
          >
            <div className="flex items-center gap-2 md:gap-3">
              <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
              </div>
              <span className="text-sm">Feedback</span>
            </div>
            <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          <Button 
            variant="ghost" 
            className="w-full flex items-center justify-between p-3 md:p-4 h-auto"
            onClick={() => navigate("/settings/feature-voting")}
          >
            <div className="flex items-center gap-2 md:gap-3">
              <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Lightbulb className="h-4 w-4 md:h-5 md:w-5 text-yellow-600" />
              </div>
              <span className="text-sm">Feature Voting</span>
            </div>
            <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </CardContent>
      </Card>

      {/* Account Actions Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Account Actions</CardTitle>
          <CardDescription>Manage your account status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="ghost" 
            className="w-full flex items-center justify-between p-3 md:p-4 h-auto text-red-600 hover:text-red-700"
            onClick={handleLogout}
          >
            <div className="flex items-center gap-2 md:gap-3">
              <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-red-100 flex items-center justify-center">
                <LogOut className="h-4 w-4 md:h-5 md:w-5 text-red-600" />
              </div>
              <span className="text-sm">Logout</span>
            </div>
            <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          <Button 
            variant="ghost" 
            className="w-full flex items-center justify-between p-3 md:p-4 h-auto text-red-600 hover:text-red-700"
            onClick={() => navigate("/settings/delete-account")}
          >
            <div className="flex items-center gap-2 md:gap-3">
              <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-red-100 flex items-center justify-center">
                <UserX className="h-4 w-4 md:h-5 md:w-5 text-red-600" />
              </div>
              <span className="text-sm">Delete Account</span>
            </div>
            <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </CardContent>
      </Card>

      {/* Edit Roommate Dialog */}
      <Dialog open={!!editingRoommate} onOpenChange={() => setEditingRoommate(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Roommate</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={editingRoommate?.name || ''}
                onChange={(e) => setEditingRoommate(prev => prev ? { ...prev, name: e.target.value } : null)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-relative">Email</label>
              <Input
                type="email"
                value={editingRoommate?.email || ''}
                onChange={(e) => setEditingRoommate(prev => prev ? { ...prev, email: e.target.value } : null)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input
                value={editingRoommate?.phone || ''}
                onChange={(e) => setEditingRoommate(prev => prev ? { ...prev, phone: e.target.value } : null)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select
                value={editingRoommate?.role || 'member'}
                onValueChange={(value: 'admin' | 'member') => 
                  setEditingRoommate(prev => prev ? { ...prev, role: value } : null)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRoommate(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage;
