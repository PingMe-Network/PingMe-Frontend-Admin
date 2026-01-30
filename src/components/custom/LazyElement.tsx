import { Suspense } from "react";
import AppLoader from "./AppLoader";

export const LazyElement = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<AppLoader className="flex-1 w-full" />}>{children}</Suspense>
);
