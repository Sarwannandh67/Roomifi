import React, { useState } from "react";
import { User, Users, Gift } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ProfileData {
  name: string;
  nickname: string;
  avatar: string;
  referralCode?: string;
}

interface StepProfileProps {
  data: ProfileData;
  updateData: (data: Partial<ProfileData>) => void;
}

export const StepProfile: React.FC<StepProfileProps> = ({ data, updateData }) => {
  const [showReferDialog, setShowReferDialog] = useState(false);
  const [referEmail, setReferEmail] = useState("");
  const [referMessage, setReferMessage] = useState("Join me on RoomiFi! It's a great app for managing shared living spaces.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const avatarOptions = [
    { id: "avatar1", url: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Felix" },
    { id: "avatar2", url: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Peanut" },
    { id: "avatar3", url: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Milo" },
    { id: "avatar4", url: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Abby" },
    { id: "avatar5", url: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Zoe" },
  ];

  const handleReferSubmit = () => {
    if (!referEmail) {
      toast.error("Please enter your friend's email address");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowReferDialog(false);
      toast.success("Invitation sent successfully!");
      setReferEmail("");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Set up your profile</h2>
        <p className="text-muted-foreground">
          Let's get to know you a bit better
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col items-center">
          <p className="text-sm text-muted-foreground mb-3">Choose an avatar</p>
          <RadioGroup
            value={data.avatar}
            onValueChange={(value) => updateData({ avatar: value })}
            className="flex flex-wrap justify-center gap-4"
          >
            {avatarOptions.map((avatar) => (
              <div key={avatar.id} className="flex flex-col items-center">
                <RadioGroupItem
                  value={avatar.url}
                  id={avatar.id}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={avatar.id}
                  className="flex flex-col items-center cursor-pointer"
                >
                  <Avatar className="h-16 w-16 border-2 peer-data-[state=checked]:border-primary">
                    <AvatarImage src={avatar.url} alt="Avatar" />
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <div>
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={data.name}
              onChange={(e) => updateData({ name: e.target.value })}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="nickname" className="flex items-center">
              Nickname (Optional)
            </Label>
            <Input
              id="nickname"
              placeholder="What should others call you?"
              value={data.nickname}
              onChange={(e) => updateData({ nickname: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="referralCode" className="flex items-center">
              Referral Code (Optional)
              <span className="ml-1 text-xs text-muted-foreground">
                Have a referral code from a friend?
              </span>
            </Label>
            <Input
              id="referralCode"
              placeholder="Enter referral code"
              value={data.referralCode || ""}
              onChange={(e) => updateData({ referralCode: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>

        <Separator className="my-4" />

        <Card className="border-dashed border-2 border-brand-purple/30">
          <div className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="bg-brand-purple/10 p-2 rounded-full">
                  <Gift className="h-5 w-5 text-brand-purple" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Invite Friends & Earn Rewards</h3>
                  <p className="text-xs text-muted-foreground">
                    Get premium features when friends join
                  </p>
                </div>
              </div>
              <Button 
                size="sm"
                variant="outline" 
                className="border-brand-purple text-brand-purple hover:bg-brand-purple/10"
                onClick={() => setShowReferDialog(true)}
              >
                <Users className="mr-1 h-3 w-3" />
                Refer Now
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Refer Friend Dialog */}
      <Dialog open={showReferDialog} onOpenChange={setShowReferDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Refer Friends to RoomiFi</DialogTitle>
            <DialogDescription>
              Invite your friends to join RoomiFi. For each friend who signs up, you'll get closer to free premium access!
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="friendEmail">Friend's Email</Label>
              <Input 
                id="friendEmail" 
                type="email" 
                placeholder="friend@email.com" 
                value={referEmail}
                onChange={(e) => setReferEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Personalized Message (Optional)</Label>
              <Textarea 
                id="message" 
                placeholder="Add a personal message to your invitation..."
                className="min-h-[100px]"
                value={referMessage}
                onChange={(e) => setReferMessage(e.target.value)}
              />
            </div>

            <div className="bg-muted p-3 rounded-md">
              <h4 className="text-sm font-medium mb-2">Referral Benefits</h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Invite 1 friend: Get 1 week of Premium free</li>
                <li>• Invite 3 friends: Get 1 month of Premium free</li>
                <li>• Invite 5 friends: Get 3 months of Premium free</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowReferDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleReferSubmit}
              disabled={isSubmitting}
              className="bg-brand-purple hover:bg-brand-purple-dark"
            >
              {isSubmitting ? "Sending..." : "Send Invitation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
