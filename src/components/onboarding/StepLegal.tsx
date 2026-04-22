import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FileText, Shield } from "lucide-react";

interface LegalData {
  acceptedPrivacy: boolean;
  acceptedTerms: boolean;
}

interface StepLegalProps {
  data: LegalData;
  updateData: (data: Partial<LegalData>) => void;
}

export const StepLegal: React.FC<StepLegalProps> = ({ data, updateData }) => {
  const handleOpenPrivacyPolicy = () => {
    window.open("/privacy-policy", "_blank");
  };

  const handleOpenTerms = () => {
    window.open("/terms", "_blank");
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Legal Information</h2>
        <p className="text-muted-foreground">
          Please review and accept our terms and privacy policy
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-3 p-4 rounded-lg border bg-card">
          <Shield className="h-5 w-5 text-primary mt-0.5" />
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="privacy"
                checked={data.acceptedPrivacy}
                onCheckedChange={(checked) =>
                  updateData({ acceptedPrivacy: checked === true })
                }
              />
              <Label htmlFor="privacy" className="text-sm">
                I have read and agree to the{" "}
                <Button
                  variant="link"
                  className="h-auto p-0 text-primary"
                  onClick={handleOpenPrivacyPolicy}
                >
                  Privacy Policy
                </Button>
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              We collect and process your data in accordance with our privacy policy
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-4 rounded-lg border bg-card">
          <FileText className="h-5 w-5 text-primary mt-0.5" />
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={data.acceptedTerms}
                onCheckedChange={(checked) =>
                  updateData({ acceptedTerms: checked === true })
                }
              />
              <Label htmlFor="terms" className="text-sm">
                I have read and agree to the{" "}
                <Button
                  variant="link"
                  className="h-auto p-0 text-primary"
                  onClick={handleOpenTerms}
                >
                  Terms and Conditions
                </Button>
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              By accepting these terms, you agree to use our service responsibly
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 