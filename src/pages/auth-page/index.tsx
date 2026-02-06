import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, Shield } from "lucide-react";
import type { LoginRequest } from "@/types/authentication";
import { useAppDispatch, useAppSelector } from "@/features/hooks";
import { getCurrentUserSession, login } from "@/features/slices/authThunk";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorMessageHandler";
import {
  checkAdminVerificationApi,
  sendOtpToEmailApi,
} from "@/services/mail/mailManageMentApi";

export default function AuthPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLogin } = useAppSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isLogin) {
      navigate("/admin", { replace: true });
    }
  }, [isLogin, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const loginRequestDto: LoginRequest = { email, password };

    try {
      const actionResult = await dispatch(login(loginRequestDto)).unwrap();

      if (actionResult.isAdminAccount) {
        try {
          const checkRes = await checkAdminVerificationApi();
          console.log(checkRes);
          if (checkRes.data.data === true) {
            await dispatch(getCurrentUserSession()).unwrap();
            navigate("/admin");
          } else {
            await sendOtpToEmailApi({
              email: actionResult.email,
              otpType: "ADMIN_VERIFICATION",
            });

            toast.info("Vui lòng xác thực OTP để tiếp tục");

            navigate("/auth/verify-otp", {
              state: {
                email: actionResult.email,
                otpType: "ADMIN_VERIFICATION",
              },
            });
          }
        } catch (checkErr) {
          console.error(checkErr);
          toast.error("Không thể kiểm tra trạng thái xác thực.");
        }
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Đăng nhập thất bại"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
      <div className="w-full max-w-md">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-3 mb-10">
          <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">PingMe</h1>
            <p className="text-xs text-gray-500">Admin Portal</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100">
          {/* Form Header */}
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Chào mừng trở lại
            </h2>
            <p className="text-gray-500">
              Đăng nhập để truy cập bảng điều khiển quản trị
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Mật khẩu
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-11 h-12 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold mt-2 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                "Đăng nhập"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-blue-100">
            <p className="text-center text-sm text-gray-500">
              Chỉ dành cho quản trị viên được ủy quyền.
              <br />
              <span className="text-xs">
                Mọi hoạt động đều được ghi nhận và giám sát.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
