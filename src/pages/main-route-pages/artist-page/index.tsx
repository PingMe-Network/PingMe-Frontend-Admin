import { useState, useEffect, useCallback } from "react";
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
  } = usePagination();

  const fetchArtists = useCallback(async () => {
    try {
      setLoading(true);
      const pageResponse = await artistService.getAll(
        currentPage, // Send 1-based index
        itemsPerPage
      );
      setArtists(pageResponse.content);
      setTotalElements(pageResponse.totalElements);
      setTotalPages(pageResponse.totalPages);
    } catch (error) {
      toast.error("Không thể tải danh sách nghệ sĩ");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, setTotalElements, setTotalPages]);

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  const filteredArtists = searchQuery
    ? artists.filter((artist) =>
      artist.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : artists;

  // Update pagination when search is active (client-side filtering)
  useEffect(() => {
    if (searchQuery) {
      setTotalElements(filteredArtists.length);
      setTotalPages(Math.ceil(filteredArtists.length / itemsPerPage));
    }
  }, [searchQuery, filteredArtists.length, itemsPerPage, setTotalElements, setTotalPages]);

  const paginatedArtists = searchQuery
    ? filteredArtists.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    )
    : artists;

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
