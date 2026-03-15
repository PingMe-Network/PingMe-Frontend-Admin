import axiosAuthClient from "@/lib/axiosAuthClient";
import type { ApiResponse } from "@/types/base/apiResponse";
import type {
  AdminLoginResponse,
  DefaultAuthResponse,
  LoginRequest,
  RegisterRequest,
} from "@/types/authentication";
import { getSessionMetaRequest } from "@/utils/sessionMetaHandler";

// 1. REGISTER
export const registerLocalApi = (data: RegisterRequest) => {
  return axiosAuthClient.post<ApiResponse<DefaultAuthResponse>>(
    "/auth-service/auth/register",
    data,
  );
};

// LOGIN
export const loginLocalApi = (data: LoginRequest) => {
  data.submitSessionMetaRequest = getSessionMetaRequest();
  return axiosAuthClient.post<ApiResponse<AdminLoginResponse>>(
    "/auth-service/auth/admin/login",
    data,
  );
};

// LOGOUT
export const logoutApi = () => {
  return axiosAuthClient.post("/auth-service/auth/logout");
};
