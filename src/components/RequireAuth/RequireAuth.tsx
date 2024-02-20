import { auth } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Outlet } from "react-router-dom";
import { PageLogin } from "../PageLogin/PageLogin";

export const RequireAuth = () => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) return <div>Loading User...</div>;
  if (error) return <div>Error Loading User</div>;

  if (!user) return <PageLogin />;
  return <Outlet />;
};
