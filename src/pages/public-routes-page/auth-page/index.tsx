import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import LoginForm from "./components/LoginForm.tsx";
import { useAppSelector } from "@/features/hooks";

export default function AuthPage() {
  const navigate = useNavigate();

  const { isLogin } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isLogin) {
      navigate("/admin", { replace: true });
    }
  }, [isLogin, navigate]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <LoginForm />
    </AnimatePresence>
  );
}
