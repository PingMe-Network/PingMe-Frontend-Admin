// src/services/statisticsApi.ts
import axiosClient from "@/lib/axiosClient";

// --- Kiểu dữ liệu trả về từ Backend ---
export interface DailyTrendResponse {
  date: string;
  count: number;
}

export interface RecentActivityLog {
  id: string;
  userId: string;
  type: string;
  timestamp: string;
  details: any;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// --- Các hàm gọi API ---
// --- Các hàm gọi API (Đã thêm tham số start & end) ---
export const getAuthCount = (start?: number, end?: number) =>
  axiosClient.get<number>("/api/admin/auth-stats/count", {
    params: { start, end },
  });
export const getAuthTrend = (start?: number, end?: number) =>
  axiosClient.get<DailyTrendResponse[]>("/api/admin/auth-stats/trend", {
    params: { start, end },
  });
export const getAuthRecent = (
  page = 0,
  size = 10,
  start?: number,
  end?: number,
) =>
  axiosClient.get<PageResponse<RecentActivityLog>>(
    `/api/admin/auth-stats/recent`,
    { params: { page, size, start, end } },
  );

export const getChatCount = (start?: number, end?: number) =>
  axiosClient.get<number>("/api/admin/chat-stats/count", {
    params: { start, end },
  });
export const getChatTrend = (start?: number, end?: number) =>
  axiosClient.get<DailyTrendResponse[]>("/api/admin/chat-stats/trend", {
    params: { start, end },
  });
export const getChatRecent = (
  page = 0,
  size = 10,
  start?: number,
  end?: number,
) =>
  axiosClient.get<PageResponse<RecentActivityLog>>(
    `/api/admin/chat-stats/recent`,
    { params: { page, size, start, end } },
  );

export const getMusicCount = (start?: number, end?: number) =>
  axiosClient.get<number>("/api/admin/music-stats/count", {
    params: { start, end },
  });
export const getMusicTrend = (start?: number, end?: number) =>
  axiosClient.get<DailyTrendResponse[]>("/api/admin/music-stats/trend", {
    params: { start, end },
  });
export const getMusicRecent = (
  page = 0,
  size = 10,
  start?: number,
  end?: number,
) =>
  axiosClient.get<PageResponse<RecentActivityLog>>(
    `/api/admin/music-stats/recent`,
    { params: { page, size, start, end } },
  );

// --- Top Rankings ---
export interface TopUserResponse {
  userId: number;
  userName: string | null;
  messageCount: number;
}

export interface TopSongResponse {
  songId: number;
  songTitle: string | null;
  artistName: string | null;
  playCount: number;
}

export const getTopChatUsers = (start?: number, end?: number, limit = 5) =>
  axiosClient.get<TopUserResponse[]>("/api/admin/chat-stats/top-users", {
    params: { start, end, limit },
  });

export const getTopMusicSongs = (start?: number, end?: number, limit = 5) =>
  axiosClient.get<TopSongResponse[]>("/api/admin/music-stats/top-songs", {
    params: { start, end, limit },
  });
