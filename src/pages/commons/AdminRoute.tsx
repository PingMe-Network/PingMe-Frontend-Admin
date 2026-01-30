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
  const { isLogin, userSession, logoutReason } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isLogin && userSession.roleName !== "ADMIN") {
      toast.error("Bạn không có quyền truy cập trang này");
      dispatch(logout());
    }
  }, [isLogin, userSession, dispatch]);

  if (!isLogin) {
    if (logoutReason === "EXPIRED") {
      toast.error("Phiên đăng nhập đã hết hạn");
    }
    return <Navigate to="/auth" />;
  }

  // Verify role one last time to prevent render before logout effect
  if (userSession.roleName !== "ADMIN") {
    // Return null while the useEffect handles the logout
    return null;
  }

  return <>{children}</>;
};
