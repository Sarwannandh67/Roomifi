import { useDashboard } from "@/context/DashboardContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export const EditExpensePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { expenses, updateExpense } = useDashboard();
  // ... rest of the component code ...
}; 