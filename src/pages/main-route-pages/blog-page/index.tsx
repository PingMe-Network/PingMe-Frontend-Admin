import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "../components/PageHeader";
import { BlogManagementTable } from "./components/BlogManagementTable";
import Pagination from "@/components/custom/Pagination";
import { DataTableWrapper } from "@/components/common/DataTableWrapper";
import { SearchBar } from "@/components/common/SearchBar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllBlogs, approveBlog, deleteBlog } from "@/services/blog/blogApi.ts";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorMessageHandler";
import { useDebounce } from "@/hooks/use-debounce";
import { usePagination } from "@/hooks/use-pagination";
import type { BlogReviewResponse } from "@/types/blog/blog.ts";

export default function BlogManagementPage() {
  const [blogs, setBlogs] = useState<BlogReviewResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const {
    currentPage,
    itemsPerPage,
    totalElements,
    totalPages,
    setCurrentPage,
    setItemsPerPage,
    setTotalElements,
    setTotalPages,
    resetPagination,
  } = usePagination(10);

  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const filters: string[] = [];

      if (debouncedSearchQuery.trim()) {
        filters.push(`title ~ '*${debouncedSearchQuery.trim()}*'`);
      }

      if (selectedCategory !== "all") {
        filters.push(`category = '${selectedCategory}'`);
      }

      if (selectedStatus !== "all") {
        const isApproved = selectedStatus === "approved";
        filters.push(`isApproved = ${isApproved}`);
      }

      const filter = filters.length > 0 ? filters.join(" and ") : undefined;

      const response = await getAllBlogs({
        page: currentPage,
        size: itemsPerPage,
        filter,
      });

      setBlogs(response.data.data.content);
      setTotalElements(response.data.data.totalElements);
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      toast.error(getErrorMessage(error, "Không thể tải danh sách blog"));
    } finally {
      setIsLoading(false);
    }
  }, [
    debouncedSearchQuery,
    selectedCategory,
    selectedStatus,
    currentPage,
    itemsPerPage,
    setTotalElements,
    setTotalPages,
  ]);

  useEffect(() => {
    resetPagination();
  }, [debouncedSearchQuery, selectedCategory, selectedStatus, resetPagination]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDelete = async (blogId: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa blog này?")) {
      return;
    }

    try {
      await deleteBlog(blogId);
      toast.success("Xóa blog thành công");
      fetchBlogs();
    } catch (error) {
      toast.error(getErrorMessage(error, "Không thể xóa blog"));
    }
  };

  const handleApprove = async (blogId: number) => {
    try {
      await approveBlog(blogId);
      toast.success("Duyệt blog thành công");
      fetchBlogs();
    } catch (error) {
      toast.error(getErrorMessage(error, "Không thể duyệt blog"));
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <PageHeader
        title="Quản lý blog"
        description="Duyệt và quản lý các bài viết blog"
      />

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Tìm kiếm theo tiêu đề blog..."
        actions={
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                <SelectItem value="MUSIC">Âm nhạc</SelectItem>
                <SelectItem value="ARTIST">Nghệ sĩ</SelectItem>
                <SelectItem value="LIFESTYLE">Phong cách sống</SelectItem>
                <SelectItem value="TECHNOLOGY">Công nghệ</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="approved">Đã duyệt</SelectItem>
                <SelectItem value="pending">Chờ duyệt</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />

      <div className="px-8 pb-8">
        <DataTableWrapper
          isLoading={isLoading}
          isEmpty={blogs.length === 0}
          emptyMessage="Không tìm thấy blog nào."
        >
          <BlogManagementTable
            blogs={blogs}
            onDelete={handleDelete}
            onApprove={handleApprove}
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
    </div>
  );
}
