import axiosClient from "@/lib/axiosClient";
import type { ApiResponse, PageResponse } from "@/types/base/apiResponse";
import type {
  SongResponse,
  SongResponseWithAllAlbum,
  SongRequest,
} from "@/types/music";
import { createFormDataForSong } from "./helpers/formDataHelper";

const BASE_URL = "";

/**
 * CRUD service for Song entity
 */
export const songCrudService = {
  /**
   * Get all songs with pagination
   */
  getAll: async (
    page: number = 0,
    size: number = 20,
    sort: string = "title",
    direction: "ASC" | "DESC" = "ASC"
  ): Promise<PageResponse<SongResponseWithAllAlbum>> => {
    const response = await axiosClient.get<
      ApiResponse<PageResponse<SongResponseWithAllAlbum>>
    >(`${BASE_URL}/songs/all`, {
      params: { page, size, sort, direction },
    });
    return response.data.data;
  },

  /**
   * Get song by ID
   */
  getById: async (id: number): Promise<SongResponseWithAllAlbum> => {
    const response = await axiosClient.get<
      ApiResponse<SongResponseWithAllAlbum>
    >(`${BASE_URL}/songs/${id}`);
    return response.data.data;
  },

  /**
   * Search songs by title with pagination
   */
  search: async (
    title: string,
    page: number = 0,
    size: number = 20
  ): Promise<PageResponse<SongResponse>> => {
    const response = await axiosClient.get<
      ApiResponse<PageResponse<SongResponse>>
    >(`${BASE_URL}/songs/search`, {
      params: { title, page, size },
    });
    return response.data.data;
  },

  /**
   * Filter songs by genre with pagination
   */
  filterByGenre: async (
    genreId: number,
    page: number = 1,
    size: number = 20
  ): Promise<PageResponse<SongResponseWithAllAlbum>> => {
    const response = await axiosClient.get<
      ApiResponse<PageResponse<SongResponseWithAllAlbum>>
    >(`${BASE_URL}/songs/genre`, {
      params: { id: genreId, page, size },
    });
    return response.data.data;
  },

  /**
   * Create new song
   */
  create: async (data: SongRequest): Promise<SongResponse> => {
    const formData = createFormDataForSong(data);
    try {
      const response = await axiosClient.post<ApiResponse<SongResponse[] | SongResponse>>(
        `${BASE_URL}/songs/save`,
        formData,
        {
          headers: { "Content-Type": undefined } as any,
        }
      );
      // Backend might return ApiResponse<List> or Object, so handle both
      const result = response.data.data;
      return Array.isArray(result) ? result[0] : result;
    } catch (error: any) {
      console.error("[PingMe] Create Song Error Details:", error.response?.data);
      throw error;
    }
  },

  /**
   * Update existing song
   */
  update: async (
    id: number,
    data: Partial<SongRequest>
  ): Promise<SongResponse> => {
    const formData = createFormDataForSong(data);
    const response = await axiosClient.put<ApiResponse<SongResponse[] | SongResponse>>(
      `${BASE_URL}/songs/update/${id}`,
      formData,
      {
        headers: { "Content-Type": undefined } as any,
      },
    );

    // Backend returns ApiResponse<List>, so unwrap and return first item
    const result = response.data.data;
    return Array.isArray(result) ? result[0] : result;
  },

  /**
   * Soft delete song
   */
  softDelete: async (id: number): Promise<void> => {
    await axiosClient.delete<ApiResponse<void>>(
      `${BASE_URL}/songs/soft-delete/${id}`
    );
  },

  /**
   * Hard delete song
   */
  hardDelete: async (id: number): Promise<void> => {
    await axiosClient.delete<ApiResponse<void>>(
      `${BASE_URL}/songs/hard-delete/${id}`
    );
  },

  /**
   * Restore deleted song
   */
  restore: async (id: number): Promise<void> => {
    await axiosClient.put<ApiResponse<void>>(`${BASE_URL}/songs/restore/${id}`);
  },

  /**
   * Increase play count for song
   */
  increasePlayCount: async (id: number): Promise<void> => {
    await axiosClient.post<ApiResponse<void>>(`${BASE_URL}/songs/${id}/play`);
  },
};
