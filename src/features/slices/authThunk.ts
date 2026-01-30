import { loginLocalApi, logoutApi } from "@/services/authentication";
import type {
  DefaultAuthResponse,
  LoginRequest,
  CurrentUserSessionResponse,
} from "@/types/authentication";
import { getErrorMessage } from "@/utils/errorMessageHandler";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { getCurrentUserSessionApi } from "@/services/user/currentUserProfileApi.ts";

export const login = createAsyncThunk<
  DefaultAuthResponse,
  LoginRequest,
  { rejectValue: string }
>("auth/login", async (data, thunkAPI) => {
  try {
    const res = await loginLocalApi(data);
    const authData = res.data.data;

    // Check strict Admin Role
    if (authData.userSession.roleName !== "ADMIN") {
      const message = "Bạn không có quyền truy cập vào hệ thống quản trị.";
      toast.error(message);
      // Optional: Logout immediately to invalidate the session on backend if needed, 
      // but client-side we just reject.
      return thunkAPI.rejectWithValue(message);
    }

    toast.success("Đăng nhập thành công");
    return authData;
  } catch (err: unknown) {
    const message = getErrorMessage(err, "Đăng nhập thất bại");
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await logoutApi();
  } catch (err: unknown) {
    const message = getErrorMessage(err, "Đăng xuất thất bại");
    return thunkAPI.rejectWithValue(message);
  }
});

export const getCurrentUserSession = createAsyncThunk<
  CurrentUserSessionResponse,
  void,
  { rejectValue: string }
>("auth/me", async (_, thunkAPI) => {
  try {
    const res = await getCurrentUserSessionApi();
    return res.data.data;
  } catch (err: unknown) {
    const message = getErrorMessage(err, "Lấy thông tin tài khoản thất bại");
    return thunkAPI.rejectWithValue(message);
  }
});
