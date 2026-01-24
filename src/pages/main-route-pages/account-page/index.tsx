import { useEffect, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { SearchBar } from "@/components/common/SearchBar";
import { DataTableWrapper } from "@/components/common/DataTableWrapper";
import Pagination from "@/components/custom/Pagination";
import { usePagination } from "@/hooks/use-pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AccountManagementTable } from "./components/AccountManagementTable";
import type {
  AccountFilterType,
  AccountStatusType,
  UserSummaryResponse,
} from "@/types/common/userSummary";
import { toast } from "sonner";
import {
  getAllUsers,
  updateAccountStatus,
} from "@/services/admin/userManagementApi.ts";
import { UpdateStatusDialog } from "./components/UpdateStatusDialog";
import { ConfirmDialog } from "@/components/custom/ConfirmDialog";

export default function AccountManagementPage() {
  const [users, setUsers] = useState<UserSummaryResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<AccountFilterType>("ALL");

  const {
    currentPage,
    itemsPerPage,
    totalElements,
    totalPages,
    setCurrentPage,
    setItemsPerPage,
    setTotalElements,
    setTotalPages,
  } = usePagination(7);

  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSummaryResponse | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await getAllUsers({
        page: currentPage,
        size: itemsPerPage,
        filter: "name,desc",
        search: searchQuery,
        status: selectedStatus,
      });

      if (!response.data.errorCode && response.data.data) {
        const pageData = response.data.data;
        setUsers(pageData.content);
        setTotalPages(pageData.totalPages);
        setTotalElements(pageData.totalElements);
      } else {
        setUsers([]);
        setTotalPages(0);
        setTotalElements(0);
        toast.error(response.data.errorMessage || "Lỗi tải dữ liệu");
      }
    } catch (error) {
      console.error(error);
      toast.error("Không thể kết nối đến server");
      setUsers([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage, searchQuery, selectedStatus]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleStatusChange = (val: AccountFilterType) => {
    setSelectedStatus(val);
    setCurrentPage(1);
  };

  const handleOpenUpdateStatus = (user: UserSummaryResponse) => {
    setSelectedUser(user);
    setIsUpdateDialogOpen(true);
  };

  // --- LOGIC GỌI API CHUNG ---
  // Hàm này dùng để gọi API cập nhật trạng thái cho mọi trường hợp
  const performUpdateStatus = async (id: number, status: AccountStatusType) => {
    try {
      // Gọi API patch/put
      const response = await updateAccountStatus(id, status);
      console.log(response);

      const isSuccess = response.data.data === true;

      if (isSuccess) {
        toast.success(`Cập nhật trạng thái ${status} thành công!`);
        fetchUsers();
      } else {
        toast.error(response.data.errorMessage || "Lỗi cập nhật trạng thái");
      }
    } catch (error) {
      toast.error("Lỗi kết nối: " + error);
    }
  };

  // --- LOGIC KHI BẤM NÚT LƯU TRONG DIALOG CẬP NHẬT ---
  const handleRequestUpdateStatus = async (
    userId: number,
    newStatus: AccountStatusType
  ) => {
    // 1. Nếu chọn DEACTIVATED -> Mở Confirm Dialog (chưa gọi API vội)
    if (newStatus === "DEACTIVATED") {
      setIsUpdateDialogOpen(false); // Đóng dialog chọn
      setPendingDeleteId(userId); // Lưu ID
      setIsConfirmOpen(true); // Mở dialog xác nhận
      return;
    }

    // 2. Nếu chọn ACTIVE hoặc SUSPENDED -> Gọi API luôn
    // Đóng dialog trước khi gọi API cho mượt
    setIsUpdateDialogOpen(false);
    await performUpdateStatus(userId, newStatus);
  };

  // --- LOGIC KHI BẤM XÁC NHẬN VÔ HIỆU HÓA ---
  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      setIsDeleting(true);
      // Gọi API với trạng thái DEACTIVATED
      await performUpdateStatus(pendingDeleteId, "DEACTIVATED");
      setIsConfirmOpen(false); // Đóng dialog xác nhận
    } finally {
      setIsDeleting(false);
      setPendingDeleteId(null);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <PageHeader
        title="Quản lý tài khoản"
        description={`Quản lý ${totalElements} người dùng và trạng thái tài khoản`}
      />

      <SearchBar
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Tìm kiếm theo tên hoặc email..."
        actions={
          <Select
            value={selectedStatus}
            onValueChange={(val) => handleStatusChange(val as AccountFilterType)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
              <SelectItem value="ACTIVE">Hoạt động</SelectItem>
              <SelectItem value="SUSPENDED">Tạm khóa</SelectItem>
              <SelectItem value="DEACTIVATED">Bị khóa</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <div className="px-8 pb-8">
        <DataTableWrapper
          isLoading={isLoading}
          isEmpty={users.length === 0}
          emptyMessage="Không tìm thấy kết quả nào."
        >
          <AccountManagementTable
            users={users}
            onViewDetails={(id) => console.log(id)}
            onEditStatus={handleOpenUpdateStatus}
          />

          {totalElements > 0 && totalPages > 0 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                totalElements={totalElements}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                showItemsPerPageSelect={true}
              />
            </div>
          )}
        </DataTableWrapper>
      </div>

      <UpdateStatusDialog
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
        user={selectedUser}
        onConfirm={handleRequestUpdateStatus}
      />

      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Xác nhận vô hiệu hóa?"
        description="Hành động này sẽ vô hiệu hóa tài khoản người dùng này. Bạn có chắc chắn muốn tiếp tục?"
        onConfirm={handleConfirmDelete}
        confirmLabel="Vô hiệu hóa ngay"
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
}
