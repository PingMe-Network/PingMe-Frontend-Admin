import { Calendar, Clock, CalendarDays } from "lucide-react";

interface FilterBarProps {
  timeRange: string;
  setTimeRange: (val: string) => void;
  customStart: string;
  setCustomStart: (val: string) => void;
  customEnd: string;
  setCustomEnd: (val: string) => void;
}

export default function FilterBar({
  timeRange,
  setTimeRange,
  customStart,
  setCustomStart,
  customEnd,
  setCustomEnd,
}: FilterBarProps) {
  return (
    <div className="flex flex-col xl:flex-row items-start xl:items-center gap-4 bg-white/70 backdrop-blur-md p-2 rounded-2xl shadow-sm border border-gray-100/50 mb-8">
      <div className="flex bg-gray-100/80 p-1 rounded-xl flex-wrap">
        <button
          onClick={() => setTimeRange("7days")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${timeRange === "7days" ? "bg-white shadow-sm text-blue-600 scale-105" : "text-gray-500 hover:text-gray-900"}`}
        >
          <Clock className="w-4 h-4" />
          7 ngày
        </button>
        <button
          onClick={() => setTimeRange("30days")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${timeRange === "30days" ? "bg-white shadow-sm text-blue-600 scale-105" : "text-gray-500 hover:text-gray-900"}`}
        >
          <CalendarDays className="w-4 h-4" />
          30 ngày
        </button>
        <button
          onClick={() => setTimeRange("3months")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${timeRange === "3months" ? "bg-white shadow-sm text-blue-600 scale-105" : "text-gray-500 hover:text-gray-900"}`}
        >
          <CalendarDays className="w-4 h-4" />
          3 tháng
        </button>
        <button
          onClick={() => setTimeRange("6months")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${timeRange === "6months" ? "bg-white shadow-sm text-blue-600 scale-105" : "text-gray-500 hover:text-gray-900"}`}
        >
          <CalendarDays className="w-4 h-4" />
          6 tháng
        </button>
        <button
          onClick={() => setTimeRange("1year")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${timeRange === "1year" ? "bg-white shadow-sm text-blue-600 scale-105" : "text-gray-500 hover:text-gray-900"}`}
        >
          <CalendarDays className="w-4 h-4" />
          1 năm
        </button>
        <button
          onClick={() => setTimeRange("custom")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${timeRange === "custom" ? "bg-white shadow-sm text-blue-600 scale-105" : "text-gray-500 hover:text-gray-900"}`}
        >
          <Calendar className="w-4 h-4" />
          Tùy chỉnh
        </button>
      </div>

      {timeRange === "custom" && (
        <div className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-300 bg-white p-1 rounded-xl border border-gray-100">
          <input
            type="date"
            aria-label="Từ ngày"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            className="text-sm font-medium text-gray-700 h-9 px-3 rounded-lg border-none outline-none focus:ring-2 focus:ring-blue-100 bg-gray-50 hover:bg-gray-100 transition-colors"
          />
          <span className="text-gray-400 text-sm font-medium px-2">đến</span>
          <input
            type="date"
            aria-label="Đến ngày"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            className="text-sm font-medium text-gray-700 h-9 px-3 rounded-lg border-none outline-none focus:ring-2 focus:ring-blue-100 bg-gray-50 hover:bg-gray-100 transition-colors"
          />
        </div>
      )}
    </div>
  );
}
