import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/features/hooks";
import { useEffect } from "react";
import { getCurrentUserSession } from "@/features/slices/authThunk";

const RootPageLayout = () => {
  const dispatch = useAppDispatch();
  const { isLogin } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isLogin) dispatch(getCurrentUserSession());
  }, [dispatch, isLogin]);

  return (
    <div className="min-w-screen flex flex-col py-12">
      <div className="grow">
        <Outlet />
      </div>
    </div>
  );
};

export default RootPageLayout;
