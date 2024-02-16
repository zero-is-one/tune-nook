import { auth } from "@/firebase";
import { ReactNode } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { PageLogin } from "../PageLogin/PageLogin";

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) return <div>Loading User...</div>;
  if (error) return <div>Error Loading User</div>;

  if (!user) return <PageLogin />;
  return <>{children}</>;
};
