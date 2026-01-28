import { Suspense } from "react";
import AppLoader from "./AppLoader";

export const LazyElement = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<AppLoader className="h-full min-h-[400px]" />}>{children}</Suspense>
);
