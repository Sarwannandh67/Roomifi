import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, Home, User, Users, Settings, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepWelcome } from "@/components/onboarding/StepWelcome";
import { StepProfile } from "@/components/onboarding/StepProfile";
import { StepHousehold } from "@/components/onboarding/StepHousehold";
import { StepRoommates } from "@/components/onboarding/StepRoommates";
import { StepPreferences } from "@/components/onboarding/StepPreferences";
import { StepLegal } from "@/components/onboarding/StepLegal";
import { StepComplete } from "@/components/onboarding/StepComplete";

const steps = [
  { id: "welcome", title: "Welcome", icon: Home },
  { id: "profile", title: "Your Profile", icon: User },
  { id: "household", title: "Household", icon: Home },
  { id: "roommates", title: "Roommates", icon: Users },
  { id: "preferences", title: "Preferences", icon: Settings },
  { id: "legal", title: "Legal", icon: FileText },
  { id: "complete", title: "Complete", icon: Check },
];

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    profile: {
      name: "",
      nickname: "",
      avatar: "",
      referralCode: "",
    },
    household: {
      type: "create" as "create" | "join",
      name: "",
      inviteCode: "",
    },
    roommates: {
      emails: [""],
      skipInvites: false,
    },
    preferences: {
      choreRotation: true,
      reminderTone: "kind",
      currency: "₹",
    },
    legal: {
      acceptedPrivacy: false,
      acceptedTerms: false,
    },
  });
  const navigate = useNavigate();

  const updateFormData = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  const nextStep = () => {
    // Check if legal step is complete
    if (currentStep === steps.length - 2) { // Legal step is second to last
      if (!formData.legal.acceptedPrivacy || !formData.legal.acceptedTerms) {
        // Show error or alert that both must be accepted
        return;
      }
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Here you would typically save all data to your backend
    console.log("Onboarding complete with data:", formData);
    // Navigate to dashboard
    navigate("/");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <StepWelcome nextStep={nextStep} />;
      case 1:
        return (
          <StepProfile
            data={formData.profile}
            updateData={(data) => updateFormData("profile", data)}
          />
        );
      case 2:
        return (
          <StepHousehold
            data={formData.household}
            updateData={(data) => updateFormData("household", data)}
          />
        );
      case 3:
        return (
          <StepRoommates
            data={formData.roommates}
            updateData={(data) => updateFormData("roommates", data)}
          />
        );
      case 4:
        return (
          <StepPreferences
            data={formData.preferences}
            updateData={(data) => updateFormData("preferences", data)}
          />
        );
      case 5:
        return (
          <StepLegal
            data={formData.legal}
            updateData={(data) => updateFormData("legal", data)}
          />
        );
      case 6:
        return <StepComplete formData={formData} onComplete={handleComplete} />;
      default:
        return null;
    }
  };

  // Only show navigation buttons after welcome screen
  const showNavigation = currentStep > 0 && currentStep < steps.length - 1;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Progress indicator */}
      <div className="px-4 pt-6 pb-2">
        <div className="flex justify-between items-center w-full mb-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex flex-col items-center ${
                index <= currentStep ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                  index <= currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {index < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <step.icon className="h-4 w-4" />
                )}
              </div>
              <span className="text-xs hidden md:block">{step.title}</span>
            </div>
          ))}
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-in-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 container max-w-2xl mx-auto px-4 py-8">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col"
        >
          {renderStep()}
        </motion.div>

        {/* Navigation buttons */}
        {showNavigation && (
          <div className="flex justify-between mt-8 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={prevStep}
              className="flex items-center"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button 
              onClick={nextStep} 
              className="flex items-center"
              disabled={currentStep === steps.length - 2 && (!formData.legal.acceptedPrivacy || !formData.legal.acceptedTerms)}
            >
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
