import { useState, useEffect, useCallback } from "react"
import { SearchBar } from "@/components/common/SearchBar"
import { DataTableWrapper } from "@/components/common/DataTableWrapper"
import Pagination from "@/components/custom/Pagination"
import { ReelTable } from "./components/ReelTable"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Filter } from "lucide-react"
import { reelsApi } from "@/services/reels"
import type { AdminReel } from "@/types/reels"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import ReelDetailModal from "./ReelDetailModal"

export default function ReelManagementPage() {
  const [reels, setReels] = useState<AdminReel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [captionFilter, setCaptionFilter] = useState("")
  const [userIdFilter, setUserIdFilter] = useState("")
  const [minViewsFilter, setMinViewsFilter] = useState("")
  const [maxViewsFilter, setMaxViewsFilter] = useState("")
  const [fromDateFilter, setFromDateFilter] = useState("")
  const [toDateFilter, setToDateFilter] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null)
  const [selectedReelId, setSelectedReelId] = useState<number | null>(null)
  const [deleteReelId, setDeleteReelId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [hideReelId, setHideReelId] = useState<number | null>(null)
  const [hideReason, setHideReason] = useState("")
  const [isHiding, setIsHiding] = useState(false)

  const fetchReels = useCallback(async (
    page: number,
    size: number,
    caption?: string,
    userId?: number,
    minViews?: number,
    maxViews?: number,
    from?: string,
    to?: string
  ) => {
    try {
      setIsLoading(true)
      const data = await reelsApi.getAdminReels(page, size, caption, userId, minViews, maxViews, from, to)
      setReels(data.content)
      setCurrentPage(data.page)
      setTotalPages(data.totalPages)
      setTotalElements(data.totalElements)
    } catch (err) {
      console.error("Error fetching admin reels:", err)
      toast.error("Không thể tải danh sách reels")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const userId = userIdFilter ? Number(userIdFilter) : undefined
    const minViews = minViewsFilter ? Number(minViewsFilter) : undefined
    const maxViews = maxViewsFilter ? Number(maxViewsFilter) : undefined
    const from = fromDateFilter ? `${fromDateFilter}T00:00:00` : undefined
    const to = toDateFilter ? `${toDateFilter}T23:59:59` : undefined

    fetchReels(currentPage, pageSize, captionFilter, userId, minViews, maxViews, from, to)
  }, [currentPage, pageSize, captionFilter, userIdFilter, minViewsFilter, maxViewsFilter, fromDateFilter, toDateFilter, fetchReels])

  const handleCaptionFilterChange = (value: string) => {
    setCaptionFilter(value)
    setCurrentPage(0)
  }

  const refreshReels = () => {
    const caption = captionFilter.trim() || undefined
    const userId = userIdFilter ? Number(userIdFilter) : undefined
    const minViews = minViewsFilter ? Number(minViewsFilter) : undefined
    const maxViews = maxViewsFilter ? Number(maxViewsFilter) : undefined
    const from = fromDateFilter ? `${fromDateFilter}T00:00:00` : undefined
    const to = toDateFilter ? `${toDateFilter}T23:59:59` : undefined
    fetchReels(currentPage, pageSize, caption, userId, minViews, maxViews, from, to)
  }

  const handleHardDelete = async () => {
    if (!deleteReelId) return

    try {
      setIsDeleting(true)
      await reelsApi.hardDeleteAdminReel(deleteReelId)
      toast.success("Đã xóa vĩnh viễn reel thành công")
      setDeleteReelId(null)
      refreshReels()
    } catch (error) {
      console.error("Error deleting reel:", error)
      toast.error("Không thể xóa reel")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleHideReel = async () => {
    if (!hideReelId) return

    try {
      setIsHiding(true)
      await reelsApi.hideAdminReel(hideReelId, hideReason.trim() || undefined)
      toast.success("Đã ẩn reel thành công")
      setHideReelId(null)
      setHideReason("")
      refreshReels()
    } catch (error) {
      console.error("Error hiding reel:", error)
      toast.error("Không thể ẩn reel")
    } finally {
      setIsHiding(false)
    }
  }

  const handleUnhideReel = async (reelId: number) => {
    try {
      await reelsApi.unhideAdminReel(reelId)
      toast.success("Đã hiển thị lại reel thành công")
      refreshReels()
    } catch (error) {
      console.error("Error unhiding reel:", error)
      toast.error("Không thể hiển thị lại reel")
    }
  }

  const filteredReels = reels.filter((reel) => {
    const matchesStatus = selectedStatus === "all" || reel.status === selectedStatus
    return matchesStatus
  })

  return (
    <div className="flex-1 overflow-auto">
      

      <SearchBar
        value={captionFilter}
        onChange={handleCaptionFilterChange}
        placeholder="Tìm kiếm theo caption..."
        actions={
          <div className="flex flex-wrap gap-2">
            <Input
              type="number"
              placeholder="User ID..."
              value={userIdFilter}
              onChange={(e) => { setUserIdFilter(e.target.value); setCurrentPage(0) }}
              className="w-[100px]"
            />
            <Input
              type="number"
              placeholder="Min views..."
              value={minViewsFilter}
              onChange={(e) => { setMinViewsFilter(e.target.value); setCurrentPage(0) }}
              min="0"
              className="w-[120px]"
            />
            <Input
              type="number"
              placeholder="Max views..."
              value={maxViewsFilter}
              onChange={(e) => { setMaxViewsFilter(e.target.value); setCurrentPage(0) }}
              min="0"
              className="w-[120px]"
            />
            <Input
              type="date"
              value={fromDateFilter}
              onChange={(e) => { setFromDateFilter(e.target.value); setCurrentPage(0) }}
              placeholder="Từ ngày..."
              className="w-[150px]"
            />
            <Input
              type="date"
              value={toDateFilter}
              onChange={(e) => { setToDateFilter(e.target.value); setCurrentPage(0) }}
              placeholder="Đến ngày..."
              className="w-[150px]"
            />
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Lọc trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="ACTIVE">Chấp nhận</SelectItem>
                <SelectItem value="HIDDEN">Từ chối</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />

      <div className="px-8 pb-8">
        <DataTableWrapper
          isLoading={isLoading}
          isEmpty={filteredReels.length === 0}
          emptyMessage="Không tìm thấy reel nào. Thử thay đổi bộ lọc."
        >
          <ReelTable
            reels={filteredReels}
            onViewDetails={(id) => setSelectedReelId(id)}
            onPreviewVideo={setPreviewVideoUrl}
            onHide={(id) => setHideReelId(id)}
            onUnhide={handleUnhideReel}
            onDelete={(id) => setDeleteReelId(id)}
          />

          {totalElements > 0 && totalPages > 0 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                totalElements={totalElements}
                itemsPerPage={pageSize}
                setItemsPerPage={setPageSize}
                showItemsPerPageSelect={true}
              />
            </div>
          )}
        </DataTableWrapper>
      </div>

      {/* Video Preview Modal */}
      {previewVideoUrl && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewVideoUrl(null)}
        >
          <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <video
              src={previewVideoUrl}
              controls
              autoPlay
              className="w-full rounded-lg"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
              onClick={() => setPreviewVideoUrl(null)}
            >
              Đóng
            </Button>
          </div>
        </div>
      )}

      {/* Reel Detail Modal */}
      {selectedReelId && (
        <ReelDetailModal
          reelId={selectedReelId}
          onClose={() => setSelectedReelId(null)}
          onDeleted={refreshReels}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteReelId} onOpenChange={() => setDeleteReelId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa vĩnh viễn</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa vĩnh viễn reel này không? Hành động này không thể hoàn tác.
              Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleHardDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Đang xóa..." : "Xóa vĩnh viễn"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Hide Reel Dialog */}
      <Dialog open={!!hideReelId} onOpenChange={() => {
        setHideReelId(null)
        setHideReason("")
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ẩn Reel</DialogTitle>
            <DialogDescription>
              Reel sẽ bị ẩn khỏi người dùng. Bạn có thể thêm lý do (không bắt buộc).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="hideReason">Lý do ẩn (tùy chọn)</Label>
              <Textarea
                id="hideReason"
                placeholder="Nhập lý do ẩn reel này..."
                value={hideReason}
                onChange={(e) => setHideReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setHideReelId(null)
                setHideReason("")
              }}
              disabled={isHiding}
            >
              Hủy
            </Button>
            <Button
              onClick={handleHideReel}
              disabled={isHiding}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isHiding ? "Đang ẩn..." : "Ẩn Reel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
