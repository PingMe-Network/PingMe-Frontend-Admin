import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type {
  DailyTrendResponse,
  RecentActivityLog,
} from "@/services/admin/statisticsApi";

interface TrendSectionProps {
  isLoading: boolean;
  activeTab: "auth" | "chat" | "music";
  setActiveTab: (tab: "auth" | "chat" | "music") => void;
  trendData: DailyTrendResponse[];
  recentLogs: RecentActivityLog[];
}

export default function TrendSection({
  isLoading,
  activeTab,
  setActiveTab,
  trendData,
  recentLogs,
}: TrendSectionProps) {
  const getLineColor = () => {
    if (activeTab === "auth") return "#2563EB";
    if (activeTab === "chat") return "#4F46E5";
    return "#10B981";
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Biểu đồ Trend */}
      <Card className="xl:col-span-2 shadow-sm border-gray-100">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-gray-500" />
            <CardTitle className="text-lg">Xu hướng hoạt động</CardTitle>
          </div>

          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("auth")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === "auth" ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-900"}`}
            >
              Tài khoản
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === "chat" ? "bg-white shadow text-indigo-600" : "text-gray-500 hover:text-gray-900"}`}
            >
              Tin nhắn
            </button>
            <button
              onClick={() => setActiveTab("music")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === "music" ? "bg-white shadow text-emerald-600" : "text-gray-500 hover:text-gray-900"}`}
            >
              Nghe nhạc
            </button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              Đang tải biểu đồ...
            </div>
          ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E5E7EB"
                  />
                  <XAxis
                    dataKey="date"
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    labelStyle={{
                      color: "#4B5563",
                      fontWeight: "bold",
                      marginBottom: "4px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="Số lượng"
                    stroke={getLineColor()}
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bảng Hoạt động gần đây */}
      <Card className="shadow-sm border-gray-100 flex flex-col">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-lg">Hoạt động mới nhất</CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-6 text-center text-gray-400">
              Đang tải danh sách...
            </div>
          ) : recentLogs.length === 0 ? (
            <div className="p-6 text-center text-gray-400">Chưa có dữ liệu</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-gray-900 text-sm truncate max-w-[150px]">
                      User: {log.userId}
                    </span>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {JSON.stringify(log.details)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
