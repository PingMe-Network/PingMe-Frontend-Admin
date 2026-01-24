import { Play, Eye, Heart, MessageCircle, Bookmark, Calendar, User, Info, Trash2, EyeOff, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { AdminReel } from "@/types/reels"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { EmptyState } from "@/components/custom/EmptyState"

interface ReelTableProps {
    reels: AdminReel[]
    onViewDetails: (id: number) => void
    onPreviewVideo: (url: string) => void
    onHide: (id: number) => void
    onUnhide: (id: number) => void
    onDelete: (id: number) => void
}

export function ReelTable({
    reels,
    onViewDetails,
    onPreviewVideo,
    onHide,
    onUnhide,
    onDelete,
}: ReelTableProps) {
    if (!reels || reels.length === 0) {
        return (
            <EmptyState
                icon={Play}
                title="Không tìm thấy reel nào"
                description="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
            />
        )
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table className="w-full">
                <TableHeader>
                    <TableRow className="bg-gradient-to-r from-blue-100 to-cyan-100 hover:from-blue-100 hover:to-cyan-100">
                        <TableHead>ID</TableHead>
                        <TableHead>Video</TableHead>
                        <TableHead>Caption</TableHead>
                        <TableHead>Người đăng</TableHead>
                        <TableHead>Thống kê</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Ngày tạo</TableHead>
                        <TableHead>Hành động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reels.map((reel) => (
                        <TableRow key={reel.id} className="hover:bg-blue-50/50 transition-colors">
                            <TableCell className="font-medium">#{reel.id}</TableCell>

                            {/* Video Preview */}
                            <TableCell>
                                <button
                                    onClick={() => onPreviewVideo(reel.videoUrl)}
                                    className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 hover:ring-2 hover:ring-blue-500 transition-all group"
                                >
                                    <video
                                        src={reel.videoUrl}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Play className="w-6 h-6 text-white" />
                                    </div>
                                </button>
                            </TableCell>

                            {/* Caption */}
                            <TableCell>
                                <p className="text-sm line-clamp-2 truncate">{reel.caption}</p>
                            </TableCell>

                            {/* User */}
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    {reel.userAvatarUrl ? (
                                        <img
                                            src={reel.userAvatarUrl}
                                            alt={reel.userName}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                            <User className="w-4 h-4 text-gray-500" />
                                        </div>
                                    )}
                                    <span className="text-sm font-medium truncate">{reel.userName}</span>
                                </div>
                            </TableCell>

                            {/* Stats */}
                            <TableCell>
                                <div className="flex flex-col gap-1 text-xs">
                                    <div className="flex items-center gap-1 text-gray-600">
                                        <Eye className="w-3 h-3" />
                                        <span>{reel.viewCount}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-red-600">
                                        <Heart className="w-3 h-3" />
                                        <span>{reel.likeCount}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-blue-600">
                                        <MessageCircle className="w-3 h-3" />
                                        <span>{reel.commentCount}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-yellow-600">
                                        <Bookmark className="w-3 h-3" />
                                        <span>{reel.saveCount}</span>
                                    </div>
                                </div>
                            </TableCell>

                            {/* Status */}
                            <TableCell>
                                {reel.status ? (
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${reel.status === "ACTIVE"
                                            ? "bg-green-100 text-green-800"
                                            : reel.status === "HIDDEN"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-gray-100 text-gray-800"
                                            }`}
                                    >
                                        {reel.status === "ACTIVE"
                                            ? "Chấp nhận"
                                            : reel.status === "HIDDEN"
                                                ? "Từ chối"
                                                : reel.status}
                                    </span>
                                ) : (
                                    <span className="text-xs text-gray-400">Chưa xác định</span>
                                )}
                            </TableCell>

                            {/* Created At */}
                            <TableCell>
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                    <Calendar className="w-3 h-3" />
                                    <span>
                                        {formatDistanceToNow(new Date(reel.createdAt), {
                                            addSuffix: true,
                                            locale: vi,
                                        })}
                                    </span>
                                </div>
                            </TableCell>

                            {/* Actions */}
                            <TableCell>
                                <div className="flex gap-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onViewDetails(reel.id)}
                                        className="h-8 w-8 p-0"
                                        title="Xem chi tiết"
                                    >
                                        <Info className="w-4 h-4" />
                                    </Button>
                                    {reel.status === "HIDDEN" ? (
                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={() => onUnhide(reel.id)}
                                            className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                                            title="Hiển thị lại"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => onHide(reel.id)}
                                            className="h-8 w-8 p-0"
                                            title="Ẩn reel"
                                        >
                                            <EyeOff className="w-4 h-4" />
                                        </Button>
                                    )}
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => onDelete(reel.id)}
                                        className="h-8 w-8 p-0"
                                        title="Xóa vĩnh viễn"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
