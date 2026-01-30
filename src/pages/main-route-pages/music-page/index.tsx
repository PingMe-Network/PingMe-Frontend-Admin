import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SongTable } from "./components/SongTable";
import { SongFormDialog } from "./components/SongFormDialog";
import { songService } from "@/services/music/musicService";
import type { SongResponseWithAllAlbum } from "@/types/music";
import { toast } from "sonner";
import { SearchBar } from "@/components/common/SearchBar";
import { DataTableWrapper } from "@/components/common/DataTableWrapper";
import Pagination from "@/components/custom/Pagination";
import { usePagination } from "@/hooks/use-pagination";

export default function MusicManagementPage() {
  const [songs, setSongs] = useState<SongResponseWithAllAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSong, setEditingSong] =
    useState<SongResponseWithAllAlbum | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    currentPage,
    itemsPerPage,
    totalElements,
    totalPages,
    setCurrentPage,
    setItemsPerPage,
    setTotalElements,
    setTotalPages,
  } = usePagination();

  const fetchSongs = useCallback(async () => {
    try {
      setLoading(true);
      const pageResponse = await songService.getAll(
        currentPage, // Send 1-based index to match other services/backend
        itemsPerPage,
        "title",
        "ASC"
      );
      setSongs(pageResponse.content);
      setTotalElements(pageResponse.totalElements);
      setTotalPages(pageResponse.totalPages);
    } catch (error) {
      toast.error("Không thể tải danh sách bài hát");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, setTotalElements, setTotalPages]);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  const filteredSongs = searchQuery
    ? (songs || []).filter(
      (song) =>
        song?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song?.mainArtist?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : songs;

  // Update pagination when search is active (client-side filtering)
  useEffect(() => {
    if (searchQuery) {
      setTotalElements(filteredSongs.length);
      setTotalPages(Math.ceil(filteredSongs.length / itemsPerPage));
    }
  }, [searchQuery, filteredSongs.length, itemsPerPage, setTotalElements, setTotalPages]);

  const paginatedSongs = searchQuery
    ? filteredSongs.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    )
    : songs;

  const handleCreate = () => {
    setEditingSong(null);
    setDialogOpen(true);
  };

  const handleEdit = (song: SongResponseWithAllAlbum) => {
    setEditingSong(song);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await songService.softDelete(id);
      toast.success("Đã xóa bài hát");
      fetchSongs();
    } catch (error) {
      toast.error("Không thể xóa bài hát");
      console.error(error);
    }
  };

  const handleSuccess = () => {
    setDialogOpen(false);
    fetchSongs();
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <div className="flex-1 overflow-auto">


      <SearchBar
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Tìm kiếm theo tên bài hát hoặc nghệ sĩ..."
        actions={
          <Button variant="outline" onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm bài hát
          </Button>
        }
      />

      <div className="px-8 pb-8">
        <DataTableWrapper
          isLoading={loading}
          isEmpty={paginatedSongs.length === 0}
          emptyMessage="Không tìm thấy bài hát nào."
        >
          <SongTable
            songs={paginatedSongs}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {filteredSongs.length > 0 && totalPages > 0 && (
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

      <SongFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        song={editingSong}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
