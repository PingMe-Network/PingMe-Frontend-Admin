import axiosClient from "@/lib/axiosClient";
import type { Song } from "@/types/music/song";
import type { TopSongPlayCounter, SongResponseWithAllAlbum } from "@/types/music";
import type { ApiResponse, PageResponse } from "@/types/base/apiResponse";

export const songApi = {
  getTopSongs: async (number = 10): Promise<ApiResponse<SongResponseWithAllAlbum[]>> => {
    const response = await axiosClient.get<ApiResponse<SongResponseWithAllAlbum[]>>(
      `/songs/getTopSong/${number}`
    );
    return response.data;
  },

  getSongById: async (id: number): Promise<ApiResponse<Song>> => {
    const response = await axiosClient.get<ApiResponse<Song>>(`/songs/${id}`);
    return response.data;
  },

  searchSongByTitle: async (
    title: string,
    page: number = 1,
    size: number = 20
  ): Promise<ApiResponse<PageResponse<Song>>> => {
    const response = await axiosClient.get<ApiResponse<PageResponse<Song>>>(
      `/songs/search`,
      { params: { title, page, size } }
    );
    return response.data;
  },

  /**
   * Get all songs with pagination
   */
  getAll: async (
    page: number = 0,
    size: number = 20,
    sort: string = "title",
    direction: "ASC" | "DESC" = "ASC"
  ): Promise<ApiResponse<PageResponse<SongResponseWithAllAlbum>>> => {
    const response = await axiosClient.get<
      ApiResponse<PageResponse<SongResponseWithAllAlbum>>
    >(`/songs/all`, {
      params: { page, size, sort, direction },
    });
    return response.data;
  },

  /**
   * Filter songs by genre
   */
  filterByGenre: async (
    genreId: number,
    page: number = 1,
    size: number = 20
  ): Promise<ApiResponse<PageResponse<SongResponseWithAllAlbum>>> => {
    const response = await axiosClient.get<
      ApiResponse<PageResponse<SongResponseWithAllAlbum>>
    >(`/songs/genre`, {
      params: { id: genreId, page, size },
    });
    return response.data;
  },

  /**
   * Increase play count for song
   */
  increasePlayCount: async (id: number): Promise<void> => {
    await axiosClient.post<ApiResponse<void>>(`/songs/${id}/play`);
  },

  // Rankings endpoints
  getTopSongsToday: async (limit = 50): Promise<ApiResponse<TopSongPlayCounter[]>> => {
    const response = await axiosClient.get<ApiResponse<TopSongPlayCounter[]>>(
      `/top-songs/today?limit=${limit}`
    );
    return response.data;
  },

  getTopSongsThisWeek: async (limit = 50): Promise<ApiResponse<TopSongPlayCounter[]>> => {
    const response = await axiosClient.get<ApiResponse<TopSongPlayCounter[]>>(
      `/top-songs/week?limit=${limit}`
    );
    return response.data;
  },

  getTopSongsThisMonth: async (limit = 50): Promise<ApiResponse<TopSongPlayCounter[]>> => {
    const response = await axiosClient.get<ApiResponse<TopSongPlayCounter[]>>(
      `/top-songs/month?limit=${limit}`
    );
    return response.data;
  },
};