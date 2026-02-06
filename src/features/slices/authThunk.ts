import { loginLocalApi, logoutApi } from "@/services/authentication";
import type {
  LoginRequest,
  CurrentUserSessionResponse,
  AdminLoginResponse,
} from "@/types/authentication";
import { getErrorMessage } from "@/utils/errorMessageHandler";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { getCurrentUserSessionApi } from "@/services/user/currentUserProfileApi.ts";

export const login = createAsyncThunk<
  AdminLoginResponse,
  LoginRequest,
  { rejectValue: string }
>("auth/login", async (data, thunkAPI) => {
  try {
    const res = await loginLocalApi(data);
    const authData = res.data.data;

    if (authData.isAdminAccount === false) {
      const message = "Bạn không có quyền truy cập vào hệ thống quản trị.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }

    // 1. Lưu token ngay lập tức (Quan trọng để API check verify sau đó chạy được)
    localStorage.setItem("access_token", authData.accessToken);

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
    localStorage.removeItem("access_token");
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
