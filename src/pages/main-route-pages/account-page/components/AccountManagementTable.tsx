import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Edit } from "lucide-react";
import { getUserInitials } from "@/utils/authFieldHandler";
import type { UserSummaryResponse } from "@/types/common/userSummary";
import { UserStatusBadge } from "./UserStatusBadge";

interface AccountManagementTableProps {
  users: UserSummaryResponse[];
  onViewDetails: (id: number) => void;
  onEditStatus: (user: UserSummaryResponse) => void;
}

export const AccountManagementTable = ({
  users,
  onViewDetails,
  onEditStatus,
}: AccountManagementTableProps) => {
  return (
    <div className="rounded-lg border border-blue-100 overflow-hidden bg-white shadow-sm">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-500 hover:to-blue-600">
            <TableHead className="font-semibold text-white min-w-[250px]">
              Người dùng
            </TableHead>
            <TableHead className="font-semibold text-white">
              Email
            </TableHead>
            <TableHead className="font-semibold text-white w-[150px]">
              Trạng thái
            </TableHead>
            <TableHead className="font-semibold text-white w-[120px] text-center">
              Hành động
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-500 hover:to-blue-600">
              <TableCell
                colSpan={4}
                className="text-center py-8 text-muted-foreground"
              >
                Không có người dùng nào
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow
                key={user.id}
                className="hover:bg-blue-50/50 transition-colors"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatarUrl || "/placeholder.svg"} />
                      <AvatarFallback>
                        {getUserInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium truncate">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground truncate">
                  {user.email}
                </TableCell>

                <TableCell>
                  <UserStatusBadge status={user.accountStatus} />
                </TableCell>

                <TableCell className="text-center">
                  <div className="flex justify-center items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(user.id)}
                      className="h-8 w-8 p-0 hover:bg-blue-500 hover:text-white font-medium"
                      title="Xem chi tiết"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditStatus(user)}
                      className="h-8 w-8 p-0 hover:bg-blue-500 hover:text-white font-medium"
                      title="Cập nhật trạng thái"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
