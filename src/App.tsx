import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import IndexPage from "@/pages/Index";
import ExpensesPage from "@/pages/Expenses";
import AddExpensePage from "@/pages/add-expense";
import ExpensesGraphPage from "@/pages/ExpensesGraph";
import ChoresPage from "@/pages/Chores";
import AddChorePage from "@/pages/AddChore";
import RemindersPage from "@/pages/Reminders";
import AddReminderPage from "@/pages/AddReminder";
import SettingsPage from "@/pages/Settings";
import ProfilePage from "@/pages/Profile";
import AuthPage from "@/pages/Auth";
import { ChangePasswordPage } from "@/pages/ChangePassword";
import NotFoundPage from "@/pages/NotFound";
import { DashboardProvider } from "@/context/DashboardContext";
import { ExpensesProvider } from "@/context/ExpensesContext";
import OnboardingPage from "@/pages/Onboarding";
import { NotificationsPage } from "@/pages/Notifications";
import ChatPage from "@/pages/Chat";
import GroupChatPage from "@/pages/GroupChatPage";
import { FeatureVotingPage } from "@/pages/FeatureVoting";
import { CurrencyPage } from "@/pages/Currency";
import { LanguagePage } from "@/pages/Language";
import { RoommatesPage } from "@/pages/Roommates";
import { SubscriptionPage } from "@/pages/Subscription";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { PageTransition } from "@/components/routing/PageTransition";

const AppRoutes = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen message="Starting RoomiFi..." />;
  }

  return (
    <PageTransition>
      <Routes>
        <Route path="/auth" element={user ? <Navigate to="/" /> : <AuthPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route element={<AuthenticatedLayout />}>
          <Route index element={<IndexPage />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="expenses/add" element={<AddExpensePage />} />
          <Route path="expenses/graph" element={<ExpensesGraphPage />} />
          <Route path="chores" element={<ChoresPage />} />
          <Route path="chores/add" element={<AddChorePage />} />
          <Route path="reminders" element={<RemindersPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="settings/language" element={<LanguagePage />} />
          <Route path="settings/currency" element={<CurrencyPage />} />
          <Route path="settings/feature-voting" element={<FeatureVotingPage />} />
          <Route path="settings/change-password" element={<ChangePasswordPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="subscription" element={<SubscriptionPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="group-chat" element={<GroupChatPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="roommates" element={<RoommatesPage />} />
        </Route>
        <Route path="*" element={
          user ? <NotFoundPage /> : <Navigate to="/auth" state={{ from: location.pathname }} />
        } />
      </Routes>
    </PageTransition>
  );
};

const App = () => {
  return (
    <Router>
      <ThemeProvider defaultTheme="dark" storageKey="roomi-theme">
        <AuthProvider>
          <DashboardProvider>
            <ExpensesProvider>
              <div className="min-h-screen bg-background text-foreground">
                <AppRoutes />
                <Toaster />
              </div>
            </ExpensesProvider>
          </DashboardProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
