import { auth } from "@/firebase";
import { ReactNode } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { LayoutFullScreen } from "../LayoutFullScreen/LayoutFullScreen";
import { PageAuth } from "../PageAuth/PageAuth";

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) return <LayoutFullScreen>Loading User...</LayoutFullScreen>;
  if (error) return <div>Error Loading User</div>;

  if (!user) return <PageAuth />;
  return children;
};
