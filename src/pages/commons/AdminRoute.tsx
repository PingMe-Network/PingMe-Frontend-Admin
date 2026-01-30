import { useAppSelector, useAppDispatch } from "@/features/hooks.ts";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { logout } from "@/features/slices/authThunk";

interface AdminRouteProps {
  children: ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isLogin, userSession } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isLogin && userSession.roleName !== "ADMIN") {
      toast.error("Bạn không có quyền truy cập trang này");
      dispatch(logout());
    }
  }, [isLogin, userSession, dispatch]);

  if (!isLogin) {
    return <Navigate to="/auth" />;
  }

  if (userSession.roleName !== "ADMIN") {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};
