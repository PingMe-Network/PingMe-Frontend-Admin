import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { BlogReviewResponse } from "@/types/blog/blog";
import { CATEGORY_LABELS } from "@/utils/blogFieldHandler";
import { formatRelativeTime } from "@/utils/dateFormatter";
import { Badge } from "@/components/ui/badge";

interface BlogManagementTableProps {
  blogs: BlogReviewResponse[];
  onDelete: (id: number) => void;
  onApprove: (id: number) => void;
}

export const BlogManagementTable = ({
  blogs,
  onDelete,
  onApprove,
}: BlogManagementTableProps) => {
  const navigate = useNavigate();

  const handleViewDetails = (id: number) => {
    navigate(`/blogs/${id}`);
  };

  return (
    <div className="rounded-lg border border-blue-100 overflow-hidden bg-white shadow-sm">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-blue-100 to-cyan-100 hover:from-blue-100 hover:to-cyan-100">
            <TableHead className="font-semibold text-blue-900">
              Tiêu đề
            </TableHead>
            <TableHead className="font-semibold text-blue-900">
              Danh mục
            </TableHead>
            <TableHead className="font-semibold text-blue-900">
              Tác giả
            </TableHead>
            <TableHead className="font-semibold text-blue-900">
              Trạng thái
            </TableHead>
            <TableHead className="font-semibold text-blue-900">
              Ngày tạo
            </TableHead>
            <TableHead className="font-semibold text-blue-900">
              Hành động
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogs.length === 0 ? (
            <TableRow className="bg-gradient-to-r from-blue-100 to-cyan-100 hover:from-blue-100 hover:to-cyan-100">
              <TableCell
                colSpan={6}
                className="text-center py-8 text-muted-foreground"
              >
                Không có blog nào
              </TableCell>
            </TableRow>
          ) : (
            blogs.map((blog) => (
              <TableRow
                key={blog.id}
                className="hover:bg-blue-50/50 transition-colors"
              >
                <TableCell className="font-medium truncate">
                  {blog.title}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="border-blue-200 text-blue-700"
                  >
                    {CATEGORY_LABELS[blog.category]}
                  </Badge>
                </TableCell>
                <TableCell className="truncate">{blog.user.name}</TableCell>
                <TableCell>
                  {blog.isApproved ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      Đã duyệt
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                      Chờ duyệt
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatRelativeTime(blog.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(blog.id)}
                      className="h-8 w-8 p-0 hover:bg-blue-500 hover:text-white font-medium"
                      title="Xem chi tiết"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(blog.id)}
                      className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700"
                      title="Xóa"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {!blog.isApproved && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onApprove(blog.id)}
                        className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-700"
                        title="Duyệt bài"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
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
