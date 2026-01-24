import { useState, useEffect } from "react";
import { PageHeader } from "../components/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ArtistTable } from "./components/ArtistTable";
import { ArtistFormDialog } from "./components/ArtistFormDialog";
import { artistService } from "@/services/music/musicService";
import type { ArtistResponse } from "@/types/music";
import { toast } from "sonner";
import { SearchBar } from "@/components/common/SearchBar";
import { DataTableWrapper } from "@/components/common/DataTableWrapper";
import Pagination from "@/components/custom/Pagination";
import { usePagination } from "@/hooks/use-pagination";

export default function ArtistManagementPage() {
  const [artists, setArtists] = useState<ArtistResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState<ArtistResponse | null>(
    null
  );
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
  } = usePagination(6);

  const fetchArtists = async () => {
    try {
      setLoading(true);
      const data = await artistService.getAll();
      setArtists(data);
    } catch (error) {
      toast.error("Không thể tải danh sách nghệ sĩ");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const filteredArtists = artists.filter((artist) =>
    artist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Update pagination info when filtered data changes
  useEffect(() => {
    setTotalElements(filteredArtists.length);
    setTotalPages(Math.ceil(filteredArtists.length / itemsPerPage));
  }, [filteredArtists.length, itemsPerPage, setTotalElements, setTotalPages]);

  const paginatedArtists = filteredArtists.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreate = () => {
    setEditingArtist(null);
    setDialogOpen(true);
  };

  const handleEdit = (artist: ArtistResponse) => {
    setEditingArtist(artist);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await artistService.softDelete(id);
      toast.success("Đã xóa nghệ sĩ");
      fetchArtists();
    } catch (error) {
      toast.error("Không thể xóa nghệ sĩ");
      console.error(error);
    }
  };

  const handleSuccess = () => {
    setDialogOpen(false);
    fetchArtists();
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <div className="flex-1 overflow-auto">
      <PageHeader
        title="Quản lý Nghệ sĩ"
        description="Quản lý thông tin nghệ sĩ"
      />

      <SearchBar
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Tìm kiếm theo tên nghệ sĩ..."
        actions={
          <Button variant="outline" onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm nghệ sĩ
          </Button>
        }
      />

      <div className="px-8 pb-8">
        <DataTableWrapper
          isLoading={loading}
          isEmpty={paginatedArtists.length === 0}
          emptyMessage="Không tìm thấy nghệ sĩ nào."
        >
          <ArtistTable
            artists={paginatedArtists}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {filteredArtists.length > 0 && totalPages > 0 && (
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

      <ArtistFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        artist={editingArtist}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
