import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Check } from "lucide-react";

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar", flag: "🇺🇸" },
  { code: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", symbol: "£", name: "British Pound", flag: "🇬🇧" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", flag: "🇯🇵" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", flag: "🇨🇳" },
  { code: "INR", symbol: "₹", name: "Indian Rupee", flag: "🇮🇳" },
  { code: "CAD", symbol: "$", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "AUD", symbol: "$", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "SGD", symbol: "$", name: "Singapore Dollar", flag: "🇸🇬" },
  { code: "KRW", symbol: "₩", name: "South Korean Won", flag: "🇰🇷" },
];

const CurrencyPage = () => {
  const navigate = useNavigate();
  const [selectedCurrency, setSelectedCurrency] = React.useState("USD");

  return (
    <div className="container max-w-lg mx-auto p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Currency</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Currency</CardTitle>
          <CardDescription>Choose your preferred currency for transactions</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {currencies.map((currency) => (
            <Button
              key={currency.code}
              variant="ghost"
              className="w-full flex items-center justify-between p-4 h-auto"
              onClick={() => setSelectedCurrency(currency.code)}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{currency.flag}</span>
                <div className="flex flex-col items-start">
                  <span>{currency.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {currency.symbol} • {currency.code}
                  </span>
                </div>
              </div>
              {selectedCurrency === currency.code && (
                <Check className="h-5 w-5 text-green-600" />
              )}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default CurrencyPage; 