import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AlbumTable } from "./components/AlbumTable";
import { AlbumFormDialog } from "./components/AlbumFormDialog";
import { albumService } from "@/services/music/musicService";
import type { AlbumResponse } from "@/types/music";
import { toast } from "sonner";
import { SearchBar } from "@/components/common/SearchBar";
import { DataTableWrapper } from "@/components/common/DataTableWrapper";
import Pagination from "@/components/custom/Pagination";
import { usePagination } from "@/hooks/use-pagination";

export default function AlbumManagementPage() {
  const [albums, setAlbums] = useState<AlbumResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<AlbumResponse | null>(null);
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

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const data = await albumService.getAll();
      setAlbums(data);
    } catch (error) {
      toast.error("Không thể tải danh sách album");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const filteredAlbums = albums.filter((album) =>
    album.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setTotalElements(filteredAlbums.length);
    setTotalPages(Math.ceil(filteredAlbums.length / itemsPerPage));
  }, [filteredAlbums.length, itemsPerPage, setTotalElements, setTotalPages]);

  const paginatedAlbums = filteredAlbums.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreate = () => {
    setEditingAlbum(null);
    setDialogOpen(true);
  };

  const handleEdit = (album: AlbumResponse) => {
    setEditingAlbum(album);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await albumService.softDelete(id);
      toast.success("Đã xóa album");
      fetchAlbums();
    } catch (error) {
      toast.error("Không thể xóa album");
      console.error(error);
    }
  };

  const handleSuccess = () => {
    setDialogOpen(false);
    fetchAlbums();
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
        placeholder="Tìm kiếm theo tên album..."
        actions={
          <Button variant="outline" onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm album
          </Button>
        }
      />

      <div className="px-8 pb-8">
        <DataTableWrapper
          isLoading={loading}
          isEmpty={paginatedAlbums.length === 0}
          emptyMessage="Không tìm thấy album nào."
        >
          <AlbumTable
            albums={paginatedAlbums}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {filteredAlbums.length > 0 && totalPages > 0 && (
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

      <AlbumFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        album={editingAlbum}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
