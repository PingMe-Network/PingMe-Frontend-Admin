import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { GenreTable } from "./components/GenreTable";
import { GenreFormDialog } from "./components/GenreFormDialog";
import { genreService } from "@/services/music/musicService";
import type { GenreResponse } from "@/types/music";
import { toast } from "sonner";
import { SearchBar } from "@/components/common/SearchBar";
import { DataTableWrapper } from "@/components/common/DataTableWrapper";
import Pagination from "@/components/custom/Pagination";
import { usePagination } from "@/hooks/use-pagination";

export default function GenreManagementPage() {
  const [genres, setGenres] = useState<GenreResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState<GenreResponse | null>(null);
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

  const fetchGenres = useCallback(async () => {
    try {
      setLoading(true);
      const pageResponse = await genreService.getAll(
        currentPage, // Send 1-based index
        itemsPerPage
      );
      setGenres(pageResponse.content);
      setTotalElements(pageResponse.totalElements);
      setTotalPages(pageResponse.totalPages);
    } catch (error) {
      toast.error("Không thể tải danh sách thể loại");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, setTotalElements, setTotalPages]);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  const filteredGenres = searchQuery
    ? genres.filter((genre) =>
      genre.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : genres;

  // Update pagination when search is active (client-side filtering)
  useEffect(() => {
    if (searchQuery) {
      setTotalElements(filteredGenres.length);
      setTotalPages(Math.ceil(filteredGenres.length / itemsPerPage));
    }
  }, [searchQuery, filteredGenres.length, itemsPerPage, setTotalElements, setTotalPages]);

  const paginatedGenres = searchQuery
    ? filteredGenres.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    )
    : genres;

  const handleCreate = () => {
    setEditingGenre(null);
    setDialogOpen(true);
  };

  const handleEdit = (genre: GenreResponse) => {
    setEditingGenre(genre);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await genreService.softDelete(id);
      toast.success("Đã xóa thể loại");
      fetchGenres();
    } catch (error) {
      toast.error("Không thể xóa thể loại");
      console.error(error);
    }
  };

  const handleSuccess = () => {
    setDialogOpen(false);
    fetchGenres();
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
        placeholder="Tìm kiếm theo tên thể loại..."
        actions={
          <Button variant="outline" onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm thể loại
          </Button>
        }
      />

      <div className="px-8 pb-8">
        <DataTableWrapper
          isLoading={loading}
          isEmpty={paginatedGenres.length === 0}
          emptyMessage="Không tìm thấy thể loại nào."
        >
          <GenreTable
            genres={paginatedGenres}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {filteredGenres.length > 0 && totalPages > 0 && (
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

      <GenreFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        genre={editingGenre}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
