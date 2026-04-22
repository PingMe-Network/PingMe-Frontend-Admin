import { useState, useEffect } from "react";

import {
  getAuthCount,
  getAuthTrend,
  getChatCount,
  getChatTrend,
  getMusicCount,
  getMusicTrend,
} from "@/services/admin/statisticsApi";

import type { DailyTrendResponse } from "@/services/admin/statisticsApi";
import FilterBar from "./components/FilterBar";
import KpiCards from "./components/KpiCards";
import TrendSection from "./components/TrendSection";
import TopRanking from "./components/TopRanking";

export default function StatisticsManagementPage() {
  // --- States ---
  const [counts, setCounts] = useState({ auth: 0, chat: 0, music: 0 });
  const [activeTab, setActiveTab] = useState<"auth" | "chat" | "music">("auth");
  const [trendData, setTrendData] = useState<DailyTrendResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE CHO BỘ LỌC THỜI GIAN ---
  const [timeRange, setTimeRange] = useState("7days");
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
  }, [filterEpoch]);

  // --- Fetch Trend based on Active Tab ---
  useEffect(() => {
    const fetchTabSpecificData = async () => {
      setIsLoading(true);
      try {
        let trendRes;

        if (activeTab === "auth") {
          trendRes = await getAuthTrend(filterEpoch.start, filterEpoch.end);
        } else if (activeTab === "chat") {
          trendRes = await getChatTrend(filterEpoch.start, filterEpoch.end);
        } else {
          trendRes = await getMusicTrend(filterEpoch.start, filterEpoch.end);
        }

        setTrendData(trendRes.data);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu chi tiết:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTabSpecificData();
  }, [activeTab, filterEpoch]);

  const handleApplyFilter = () => {
    const now = new Date();
    let startMs, endMs;

    if (timeRange === "7days") {
      startMs = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).getTime();
      endMs = now.getTime();
    } else if (timeRange === "30days") {
      startMs = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).getTime();
      endMs = now.getTime();
    } else if (timeRange === "3months") {
      startMs = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).getTime();
      endMs = now.getTime();
    } else if (timeRange === "6months") {
      startMs = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000).getTime();
      endMs = now.getTime();
    } else if (timeRange === "1year") {
      startMs = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).getTime();
      endMs = now.getTime();
    } else if (timeRange === "custom") {
      if (!customStart || !customEnd) {
        return; // Đợi người dùng chọn đủ 2 ngày thì mới lọc
      }
      startMs = new Date(customStart).getTime();
      endMs = new Date(customEnd).setHours(23, 59, 59, 999);
    }

    setFilterEpoch({ start: startMs, end: endMs });
  };

  // Tự động gọi hàm lọc mỗi khi timeRange, customStart hoặc customEnd thay đổi
  useEffect(() => {
    handleApplyFilter();
  }, [timeRange, customStart, customEnd]);

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
        />

        <KpiCards counts={counts} />

        <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <TrendSection
              isLoading={isLoading}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              trendData={trendData}
            />
          </div>
          <div className="xl:col-span-1">
            <TopRanking activeTab={activeTab} filterEpoch={filterEpoch} />
          </div>
        </div>
      </div>
    </div>
  );
}
