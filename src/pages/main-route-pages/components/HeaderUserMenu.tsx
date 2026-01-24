import { LogOut } from "lucide-react";
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
import { cn } from "@/lib/utils";

export function HeaderUserMenu() {
    const dispatch = useAppDispatch();
    const { userSession } = useAppSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className={cn(
                        "flex items-center gap-3 rounded-lg transition-colors hover:bg-white/10 p-2 group",
                    )}
                >
                    <div className="flex flex-col items-end mr-1">
                        <p className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors">
                            {userSession?.name || "Admin"}
                        </p>
                        <p className="text-xs text-blue-100 group-hover:text-white/80 transition-colors">
                            {userSession?.roleName || "Administrator"}
                        </p>
                    </div>
                    <Avatar className="h-9 w-9 ring-2 ring-white/20 group-hover:ring-white/40 transition-all">
                        <AvatarImage
                            src={userSession?.avatarUrl || undefined}
                            alt={userSession?.name || "Admin"}
                        />
                        <UserAvatarFallback name={userSession?.name} size="sm" />
                    </Avatar>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2">
                <div className="px-2 py-1.5 text-sm font-semibold text-gray-900 border-b mb-1">
                    {userSession?.email || "admin@pingme.com"}
                </div>
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
    );
}
