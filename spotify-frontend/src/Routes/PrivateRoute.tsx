import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

const PrivateRoute = ({ children }: { children: ReactNode }) => {

  const sessionId = localStorage.getItem("sessionId")

  if (!sessionId) {
    
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
