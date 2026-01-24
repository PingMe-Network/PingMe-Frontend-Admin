import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Users,
  FileText,
  BarChart3,
  Music,
  Disc3,
  User,
  Tag,
  ChevronLeft,
  ChevronRight,
  Video,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/features/hooks";
import { logout } from "@/features/slices/authThunk";
import { UserAvatarFallback } from "@/components/custom/UserAvatarFallback";

const navGroups = [
  {
    name: "Ping Profile",
    items: [
      {
        path: "/admin/accounts",
        label: "Quản lý tài khoản",
        icon: Users,
      },
    ],
  },
  {
    name: "Ping Blog",
    items: [
      {
        path: "/admin/blogs",
        label: "Quản lý blog",
        icon: FileText,
      },
    ],
  },
  {
    name: "Ping Music",
    items: [
      {
        path: "/admin/music",
        label: "Quản lý nhạc",
        icon: Music,
      },
      {
        path: "/admin/albums",
        label: "Quản lý album",
        icon: Disc3,
      },
      {
        path: "/admin/artists",
        label: "Quản lý nghệ sĩ",
        icon: User,
      },
      {
        path: "/admin/genres",
        label: "Quản lý thể loại",
        icon: Tag,
      },
    ],
  },
  {
    name: "Ping Reel",
    items: [
      {
        path: "/admin/reels",
        label: "Quản lý reels",
        icon: Video,
      },
    ],
  },
  {
    name: "Thống kê",
    items: [
      {
        path: "/admin/statistics",
        label: "Thống kê",
        icon: BarChart3,
      },
    ],
  },
];

export default function AdminNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userSession } = useAppSelector((state) => state.auth);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth");
  };

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
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Ping Admin
            </h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors flex-shrink-0 border border-gray-200",
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
            {navGroups.map((group) => (
              <div key={group.name}>
                {!isCollapsed && (
                  <h3 className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
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
                          "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                          isActive
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-700 hover:bg-gray-50",
                          isCollapsed && "justify-center px-2",
                        )}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
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

        {/* User Menu */}
        <div className="p-4 border-t border-gray-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-3 w-full rounded-lg transition-colors hover:bg-gray-50 p-2",
                  isCollapsed && "justify-center",
                )}
              >
                <Avatar className="h-9 w-9 ring-2 ring-blue-100">
                  <AvatarImage
                    src={userSession?.avatarUrl || undefined}
                    alt={userSession?.name || "Admin"}
                  />
                  <UserAvatarFallback name={userSession?.name} size="sm" />
                </Avatar>
                {!isCollapsed && (
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {userSession?.name || "Admin"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {userSession?.email || "admin@pingme.com"}
                    </p>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align={isCollapsed ? "center" : "start"}
              side="top"
              className="w-56 mb-2"
            >
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-3 text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
                  <LogOut className="h-4 w-4 text-red-600" />
                </div>
                <span className="font-medium">Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </TooltipProvider>
  );
}
