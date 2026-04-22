import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EyeIcon, EyeOffIcon, Apple, Facebook, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showReferDialog, setShowReferDialog] = useState(false);
  const [referEmail, setReferEmail] = useState("");
  const [referMessage, setReferMessage] = useState("Join me on RoomiFi! It's a great app for managing shared living spaces.");
  const [isSubmittingReferral, setIsSubmittingReferral] = useState(false);
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log('Form submitted with email:', email);

    try {
      if (isSignUp) {
        console.log('Attempting to sign up...');
        await signUp(email, password);
        toast.success('Account created successfully! Please check your email to confirm your account.');
      } else {
        console.log('Attempting to sign in...');
        await signIn(email, password);
        console.log('Sign in successful, checking for redirect');
        
        // Get the intended destination from location state or default to home
        const from = location.state?.from || '/';
        console.log('Redirecting to:', from);
        
        navigate(from);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      console.log('Google sign-in button clicked');
      await signInWithGoogle();
      // No need to navigate here as the OAuth flow will handle redirection
    } catch (error) {
      console.error('Google sign in error:', error);
      toast.error('Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReferSubmit = () => {
    if (!referEmail) {
      toast.error("Please enter your friend's email address");
      return;
    }

    setIsSubmittingReferral(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmittingReferral(false);
      setShowReferDialog(false);
      toast.success("Invitation sent successfully!");
      setReferEmail("");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      {/* App Branding Block */}
      <div className="text-center mb-8">
        <div className="w-24 h-24 mx-auto mb-4 bg-brand-purple rounded-xl flex items-center justify-center">
          <span className="text-3xl font-bold text-white">R</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">RoomiFi</h1>
        <p className="text-muted-foreground mt-1">Smart Shared Living Assistant</p>
      </div>
      
      {/* Welcome Text Block */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-foreground">Welcome back!</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Sign in to manage your shared home effortlessly.
        </p>
      </div>
      
      {/* Login Form Block */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isSignUp ? 'Create Account' : 'Welcome Back'}</CardTitle>
          <CardDescription>
            {isSignUp
              ? 'Enter your details to create your account'
              : 'Sign in to your account to continue'}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2 relative">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
            
            <Button type="submit" className="w-full bg-brand-purple hover:bg-brand-purple-dark" disabled={loading}>
              {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>
          </form>
          
          {/* Forgot Password Link */}
          <div className="text-center mt-4">
            <Link to="/forgot-password" className="text-sm text-brand-purple hover:underline">
              Forgot your password?
            </Link>
          </div>
          
          {/* Alternative Login Methods */}
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">OR</span>
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg 
                className="mr-2 h-4 w-4" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 48 48"
              >
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
              </svg>
              Continue with Google
            </Button>
            
            <Button variant="outline" className="w-full">
              <Facebook className="mr-2 h-4 w-4 text-blue-600" />
              Continue with Facebook
            </Button>
            
            <Button variant="outline" className="w-full">
              <Apple className="mr-2 h-4 w-4" />
              Continue with Apple
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Refer Friend Card */}
      <div className="mt-8 w-full max-w-md">
        <Card className="border-dashed border-2 border-brand-purple/30">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold">Invite Friends & Earn Rewards</h3>
                <p className="text-xs text-muted-foreground">
                  Get premium features when friends join
                </p>
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
          </CardContent>
        </Card>
      </div>
      
      {/* Sign Up Prompt */}
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          {isSignUp ? (
            <>
              Already have an account?{' '}
              <Link to="/" className="text-brand-purple font-medium hover:underline">
                Sign in
              </Link>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <Link to="/onboarding" className="text-brand-purple font-medium hover:underline">
                Create an account
              </Link>
            </>
          )}
        </p>
      </div>
      
      {/* Legal Footer */}
      <div className="mt-8 text-center text-xs text-muted-foreground">
        <p>
          By continuing, you agree to our{' '}
          <Link to="/terms" className="underline hover:text-brand-purple">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="underline hover:text-brand-purple">
            Privacy Policy
          </Link>
        </p>
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
              disabled={isSubmittingReferral}
              className="bg-brand-purple hover:bg-brand-purple-dark"
            >
              {isSubmittingReferral ? "Sending..." : "Send Invitation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuthPage;
