import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

const PublicRoute = ({ children }: { children: ReactNode }) => {

  const sessionId = localStorage.getItem("sessionId")

  if (sessionId) {
    console.log(sessionId)
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default PublicRoute;
