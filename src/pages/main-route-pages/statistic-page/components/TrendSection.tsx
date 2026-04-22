import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DailyTrendResponse } from "@/services/admin/statisticsApi";

interface TrendSectionProps {
  isLoading: boolean;
  activeTab: "auth" | "chat" | "music";
  setActiveTab: (tab: "auth" | "chat" | "music") => void;
  trendData: DailyTrendResponse[];
}

export default function TrendSection({
  isLoading,
  activeTab,
  setActiveTab,
  trendData,
}: TrendSectionProps) {
  const getColors = () => {
    if (activeTab === "auth") return { stroke: "#2563EB", fill: "#3B82F6" };
    if (activeTab === "chat") return { stroke: "#4F46E5", fill: "#6366F1" };
    return { stroke: "#10B981", fill: "#34D399" };
  };

  const colors = getColors();

  return (
    <Card className="shadow-sm border-none rounded-2xl bg-white h-full flex flex-col">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-50 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gray-50 rounded-lg">
             <Activity className="w-5 h-5 text-gray-500" />
          </div>
          <CardTitle className="text-lg font-bold text-gray-800">Xu hướng hoạt động</CardTitle>
        </div>

        <div className="flex bg-gray-50/80 p-1 rounded-xl border border-gray-100 mt-4 sm:mt-0">
          <button
            onClick={() => setActiveTab("auth")}
            className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all duration-300 ${activeTab === "auth" ? "bg-white shadow-sm text-blue-600 scale-105" : "text-gray-500 hover:text-gray-900"}`}
          >
            Tài khoản
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all duration-300 ${activeTab === "chat" ? "bg-white shadow-sm text-indigo-600 scale-105" : "text-gray-500 hover:text-gray-900"}`}
          >
            Tin nhắn
          </button>
          <button
            onClick={() => setActiveTab("music")}
            className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all duration-300 ${activeTab === "music" ? "bg-white shadow-sm text-emerald-600 scale-105" : "text-gray-500 hover:text-gray-900"}`}
          >
            Nghe nhạc
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-6 flex-1">
        {isLoading ? (
          <div className="h-[320px] flex items-center justify-center text-gray-400 animate-pulse">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
              <p>Đang tải biểu đồ...</p>
            </div>
          </div>
        ) : (
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.fill} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={colors.fill} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F3F4F6"
                />
                <XAxis
                  dataKey="date"
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(4px)",
                  }}
                  labelStyle={{
                    color: "#374151",
                    fontWeight: "bold",
                    marginBottom: "4px",
                  }}
                  itemStyle={{
                    color: colors.stroke,
                    fontWeight: "600",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Số lượng"
                  stroke={colors.stroke}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorCount)"
                  activeDot={{ r: 6, strokeWidth: 0, fill: colors.stroke }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
