import { Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilterBarProps {
  timeRange: string;
  setTimeRange: (val: string) => void;
  customStart: string;
  setCustomStart: (val: string) => void;
  customEnd: string;
  setCustomEnd: (val: string) => void;
  onApplyFilter: () => void;
}

export default function FilterBar({
  timeRange,
  setTimeRange,
  customStart,
  setCustomStart,
  customEnd,
  setCustomEnd,
  onApplyFilter,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8">
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-gray-500" />
        <select
          aria-label="Chọn khoảng thời gian lọc"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border-gray-300 rounded-md text-sm font-medium text-gray-700 focus:ring-blue-500 focus:border-blue-500 h-10 px-3 border outline-none cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <option value="7days">7 ngày qua</option>
          <option value="30days">30 ngày qua</option>
          <option value="custom">Tùy chỉnh ngày</option>
        </select>
      </div>

      {timeRange === "custom" && (
        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-4 duration-300">
          <input
            type="date"
            aria-label="Từ ngày"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            className="border-gray-300 rounded-md text-sm h-10 px-3 border outline-none focus:border-blue-500"
          />
          <span className="text-gray-400 text-sm">đến</span>
          <input
            type="date"
            aria-label="Đến ngày"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            className="border-gray-300 rounded-md text-sm h-10 px-3 border outline-none focus:border-blue-500"
          />
        </div>
      )}

      <Button
        onClick={onApplyFilter}
        className="ml-auto bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
      >
        <Filter className="w-4 h-4" />
        Lọc dữ liệu
      </Button>
    </div>
  );
}
