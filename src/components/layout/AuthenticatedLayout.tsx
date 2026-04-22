import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { MainLayout } from "./MainLayout";
import { useAuth } from "@/context/AuthContext";

export const AuthenticatedLayout = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login page with the current location as state
      // This will allow us to redirect back after login
      navigate('/auth', { state: { from: location.pathname } });
    }
  }, [user, loading, navigate, location]);

  // If still loading or no user, don't render the content
  if (loading || !user) {
    return null;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default AuthenticatedLayout;