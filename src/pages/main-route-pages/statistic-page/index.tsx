import { useState, useEffect } from "react";

import {
  getAuthCount,
  getAuthTrend,
  getAuthRecent,
  getChatCount,
  getChatTrend,
  getChatRecent,
  getMusicCount,
  getMusicTrend,
  getMusicRecent,
} from "@/services/admin/statisticsApi";

import type {
  DailyTrendResponse,
  RecentActivityLog,
} from "@/services/admin/statisticsApi";
import FilterBar from "./components/FilterBar";
import KpiCards from "./components/KpiCards";
import TrendSection from "./components/TrendSection";
import TopRanking from "./components/TopRanking";

export default function StatisticsManagementPage() {
  // --- States ---
  const [counts, setCounts] = useState({ auth: 0, chat: 0, music: 0 });
  const [activeTab, setActiveTab] = useState<"auth" | "chat" | "music">("auth");
  const [trendData, setTrendData] = useState<DailyTrendResponse[]>([]);
  const [recentLogs, setRecentLogs] = useState<RecentActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE CHO BỘ LỌC THỜI GIAN ---
  const [timeRange, setTimeRange] = useState("7days"); // '7days', '30days', 'custom'
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  // State này lưu Epoch Time thực tế sẽ gửi xuống API
  const [filterEpoch, setFilterEpoch] = useState<{
    start?: number;
    end?: number;
  }>({});

  // --- Fetch KPI Counts ---
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [authRes, chatRes, musicRes] = await Promise.all([
          getAuthCount(filterEpoch.start, filterEpoch.end),
          getChatCount(filterEpoch.start, filterEpoch.end),
          getMusicCount(filterEpoch.start, filterEpoch.end),
        ]);
        setCounts({
          auth: authRes.data,
          chat: chatRes.data,
          music: musicRes.data,
        });
      } catch (error) {
        console.error("Lỗi lấy dữ liệu đếm tổng:", error);
      }
    };
    fetchCounts();
  }, [filterEpoch]); // <--- Thêm filterEpoch vào đây

  // --- Fetch Trend & Recent based on Active Tab ---
  useEffect(() => {
    const fetchTabSpecificData = async () => {
      setIsLoading(true);
      try {
        let trendRes, recentRes;

        if (activeTab === "auth") {
          trendRes = await getAuthTrend(filterEpoch.start, filterEpoch.end);
          recentRes = await getAuthRecent(
            0,
            10,
            filterEpoch.start,
            filterEpoch.end,
          );
        } else if (activeTab === "chat") {
          trendRes = await getChatTrend(filterEpoch.start, filterEpoch.end);
          recentRes = await getChatRecent(
            0,
            10,
            filterEpoch.start,
            filterEpoch.end,
          );
        } else {
          trendRes = await getMusicTrend(filterEpoch.start, filterEpoch.end);
          recentRes = await getMusicRecent(
            0,
            10,
            filterEpoch.start,
            filterEpoch.end,
          );
        }

        setTrendData(trendRes.data);
        setRecentLogs(recentRes.data.content);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu chi tiết:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTabSpecificData();
  }, [activeTab, filterEpoch]); // <--- Thêm filterEpoch vào đây

  const handleApplyFilter = () => {
    const now = new Date();
    let startMs, endMs;

    if (timeRange === "7days") {
      startMs = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).getTime();
      endMs = now.getTime();
    } else if (timeRange === "30days") {
      startMs = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).getTime();
      endMs = now.getTime();
    } else if (timeRange === "custom") {
      if (!customStart || !customEnd) {
        alert("Vui lòng chọn đầy đủ ngày bắt đầu và ngày kết thúc!");
        return;
      }
      startMs = new Date(customStart).getTime();
      // Set endMs đến 23:59:59 của ngày kết thúc để lấy trọn vẹn ngày đó
      endMs = new Date(customEnd).setHours(23, 59, 59, 999);
    }

    // Cập nhật state để trigger useEffect gọi lại API
    setFilterEpoch({ start: startMs, end: endMs });
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50/50">
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Tổng quan hệ thống
        </h1>

        <FilterBar
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          customStart={customStart}
          setCustomStart={setCustomStart}
          customEnd={customEnd}
          setCustomEnd={setCustomEnd}
          onApplyFilter={handleApplyFilter}
        />

        <KpiCards counts={counts} />

        <TrendSection
          isLoading={isLoading}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          trendData={trendData}
          recentLogs={recentLogs}
        />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1">
            <TopRanking activeTab={activeTab} />
          </div>
          <div className="xl:col-span-2">
            {/* Chỗ này để trống cho tính năng khác sau này, hoặc bạn có thể kéo dài Chart xuống */}
          </div>
        </div>
      </div>
    </div>
  );
}
