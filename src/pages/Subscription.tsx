import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Crown, Sparkles, Zap, Shield, Clock, Users, Star } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const SubscriptionPage = () => {
  const [showEarlyAccessDialog, setShowEarlyAccessDialog] = useState(false);
  const [showReferDialog, setShowReferDialog] = useState(false);
  const [earlyAccessEmail, setEarlyAccessEmail] = useState("");
  const [earlyAccessReason, setEarlyAccessReason] = useState("");
  const [referEmail, setReferEmail] = useState("");
  const [referMessage, setReferMessage] = useState("Join me on RoomiFi! It's a great app for managing shared living spaces.");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("");

  const handleEarlyAccessSubmit = () => {
    if (!earlyAccessEmail) {
      toast.error("Please enter your email address");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowEarlyAccessDialog(false);
      toast.success(`Your early access request for the ${selectedPlan} plan has been submitted!`);
      setEarlyAccessEmail("");
      setEarlyAccessReason("");
    }, 1500);
  };

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

  const openEarlyAccessDialog = (planName: string) => {
    setSelectedPlan(planName);
    setShowEarlyAccessDialog(true);
  };

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
      period: "forever",
      description: "Basic features for managing your shared home",
      features: [
        "Expense tracking (up to 10 per month)",
        "Basic chore management",
        "Simple reminders",
        "1 household with up to 3 roommates"
      ],
      buttonText: "Current Plan",
      buttonVariant: "outline" as const,
      disabled: true,
      highlight: false
    },
    {
      id: "premium",
      name: "Premium",
      price: "₹199",
      period: "per month",
      description: "Enhanced features for a better roommate experience",
      features: [
        "Unlimited expense tracking",
        "Advanced chore rotation system",
        "Smart reminders with notifications",
        "Up to 3 households with 5 roommates each",
        "Bill splitting with payment integration",
        "Priority support"
      ],
      buttonText: "Get Early Access",
      buttonAction: "earlyAccess",
      buttonVariant: "default" as const,
      disabled: false,
      highlight: true,
      badge: "Early Access"
    },
    {
      id: "family",
      name: "Family",
      price: "₹399",
      period: "per month",
      description: "Perfect for families and larger households",
      features: [
        "All Premium features",
        "Unlimited households and roommates",
        "Family calendar integration",
        "Meal planning tools",
        "Grocery list collaboration",
        "Premium templates and themes",
        "24/7 dedicated support"
      ],
      buttonText: "Get Early Access",
      buttonAction: "earlyAccess",
      buttonVariant: "default" as const,
      disabled: false,
      highlight: false,
      badge: "Coming Soon"
    }
  ];

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="text-center mb-10">
        <Badge className="mb-2 bg-brand-purple hover:bg-brand-purple-dark">
          <Crown className="h-3 w-3 mr-1" /> Premium
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Upgrade Your RoomiFi Experience</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Unlock premium features to make managing your shared living space even easier and more efficient.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`flex flex-col ${
              plan.highlight 
                ? "border-brand-purple shadow-lg relative overflow-hidden" 
                : ""
            } relative`}
          >
            {plan.highlight && !plan.badge && (
              <div className="absolute top-0 right-0">
                <div className="bg-brand-purple text-white text-xs font-medium py-1 px-3 rounded-bl-lg">
                  MOST POPULAR
                </div>
              </div>
            )}
            {plan.badge && (
              <div className="absolute top-0 right-0 flex flex-col items-end">
                {plan.highlight && (
                  <div className="bg-brand-purple text-white text-xs font-medium py-1 px-3 rounded-bl-lg mb-1">
                    MOST POPULAR
                  </div>
                )}
                <div className={`text-white text-xs font-medium py-1 px-3 rounded-bl-lg ${
                  plan.badge === "Coming Soon" ? "bg-blue-500" : "bg-green-500"
                }`}>
                  {plan.badge}
                </div>
              </div>
            )}
            <CardHeader>
              <CardTitle className="flex items-center">
                {plan.name === "Premium" && <Sparkles className="h-5 w-5 mr-2 text-brand-purple" />}
                {plan.name === "Family" && <Users className="h-5 w-5 mr-2 text-blue-500" />}
                {plan.name}
              </CardTitle>
              <div className="mt-2">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground ml-1 text-sm">/{plan.period}</span>
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {plan.buttonAction === "earlyAccess" ? (
                <Button 
                  variant={plan.buttonVariant} 
                  className={`w-full ${plan.highlight ? "bg-brand-purple hover:bg-brand-purple-dark" : ""}`}
                  disabled={plan.disabled}
                  onClick={() => openEarlyAccessDialog(plan.name)}
                >
                  {plan.buttonText}
                </Button>
              ) : (
                <Button 
                  variant={plan.buttonVariant} 
                  className={`w-full ${plan.highlight ? "bg-brand-purple hover:bg-brand-purple-dark" : ""}`}
                  disabled={plan.disabled}
                >
                  {plan.buttonText}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Why Go Premium?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4">
                  <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Enhanced Productivity</h3>
                  <p className="text-sm text-muted-foreground">
                    Streamline household management with advanced tools and automation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start">
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-4">
                  <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Conflict Resolution</h3>
                  <p className="text-sm text-muted-foreground">
                    Fair chore distribution and expense tracking to prevent roommate disputes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mr-4">
                  <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Save Time</h3>
                  <p className="text-sm text-muted-foreground">
                    Spend less time managing household tasks and more time enjoying your home.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start">
                <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full mr-4">
                  <Star className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Premium Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Get priority assistance whenever you need help with your RoomiFi account.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-12 max-w-3xl mx-auto">
        <Card className="border-dashed border-2 border-brand-purple/30">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold mb-2">Refer Friends, Get Rewards</h3>
                <p className="text-sm text-muted-foreground">
                  Invite your friends to RoomiFi and earn free premium access when they sign up!
                </p>
              </div>
              <Button 
                className="bg-brand-purple hover:bg-brand-purple-dark"
                onClick={() => setShowReferDialog(true)}
              >
                <Users className="mr-2 h-4 w-4" />
                Refer Friends
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-2">Still have questions?</h2>
        <p className="text-muted-foreground mb-6">
          Contact our support team for more information about premium features.
        </p>
        <Button variant="outline">Contact Support</Button>
      </div>

      {/* Early Access Dialog */}
      <Dialog open={showEarlyAccessDialog} onOpenChange={setShowEarlyAccessDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Get Early Access to {selectedPlan} Plan</DialogTitle>
            <DialogDescription>
              {selectedPlan === "Premium" 
                ? "Be among the first to experience our enhanced features for better roommate management."
                : "The Family Plan is coming soon! Sign up for early access and be among the first to try our most comprehensive plan."
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="your@email.com" 
                value={earlyAccessEmail}
                onChange={(e) => setEarlyAccessEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Why are you interested in the {selectedPlan} Plan?</Label>
              <Textarea 
                id="reason" 
                placeholder={`Tell us about your household and why you're interested in the ${selectedPlan} plan...`}
                className="min-h-[100px]"
                value={earlyAccessReason}
                onChange={(e) => setEarlyAccessReason(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowEarlyAccessDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEarlyAccessSubmit}
              disabled={isSubmitting}
              className={selectedPlan === "Premium" ? "bg-brand-purple hover:bg-brand-purple-dark" : "bg-blue-500 hover:bg-blue-600"}
            >
              {isSubmitting ? "Submitting..." : "Request Early Access"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

export default SubscriptionPage;
