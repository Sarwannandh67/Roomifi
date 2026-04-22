import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Check } from "lucide-react";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
];

const LanguagePage = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = React.useState("en");

  return (
    <div className="container max-w-lg mx-auto p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Language</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Language</CardTitle>
          <CardDescription>Choose your preferred language for the app</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {languages.map((language) => (
            <Button
              key={language.code}
              variant="ghost"
              className="w-full flex items-center justify-between p-4 h-auto"
              onClick={() => setSelectedLanguage(language.code)}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{language.flag}</span>
                <span>{language.name}</span>
              </div>
              {selectedLanguage === language.code && (
                <Check className="h-5 w-5 text-green-600" />
              )}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default LanguagePage; 