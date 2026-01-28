import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, User } from "lucide-react";
import type { ArtistResponse } from "@/types/music";
import { DeleteConfirmDialog } from "@/components/custom/DeleteConfirmationDialog";
import { EmptyState } from "@/components/custom/EmptyState";

interface ArtistTableProps {
  artists: ArtistResponse[];
  onEdit: (artist: ArtistResponse) => void;
  onDelete: (id: number) => void;
}

export function ArtistTable({ artists, onEdit, onDelete }: Readonly<ArtistTableProps>) {
  if (!artists || artists.length === 0) {
    return (
      <EmptyState
        icon={User}
        title="Chưa có nghệ sĩ"
        description="Thêm nghệ sĩ đầu tiên để bắt đầu"
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-500 hover:to-blue-600">
            <TableHead className="text-white font-semibold">Ảnh</TableHead>
            <TableHead className="text-white font-semibold">Tên nghệ sĩ</TableHead>
            <TableHead className="text-white font-semibold">Tiểu sử</TableHead>
            <TableHead className="text-white font-semibold">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {artists.map((artist) => (
            <TableRow key={artist.id}>
              <TableCell>
                <img
                  src={artist.imgUrl || "/placeholder.svg?height=40&width=40"}
                  alt={artist.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </TableCell>
              <TableCell className="font-medium truncate">
                {artist.name}
              </TableCell>
              <TableCell className="truncate">
                {artist.bio}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(artist)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <DeleteConfirmDialog
                    onConfirm={() => onDelete(artist.id)}
                    title="Xóa nghệ sĩ"
                    description="Bạn có chắc chắn muốn xóa nghệ sĩ này không?"
                  >
                    <Button variant="ghost" size="icon">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </DeleteConfirmDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
