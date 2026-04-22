import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const languages = [
  { code: "en", name: "English", region: "United States" },
  { code: "hi", name: "हिन्दी", region: "India" },
  { code: "es", name: "Español", region: "Spain" },
  { code: "fr", name: "Français", region: "France" },
  { code: "de", name: "Deutsch", region: "Germany" },
  { code: "it", name: "Italiano", region: "Italy" },
  { code: "pt", name: "Português", region: "Portugal" },
  { code: "ru", name: "Русский", region: "Russia" },
  { code: "ja", name: "日本語", region: "Japan" },
  { code: "ko", name: "한국어", region: "Korea" },
];

export const LanguagePage = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = React.useState("en");

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    // Here you would typically update the language in your app's state management
  };

  return (
    <div className="container max-w-lg mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Language</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Language</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedLanguage}
            onValueChange={handleLanguageChange}
            className="space-y-3"
          >
            {languages.map((lang) => (
              <div
                key={lang.code}
                className="flex items-center space-x-2 space-y-0"
              >
                <RadioGroupItem value={lang.code} id={lang.code} />
                <Label
                  htmlFor={lang.code}
                  className="flex flex-1 items-center justify-between cursor-pointer py-2"
                >
                  <div>
                    <span className="font-medium">{lang.name}</span>
                    <span className="text-muted-foreground ml-2">
                      ({lang.region})
                    </span>
                  </div>
                  {selectedLanguage === lang.code && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
}; 