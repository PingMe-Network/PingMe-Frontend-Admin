import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  totalElements: number;
  itemsPerPage: number;
  setItemsPerPage: (itemsPerPage: number) => void;
  showItemsPerPageSelect?: boolean;
}

const Pagination = ({
  currentPage,
  itemsPerPage,
  setCurrentPage,
  setItemsPerPage,
  totalPages,
  totalElements,
  showItemsPerPageSelect = true,
}: PaginationProps) => {
  const pagination = () => {
    if (totalPages <= 1) return [1];

    const center: (number | string)[] = [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ],
      filteredCenter = center.filter(
        (p) => (p as number) > 1 && (p as number) < totalPages
      ),
      includeThreeLeft = currentPage === 5,
      includeThreeRight = currentPage === totalPages - 4,
      includeLeftDots = currentPage > 5,
      includeRightDots = currentPage < totalPages - 4;

    if (includeThreeLeft) filteredCenter.unshift(2);
    if (includeThreeRight) filteredCenter.push(totalPages - 1);

    if (includeLeftDots) filteredCenter.unshift("...");
    if (includeRightDots) filteredCenter.push("...");

    return [1, ...filteredCenter, totalPages];
  };

  const pages = pagination();

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center text-sm text-gray-600">
        Hiển thị{" "}
        <span className="font-medium text-blue-600 mx-1">
          {(currentPage - 1) * itemsPerPage + 1}
        </span>{" "}
        đến{" "}
        <span className="font-medium text-blue-600 mx-1">
          {Math.min(currentPage * itemsPerPage, totalElements)}
        </span>{" "}
        trong tổng số{" "}
        <span className="font-medium text-blue-600 mx-1">{totalElements}</span>{" "}
        kết quả
      </div>

      <div className="flex items-center gap-4">
        {showItemsPerPageSelect && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Hiển thị:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-20 h-8 bg-white border-gray-300 text-gray-700 focus:border-blue-500 focus:ring-blue-500/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 px-3 bg-white border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all duration-200"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Trước
          </Button>

          {pages.map((page, index) =>
            typeof page === "string" && page === "..." ? (
              <span key={index} className="px-2 text-gray-400">
                ...
              </span>
            ) : (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => {
                  if ((page as number) === currentPage) return;
                  setCurrentPage(page as number);
                }}
                className={`h-8 w-8 p-0 transition-all duration-200 ${page === currentPage
                  ? "bg-blue-600 border-blue-600 text-white hover:bg-blue-700 shadow-md"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700"
                  }`}
              >
                {page}
              </Button>
            )
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-8 px-3 bg-white border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all duration-200"
          >
            Sau
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Pagination);
