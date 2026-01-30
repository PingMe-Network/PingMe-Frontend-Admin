import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NAV_GROUPS } from "@/constants/navigation";

export default function AdminNavigation() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <TooltipProvider>
      <div
        className={cn(
          "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        <div
          className={cn(
            "border-b border-gray-200 flex items-center transition-all duration-300",
            isCollapsed ? "p-3 justify-center" : "p-6 justify-between",
          )}
        >
          {!isCollapsed && (
            <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Ping Admin
            </h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shrink-0 border border-gray-200",
            )}
            aria-label={isCollapsed ? "Mở sidebar" : "Đóng sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-6">
            {NAV_GROUPS.map((group) => (
              <div key={group.name}>
                {!isCollapsed && (
                  <h3 className="px-4 mb-2 text-xs font-bold text-gray-900 uppercase tracking-wider">
                    {group.name}
                  </h3>
                )}
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    const linkContent = (
                      <Link
                        to={item.path}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium",
                          isActive
                            ? "bg-blue-100 text-blue-800"
                            : "text-gray-600 hover:bg-blue-50 hover:text-blue-700",
                          isCollapsed && "justify-center px-2",
                        )}
                      >
                        <Icon className="w-5 h-5 shrink-0" />
                        {!isCollapsed && <span>{item.label}</span>}
                      </Link>
                    );

                    return (
                      <li key={item.path}>
                        {isCollapsed ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              {linkContent}
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              <p>{item.label}</p>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          linkContent
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </nav>
      </div>
    </TooltipProvider>
  );
}
