import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar", region: "United States" },
  { code: "INR", symbol: "₹", name: "Indian Rupee", region: "India" },
  { code: "EUR", symbol: "€", name: "Euro", region: "European Union" },
  { code: "GBP", symbol: "£", name: "British Pound", region: "United Kingdom" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", region: "Japan" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", region: "Australia" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", region: "Canada" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", region: "Singapore" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", region: "China" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", region: "UAE" },
];

export const CurrencyPage = () => {
  const navigate = useNavigate();
  const [selectedCurrency, setSelectedCurrency] = React.useState("USD");

  const handleCurrencyChange = (value: string) => {
    setSelectedCurrency(value);
    // Here you would typically update the currency in your app's state management
  };

  return (
    <div className="container max-w-lg mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Currency</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Currency</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedCurrency}
            onValueChange={handleCurrencyChange}
            className="space-y-3"
          >
            {currencies.map((currency) => (
              <div
                key={currency.code}
                className="flex items-center space-x-2 space-y-0"
              >
                <RadioGroupItem value={currency.code} id={currency.code} />
                <Label
                  htmlFor={currency.code}
                  className="flex flex-1 items-center justify-between cursor-pointer py-2"
                >
                  <div>
                    <span className="font-medium">
                      {currency.symbol} - {currency.name}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      ({currency.region})
                    </span>
                  </div>
                  {selectedCurrency === currency.code && (
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