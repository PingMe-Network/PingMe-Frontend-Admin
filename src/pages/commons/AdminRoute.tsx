import { useAppSelector } from "@/features/hooks.ts";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

interface AdminRouteProps {
  children: ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isLogin, userSession, logoutReason } = useAppSelector(
    (state) => state.auth,
  );

  if (!isLogin) {
    if (logoutReason === "EXPIRED") toast.error("Phiên đăng nhập đã hết hạn");
    return <Navigate to="/auth" />;
  }

  if (userSession.roleName !== "ADMIN") {
    toast.error("Bạn không có quyền truy cập trang này");
    return <Navigate to="/home" />;
  }

  return <>{children}</>;
};
