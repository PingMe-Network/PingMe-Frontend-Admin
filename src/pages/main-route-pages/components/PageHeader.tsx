import type { ReactNode } from "react";

interface PageHeaderProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
}

import { HeaderUserMenu } from "./HeaderUserMenu";

import { useLocation } from "react-router-dom";
import { NAV_GROUPS } from "@/constants/navigation";

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  const location = useLocation();

  // Find current group and item based on path
  const currentPath = location.pathname;
  let breadcrumbGroup = "";
  let breadcrumbPage = "";

  for (const group of NAV_GROUPS) {
    const item = group.items.find((item) => item.path === currentPath);
    if (item) {
      breadcrumbGroup = group.name;
      breadcrumbPage = item.label;
      break;
    }
  }



  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 shadow-md border-b border-blue-500/20">
      <div className="flex items-center justify-between min-h-[75px] py-4">
        <div className="flex flex-col gap-1">
          {/* Breadcrumb */}
          {breadcrumbGroup && (
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-blue-200 uppercase">
              <span>{breadcrumbGroup}</span>
              <span className="text-blue-400">/</span>
              <span className="text-white">{breadcrumbPage}</span>
            </div>
          )}

          {/* Main Title - Only show if manually passed, otherwise breadcrumb is enough */}
          {title && <h1 className="text-2xl font-bold text-white leading-tight">{title}</h1>}
          {description && <p className="text-blue-100 text-xs leading-tight">{description}</p>}
        </div>

        <div className="flex items-center gap-4">
          {actions && <div>{actions}</div>}
          <HeaderUserMenu />
        </div>
      </div>
    </div>
  );
}
