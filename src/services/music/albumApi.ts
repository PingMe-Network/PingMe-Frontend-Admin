import axiosClient from "@/lib/axiosClient";
import type { ApiResponse, PageResponse } from "@/types/base/apiResponse";

export interface AlbumResponse {
  id: number;
  title: string;
  coverImgUrl: string;
  playCount: number;
}

export const albumApi = {
  getAllAlbums: async (
    page: number = 1,
    size: number = 20,
    sort: string = "title",
    direction: "ASC" | "DESC" = "ASC"
  ): Promise<PageResponse<AlbumResponse>> => {
    const response = await axiosClient.get<ApiResponse<PageResponse<AlbumResponse>>>("/albums/all", {
      params: { page, size, sort, direction }
    });
    return response.data.data;
  },

  getPopularAlbums: async (limit?: number): Promise<AlbumResponse[]> => {
    // Fetch a large page to ensure we have enough data for sorting
    const response = await axiosClient.get<ApiResponse<PageResponse<AlbumResponse>>>("/albums/all", {
      params: { page: 0, size: 100, sort: "title", direction: "ASC" }
    });
    const albums = response.data.data.content;
    const sortedAlbums = [...albums].sort((a, b) => b.playCount - a.playCount);
    return limit ? sortedAlbums.slice(0, limit) : sortedAlbums;
  },
};